"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const hero = video.closest(".hero-aurevia");
    const usesOperaFallback = /OPiOS|Opera|OPR\//i.test(navigator.userAgent);

    if (usesOperaFallback) hero?.classList.add("opera-fallback");

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const play = () => {
      if (document.visibilityState === "visible" && video.paused) {
        void video.play().catch(() => undefined);
      }
    };

    const removeGestureListeners = () => {
      document.removeEventListener("touchstart", play);
      document.removeEventListener("pointerdown", play);
    };
    const showVideo = () => video.classList.add("is-playing");
    const showFallback = () => video.classList.remove("is-playing");

    const retryTimers = [250, 700, 1500, 3000].map((delay) => window.setTimeout(play, delay));
    play();
    video.addEventListener("loadedmetadata", play);
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    video.addEventListener("canplaythrough", play);
    window.addEventListener("pageshow", play);
    window.addEventListener("focus", play);
    document.addEventListener("visibilitychange", play);
    document.addEventListener("touchstart", play, { passive: true });
    document.addEventListener("pointerdown", play, { passive: true });
    video.addEventListener("playing", removeGestureListeners);
    video.addEventListener("playing", showVideo);
    video.addEventListener("pause", showFallback);

    return () => {
      hero?.classList.remove("opera-fallback");
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      video.removeEventListener("loadedmetadata", play);
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      video.removeEventListener("canplaythrough", play);
      window.removeEventListener("pageshow", play);
      window.removeEventListener("focus", play);
      document.removeEventListener("visibilitychange", play);
      removeGestureListeners();
      video.removeEventListener("playing", removeGestureListeners);
      video.removeEventListener("playing", showVideo);
      video.removeEventListener("pause", showFallback);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/images/home/hero-mobile-poster.webp"
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      aria-hidden="true"
    >
      <source src="/videos/genova-hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/videos/genova-hero.mp4" type="video/mp4" />
    </video>
  );
}
