# Home wave film

The user-supplied `16317558_2560_1440_60fps.mp4` powers the hero through an optimized copy at `public/videos/hero-waves.mp4` (1280 × 720, 24 fps, H.264, muted, fast-start MP4, approximately 4.3 MB). The original is unchanged. `public/images/hero-waves.jpg` is a matching still extracted from the source.

`src/components/site/HeroFilm.jsx` handles playback, the localized pause/play control, offscreen and hidden-tab pausing, and failure fallback. Reduced-motion users initially receive the still without loading the video; they can explicitly start playback. Styles apply a navy grade, contrast-preserving overlays, a gradual video appearance, and mobile framing. The encoder was installed temporarily outside the app; no app dependency was added.

Verification: initial browser checks passed for autoplay, pause/play, offscreen pause/resume, Spanish mobile layout, reduced-motion still, and explicit playback with reduced motion. Final output is approximately 95% smaller than the supplied source.
