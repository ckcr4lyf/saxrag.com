---
layout: post
title: "Tracking Hong Kong Typhoon Trajectory"
categories: tech
tags: hongkong typhoon hko weather
summary: Saving images from HKO's typhoon predicition to form a timelapse
---

<style>
  table,
  th,
  tr,
  td {
    border: 0px;
    text-align: center;
  }
</style>

Hong Kong receives a few typhoons every year, and the Hong Kong Observatory does a pretty good job of tracking them. Their website offers a page to view the expected trajectory and intensity of a typhoon at various levels of zoom.

Unfortunately, it seems they only provide the latest snapshot of the trajectory / path, and not historical ones. I think the historical prediction is kind of fun to look at and compare it with the actual path.

<table>
<tr>
<td>
<img src="https://saxrag.com/bucket/typhoon/ragasa_2025-09-19T22_17_26.png" height="500">
<em>Prediction as of 20th September 2025 ~0617hrs HKT</em>
</td>
<td>
<img src="https://saxrag.com/bucket/typhoon/ragasa_2025-09-23T21_18_02.png" height="500">
<em>Prediction as of 24th September 2025 ~0518hrs HKT</em>
</td>
</tr>
</table>

## Downloadng images for a timelapse

Since HKO conveniently provides a particular zoom-level of a specific typhoon at a constant URL, I just wrote a simple shell script to grab the image once an hour and save it.

Then, once the typhoon is near the end, I concatenate all the images into a timelapse using ffmpeg to make some fun videos.

<video height="600" autoplay muted controls>
  <source src="https://saxrag.com/bucket/typhoon/ragasa_zoomed_out.mp4" type="video/mp4">
</video>

## Bonus: Deduplication

Depending on the zoom level and the distance from Hong Kong, HKO might update the prediction at a lower frequency (e.g. 2 - 6 hours). In that case the script (as it is) would download duplicate images (or if I forgot to stop it till a week later). Thankfully HKO serves the exact same image, bit-for-bit. So we can do a quick `shasum` to get rid of the duplicates.

The following works well:

```
find . -maxdepth 1 -name "*.png" -print0 | xargs -0 shafind . -maxdepth 1 -name "*.png" -print0 | xargs -0 shasum | sort | uniq -w 40 | awk '{print "file " $2}'sum | sort | uniq -w 40 | awk '{print "file " $2}' > list.txt
ffmpeg -f concat -safe 0 -r 6 -i list.txt -c:v libx264 -crf 0 -vf "fps=6,format=yuv420p" output.mp4
```