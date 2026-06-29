from PIL import Image
import os

base = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "public", "images")
)
old_path = os.path.join(base, "logo-old.png")
new_path = os.path.join(base, "logo-new.png")
out_path = os.path.join(base, "logo.png")

old = Image.open(old_path).convert("RGBA")
new = Image.open(new_path).convert("RGBA")
nw, nh = new.size
ow, oh = old.size

emblem_top = int(nh * 0.12)
emblem_bottom = int(nh * 0.46)
emblem = new.crop((0, emblem_top, nw, emblem_bottom))

text_top = int(oh * 0.36)
text_block = old.crop((0, text_top, ow, oh))

emblem_target_w = ow
emblem_target_h = int(emblem_target_w * (emblem.height / emblem.width))
emblem_resized = emblem.resize((emblem_target_w, emblem_target_h), Image.LANCZOS)

total_h = emblem_target_h + text_block.height
combined = Image.new("RGBA", (ow, total_h), (0, 0, 0, 255))
combined.paste(emblem_resized, (0, 0), emblem_resized)
combined.paste(text_block, (0, emblem_target_h), text_block)

combined.save(out_path)
print(f"Saved {out_path} ({combined.size})")
