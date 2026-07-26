#!/usr/bin/env python3
"""Remove privacy-sensitive JPEG metadata without re-encoding image pixels."""

from __future__ import annotations

import argparse
import os
from pathlib import Path


REMOVED_MARKERS = {
    0xE1,  # APP1: EXIF, GPS and XMP
    0xED,  # APP13: IPTC / Photoshop metadata
    0xFE,  # COM: free-form comments
}
STANDALONE_MARKERS = {0x01, *range(0xD0, 0xDA)}


def strip_metadata(data: bytes) -> tuple[bytes, int]:
    if not data.startswith(b"\xff\xd8"):
        raise ValueError("not a JPEG")

    output = bytearray(data[:2])
    offset = 2
    removed = 0

    while offset < len(data):
        marker_start = offset
        if data[offset] != 0xFF:
            raise ValueError(f"invalid marker at byte {offset}")

        while offset < len(data) and data[offset] == 0xFF:
            offset += 1
        if offset >= len(data):
            raise ValueError("truncated marker")

        marker = data[offset]
        offset += 1

        if marker == 0xDA:  # Start of scan: copy compressed pixels unchanged.
            output.extend(data[marker_start:])
            return bytes(output), removed

        if marker == 0xD9:  # End of image without a scan.
            output.extend(data[marker_start:offset])
            return bytes(output), removed

        if marker in STANDALONE_MARKERS:
            output.extend(data[marker_start:offset])
            continue

        if offset + 2 > len(data):
            raise ValueError("truncated segment length")
        segment_length = int.from_bytes(data[offset:offset + 2], "big")
        if segment_length < 2:
            raise ValueError("invalid segment length")

        segment_end = offset + segment_length
        if segment_end > len(data):
            raise ValueError("truncated segment")

        if marker in REMOVED_MARKERS:
            removed += 1
        else:
            output.extend(data[marker_start:segment_end])
        offset = segment_end

    raise ValueError("missing JPEG scan")


def jpeg_files(roots: list[Path]) -> list[Path]:
    return sorted(
        path
        for root in roots
        for path in root.rglob("*")
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg"}
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("roots", nargs="+", type=Path)
    parser.add_argument(
        "--check",
        action="store_true",
        help="report files that still contain removable metadata",
    )
    args = parser.parse_args()

    files = jpeg_files(args.roots)
    changed = 0
    removed_segments = 0
    removed_bytes = 0

    for path in files:
        original = path.read_bytes()
        stripped, removed = strip_metadata(original)
        if not removed:
            continue

        changed += 1
        removed_segments += removed
        removed_bytes += len(original) - len(stripped)

        if args.check:
            continue

        temporary = path.with_name(f".{path.name}.metadata-tmp")
        temporary.write_bytes(stripped)
        os.chmod(temporary, path.stat().st_mode)
        os.replace(temporary, path)

    action = "found" if args.check else "removed"
    print(
        f"{action} {removed_segments} metadata segments in "
        f"{changed}/{len(files)} JPEG files ({removed_bytes} bytes)"
    )
    return 1 if args.check and changed else 0


if __name__ == "__main__":
    raise SystemExit(main())
