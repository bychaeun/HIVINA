# HIVINA LPM 3D preview

Interactive material assembly study, based on the supplied three-part reference:

1. MDF core board
2. Decorative paper with the woodgrain rotated 90 degrees
3. Separate translucent resin sheet for visual explanation

The geometry is for presentation, with relative dimensions rather than manufacturing specifications. The board currently uses an MDF fibre material; the UI identifies the core category as MDF / PB.

## Preview

Run `npm install` and `npm run dev`, then open `/3d/lpm-preview.html`.

- The board, decorative paper, and resin sheet drop into place in sequence.
- Click or tap the model to separate the layers and show their names with leader lines.
- Click again to reassemble. Drag to orbit and scroll to zoom.
- The orbit target follows the assembly's geometric centre. Tap recentering and panning are disabled.
- Bonded coating darkens the decorative paper by a perceived 25%, with a linear-light conversion. Separation restores the original colour.
- Paper and MDF have minimal specular reflection; resin has a slightly stronger, soft reflection.
- The board has a small bevel (0.006 relative units).
- Reduced-motion preferences skip animation to the final state.

## Files

- `public/models/lpm-assembly.glb`: self-contained model with embedded textures, independent `Core_Board`, `Decorative_Paper`, and `Resin_Sheet` nodes, plus `Assemble`, `Expand`, and `Collapse` animation clips.
- `public/3d/lpm-preview.html`: preview layout and anchored callouts.
- `public/3d/lpm-preview.js`: interaction, animation playback, centred camera target, and coating colour transition.
- `scripts/build-lpm-model.mjs`: reproducible GLB builder; run `node scripts/build-lpm-model.mjs` from the repository root. Uses the existing `sharp` dependency and the tracked HIVINA decorative texture at `src/assets/imported/df86797add0c54.webp`.
- `public/3d/vendor/model-viewer.min.js`: Google model-viewer 4.1.0, vendored from the official Google CDN. See `vendor/LICENSE`.

The geometry and animation clips are embedded in the GLB. The interactive colour transition, annotations, and camera behaviour are controlled by the preview JavaScript.

This is a standalone preview and does not replace a production product page.

## Validation

The generated GLB was checked with Khronos glTF Validator: zero errors and warnings. The preview JavaScript passes `node --check public/3d/lpm-preview.js`.
