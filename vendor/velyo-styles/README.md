# Velyo visual reference

These four stylesheets are an unchanged snapshot from the owner's Velyo project,
commit `caa1462`, used for the requested Aurevia public-site adaptation.

They are inputs to `scripts/sync-velyo-public-styles.mjs`, not runtime imports.
The generator changes brand colors, names, asset paths and selector scoping;
the public refresh tests verify preservation of layout and typography values.

Keeping the exact inputs here makes generation and tests reproducible without
checking out the full Velyo repository or publishing local research and exports.
