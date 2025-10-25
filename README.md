# saxrag.com

This is my jekyll blog / website

I am a jekyll noob so this is probably not the best way to do it

Self hosted on https://saxrag.com

## Images

Typically, I'd convert the `jpeg` from my camera (phone) to `avif` via:

```
magick -quality 70 20241011_164427.JPG 20241011_164427.avif
```

Copy them over to my R2 bucket via:
```
rclone copy ./ --include "20241011_164427*" r2demo:assets/heihe/ -vP
```

or, save all the files I want to copy in `copylist.txt` and then:
```
rclone copy --files-from copylist.txt ./ r2demo:assets/heihe/ -vP
```

Where in this example `/heihe/` is the folder I'd want the related photos in

and finally use `<picture>` to optimistically load the `avif` with a fallback to `jpg`:

```html
<picture>
  <source srcset="https://saxrag.com/bucket/heihe/20241011_164427.avif" type="image/avif">
  <img src="https://saxrag.com/bucket/heihe/20241011_164427.JPG">
</picture>
```
