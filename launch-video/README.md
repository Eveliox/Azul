# Azul launch video

38-second brand launch film for Azul's website and AI services, based on azulwebdev.com and its local brand assets.

## Deliverables

- `Azul-launch-1080p.mp4` — 1920 × 1080, 30 fps, horizontal.
- `Azul-launch-vertical-1080x1920.mp4` — 1080 × 1920, 30 fps, vertical layout for social posts.
- `Azul-original-soundtrack.wav` — original synthesized instrumental music and transition effects, stereo 48 kHz.
- `storyboard-wide.jpg` and `storyboard-vertical.jpg` — scene contact sheets.
- `render.py` — editable animation source. Uses Pillow, NumPy, and imageio-ffmpeg.

Both videos use animated text and music. There is no spoken narration. Visuals are rendered at 1280 × 720 / 720 × 1280 and scaled to their final HD dimensions. UI scenes illustrate the services; they are not recorded customer interactions. The Aspire Roofing scene uses the existing portfolio image.

## Timing and on-screen copy

| Time | Message |
|---|---|
| 0–5 | Good work. Deserves to be seen. |
| 5–9 | Introducing Azul. Your business. Connected. |
| 9–15 | Make a great first impression. Website design. |
| 15–21 | Be found. Build trust. Local visibility and honest customer reviews. |
| 21–27 | Answer the call. Even after hours. English + Español. |
| 27–32 | One team. Connected tools. Website design, local visibility, review requests, AI answering. |
| 32–38 | Built for your next chapter. Book a free discovery call. azulwebdev.com. |

## Rebuild

Run from the Azul-main directory:

```powershell
python launch-video/render.py
```

The exporter loads imageio-ffmpeg from `tmp/video-tools`. The script does not modify or deploy the website.
