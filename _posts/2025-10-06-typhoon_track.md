---
layout: post
title: "Tracking Hong Kong Typhoon Trajectory"
categories: tech
tags: hongkong typhoon hko weather
summary: Saving images from HKO's typhoon predicition to form a timelapse
---

Hong Kong receives a few typhoons every year, and the Hong Kong Observatory does a pretty good job of tracking them. Their website offers a page to view the expected trajectory and intensity of a typhoon at various levels of zoom.

Unfortunately, it seems they only provide the latest snapshot of the trajectory / path, and not historical ones. I think the historical prediction is kind of fun to look at and compare it with the actual path.

TODO: Two images of ragasa prediction

## Downloadng images for a timelapse

Since HKO conveniently provides a particular zoom-level of a specific typhoon at a constant URL, I just wrote a simple shell script to grab the image once an hour and save it.

Then, once the typhoon is near the end, I concatenate all the images into a timelapse using ffmpeg to make some fun videos.

## Bonus: Deduplication

Depending on the zoom level and the distance from Hong Kong, HKO might update the prediction at a lower frequency (e.g. 2 - 6 hours). In that case the script (as it is) would download duplicate images (or if I forgot to stop it till a week later). Thankfully HKO serves the exact same image, bit-for-bit. So we can do a quick `shasum` to get rid of the duplicates.
