from PIL import Image
import sys

def remove_checkerboard(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        r, g, b, a = item
        # Checkerboard colors are usually white (255,255,255) and light gray (e.g., 204,204,204 or 238,238,238)
        # Let's replace anything that is grayscale and very light with white or transparent
        # A typical fake checkerboard has squares of #FFFFFF and #FEFEFE or #F0F0F0
        if r > 230 and g > 230 and b > 230 and abs(r-g) < 10 and abs(g-b) < 10:
            # Replace with transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(out_path, "PNG")

remove_checkerboard('src/assets/boy.jpg', 'src/assets/boy.png')
remove_checkerboard('src/assets/girl.jpg', 'src/assets/girl.png')
