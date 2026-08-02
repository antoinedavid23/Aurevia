"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const play = () => {
      if (document.visibilityState === "visible" && video.paused) {
        void video.play().catch(() => undefined);
      }
    };

    play();
    video.addEventListener("canplay", play);
    window.addEventListener("pageshow", play);
    document.addEventListener("visibilitychange", play);
    document.addEventListener("touchstart", play, { passive: true, once: true });

    return () => {
      video.removeEventListener("canplay", play);
      window.removeEventListener("pageshow", play);
      document.removeEventListener("visibilitychange", play);
      document.removeEventListener("touchstart", play);
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
      poster="/images/home/hero-concierge.webp"
      aria-hidden="true"
    >
      <source src="/videos/genova-hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/videos/genova-hero.mp4" type="video/mp4" />
    </video>
  );
}
