# Privacy notes

## Deferred hobby images

The hobby page remains out of scope and is not mounted. Its existing JPEG
assets stay in place for a later phase, but all EXIF, GPS, XMP, IPTC and comment
segments were removed on 2026-07-26 with
`scripts/strip_jpeg_metadata.py`. The operation preserves the compressed image
scan and does not re-encode pixels.

Verification:

```bash
python3 scripts/strip_jpeg_metadata.py --check public/hobby public/hobby-optimized
```

Expected result: `0` metadata segments in `0/148` JPEG files.

## Award certificate originals

The unused certificate PDF and PNG contained a certificate number, validation
QR code, the owner’s name, other team members’ names and instructors’ names.
Because Vite publishes every file under `public/`, both originals were moved
out of the site repository without changing their bytes:

`/Users/yvaine/Documents/current/resume/private-assets/portfolio-certificates/`

Checksums:

- `获奖证书.pdf`: `146532011501f2567f663ffc6d770945075c399b0d02470de1acc36e48a97727`
- `获奖证书.png`: `ed16c0085fe96d0727d883b5453276cbd4222d16be8b8471a839a0de119acc9d`

The originals still exist in earlier Git history. If this repository is public,
decide with the owner whether to rewrite history; that destructive operation
was intentionally not performed during the redesign.
