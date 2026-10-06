# Verification links

One file per framework, named by its registry id: `<framework-id>.json`, matching
`data/frameworks/<framework-id>.json`. Each file links verification methods from
`data/verification-methods.json` to that framework's controls.

The format is defined in `data/verification-links-schema.json` and explained in
[docs/VERIFICATION_METHODS.md](../../docs/VERIFICATION_METHODS.md).
`scripts/validate.js` checks every file here.
