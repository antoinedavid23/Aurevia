import { isPublicTrackingPath, readMarketingConsent } from "./marketing-consent";

export const META_PIXEL_ID = "1472942504666451";
type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Pixel;
  loaded: boolean;
  version: string;
};
type PixelWindow = Window & { fbq?: Pixel; _fbq?: Pixel };
export type TrackingEnvironment = {
  allowed: () => boolean;
  path: () => string;
  install: () => void;
  send: (...args: unknown[]) => void;
  revoke: () => void;
};

// The environment boundary lets consent and navigation be tested without sending requests to Meta.
export function createMetaTracker(env: TrackingEnvironment) {
  let initialized = false;
  let granted = false;
  let lastPage: string | null = null;
  function allowed() { return env.allowed() && isPublicTrackingPath(env.path()); }
  function revoke() {
    env.revoke();
    granted = false;
    lastPage = null;
  }
  function sync() {
    try {
      if (!allowed()) { revoke(); return; }
      if (!initialized) {
        env.install();
        env.send("consent", "grant");
        env.send("set", "autoConfig", false, META_PIXEL_ID);
        env.send("init", META_PIXEL_ID);
        initialized = true;
        granted = true;
      } else if (!granted) {
        env.send("consent", "grant");
        granted = true;
      }
      const path = env.path();
      if (lastPage !== path) {
        env.send("trackSingle", META_PIXEL_ID, "PageView");
        lastPage = path;
      }
    } catch { /* Ad blockers or unavailable tracking must never interrupt the site. */ }
  }
  return {
    sync,
    lead() {
      try {
        if (!allowed()) { revoke(); return; }
        sync();
        if (initialized && granted) env.send("trackSingle", META_PIXEL_ID, "Lead");
      } catch { /* A successful form submission stays successful when tracking fails. */ }
    },
  };
}

function clearMetaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`];
  const parts = host.split(".");
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join(".")}`);
  for (const name of ["_fbp", "_fbc"]) for (const domain of domains) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
  }
}

let browserTracker: ReturnType<typeof createMetaTracker> | undefined;
let sessionDenied = false;
function getTracker() {
  if (typeof window === "undefined") return;
  if (browserTracker) return browserTracker;
  const pixelWindow = window as PixelWindow;
  browserTracker = createMetaTracker({
    allowed: () => !sessionDenied && ["aurevia-genova.com", "www.aurevia-genova.com"].includes(window.location.hostname) && readMarketingConsent()?.choice === "accepted",
    path: () => window.location.pathname,
    install: () => {
      if (pixelWindow.fbq) return;
      const pixel: Pixel = Object.assign(function (...args: unknown[]) {
        if (pixel.callMethod) pixel.callMethod(...args);
        else pixel.queue.push(args);
      }, { queue: [] as unknown[][], loaded: true, version: "2.0" }) as Pixel;
      pixel.push = pixel;
      pixelWindow.fbq = pixel;
      pixelWindow._fbq = pixel;
      const script = document.createElement("script");
      script.id = "aurevia-meta-pixel";
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.onerror = () => {
        if (pixelWindow.fbq === pixel && !pixel.callMethod) {
          delete pixelWindow.fbq;
          delete pixelWindow._fbq;
          browserTracker = undefined;
          script.remove();
        }
      };
      document.head.appendChild(script);
    },
    send: (...args) => pixelWindow.fbq?.(...args),
    revoke: () => {
      const pixel = pixelWindow.fbq;
      // Discard events still waiting for the SDK so they cannot be replayed after withdrawal.
      if (pixel && !pixel.callMethod) pixel.queue = pixel.queue.filter(args => args[0] !== "trackSingle");
      pixel?.("consent", "revoke");
      clearMetaCookies();
    },
  });
  return browserTracker;
}

export function syncMetaTracking() { getTracker()?.sync(); }
export function setMetaTrackingConsent(accepted: boolean) {
  sessionDenied = !accepted;
  syncMetaTracking();
}
// Call only after the server has confirmed a successful submission. No form values are passed.
export function trackMetaLead() { getTracker()?.lead(); }
