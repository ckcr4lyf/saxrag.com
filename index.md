---
layout: home
title: Home
---

### About

I am a developer who enjoys server side technologies, encryption and privacy. I also love networking (The TCP/IP kind) and writing software revolving around such stuff.


[qbit-race](https://github.com/ckcr4lyf/qbit-race) is a utility I wrote around managing torrents, sending notifications and configuring rules to extract the maximum "racing" performance out of qBittorrent. Loved by members of the seedboxing community, it's one of my projects I am most proud of.

[kiryuu](https://github.com/ckcr4lyf/kiryuu) is a bittorrent tracker I wrote in Rust. Inspired by bittorrent & my interest in peer-to-peer technologies, I decided to write my own tracker, the first being [in typescript](https://github.com/ckcr4lyf/kouko). I deployed it for public use (at tracker.mywaifu.best), and after hitting performance limits, [rewrote it in Rust](https://saxrag.com/programming/2022/06/05/Rust.html).

[torrent-stats](https://github.com/ckcr4lyf/torrent-stats) is one of my first "real programs" that I wrote in C/C++, which utilizes C sockets to query UDP bittorrent trackers and C++ threads to parallelize the job, fetching a list of IPs that are sharing a particular torrent.  (soon to be oxidized???)

[stdinman](https://github.com/ckcr4lyf/stdinman) is a small tool I wrote to stream arbitrary audio from stdin to Discord via a bot, with the initial goal to play my Vinyl for my friends.


### Experience

My software engineering experience lies primarily in backend technologies, though I also do dabble in infrastructure related components such as docker / kubernetes and the like. I am a huge typescript fanboy, slowly getting converted to Rust, and also write a fair amount of Go.

For all my projects, I like to implement and do as much as I can myself - for instance avoid using tiny libraries (which exist for a good reason) and instead write the implementation myself. This stubornness has led to me learning a lot of things which I otherwise would have taken for granted.
	
As an example, I wrote my own Prometheus exporter for my bittorrent tracker kouko, which allowed me to have very fine grained control over how the metrics were exported. I like to host all my projects myself, which has taught me a lot about deployment and infrastructure management, such as using reverse proxies (my favorite being nginx), TCP tuning the kernel when dealing with large request volumes, handling domains and SSL certs, and of course, monitoring & logging! 

#### Questions?

<a href="mailto:poiasdpoiasd@live.com">Email Me!</a> and [please use my PGP key](/assets/pgp/Raghu_Saxena_poiasdpoiasd@live.com_0xA1E21ED06A67D28A.asc) to encrypt all communications.


### I use arch, btw

