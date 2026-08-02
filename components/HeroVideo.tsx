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

    play();
    video.addEventListener("canplay", play);
    window.addEventListener("pageshow", play);
    document.addEventListener("visibilitychange", play);
    document.addEventListener("touchstart", play, { passive: true });
    document.addEventListener("pointerdown", play, { passive: true });
    video.addEventListener("playing", removeGestureListeners);
    video.addEventListener("playing", showVideo);
    video.addEventListener("pause", showFallback);

    return () => {
      hero?.classList.remove("opera-fallback");
      video.removeEventListener("canplay", play);
      window.removeEventListener("pageshow", play);
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
      preload="metadata"
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      aria-hidden="true"
    >
      <source src="/videos/genova-hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/videos/genova-hero.mp4" type="video/mp4" />
    </video>
  );
}
