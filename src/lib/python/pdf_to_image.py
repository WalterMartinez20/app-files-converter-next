import sys
import os
import pymupdf

def convert_pdf_to_image(input_path: str, output_path: str, dpi: int = 150):
    try:
        doc = pymupdf.open(input_path)
        total_pages = len(doc)
        if total_pages == 0:
            print("Error: Empty PDF document", file=sys.stderr)
            sys.exit(1)

        # Single-page PDF: render directly
        if total_pages == 1:
            page = doc[0]
            pix = page.get_pixmap(dpi=dpi, alpha=False)
            pix.save(output_path)
            doc.close()
            print("SUCCESS")
            return

        # Multi-page PDF: render each page and stitch vertically (up to max 15 pages)
        pages_to_render = min(total_pages, 15)
        pixmaps = []
        for i in range(pages_to_render):
            page = doc[i]
            pix = page.get_pixmap(dpi=dpi, alpha=False)
            pixmaps.append(pix)

        max_width = max(p.width for p in pixmaps)
        total_height = sum(p.height for p in pixmaps)

        combined = pymupdf.Pixmap(
            pymupdf.csRGB,
            pymupdf.IRect(0, 0, max_width, total_height),
            False
        )
        combined.clear_with(255)  # White background

        current_y = 0
        for p in pixmaps:
            x_offset = (max_width - p.width) // 2  # Center page horizontally
            combined.copy(
                p,
                pymupdf.IRect(x_offset, current_y, x_offset + p.width, current_y + p.height)
            )
            current_y += p.height

        combined.save(output_path)
        doc.close()
        print("SUCCESS")
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pdf_to_image.py <input_path> <output_path> [dpi]", file=sys.stderr)
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    resolution = int(sys.argv[3]) if len(sys.argv) > 3 else 150

    convert_pdf_to_image(input_file, output_file, resolution)
