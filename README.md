# Alche Studio — high-fidelity homepage replay

An evidence-backed recreation of the public `https://alche.studio/` homepage. It combines an editable React/Vinext layout with a procedural Three.js glass-D hero and the original environment treatment.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run build
```

The source investigation, replay manifest, QA report, screenshots, and documented fidelity gaps live under `work/alche-replay/.web-shader-extractor/`.

## Scope

- Responsive homepage and fixed navigation
- Interactive procedural Three.js glass-D emblem
- News, Works, Mission, Vision, Service, Stellla, and outro states
- Public source thumbnails, videos, GLTF geometry, and environment maps

The original site's private per-frame fluid, refraction, bloom, and transition internals are represented by an evidence-matched behavioral reconstruction; see `known-gaps.md` for the precise boundary.
