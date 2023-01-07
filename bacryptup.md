---
layout: page
title: bacryptup
---

## Bacryptup

[Bacryptup](https://bacryptup.saxrag.com/) is an end-to-end encrypted filesharing service I developed. It allows for both anonymous and authenticated uploads, with a focus on privacy and security. The server never knows the file contents, and cannot possibly inspect them. it can only provide a means to transfer said files to someone else.

Bacryptup is free for personal use, currently supported by donations. If you're interested in corporate deployments or solutions, contact me! I'd love to talk and work with you.

### How?
When you upload a file, you have to specify a password. (You can optionally specify an access token - this is only to check if you're eligible to upload larger files - and has no effect on the encryption / security of your files). 

The password is then used to derive an AES-256 symmetric key. An IV is randomly generated and used along with the key to encrypt the file. Then, the IV and encrypted file is sent to the server. Assuming all goes well, a FileID is returned. **The password never leaves your browser!** The IV ensures that the same file and same password dont result in the same encrypted value, and alone cannot be used for decrypting the file.

To download a file, a user must specify the FileID **and** the password. A request is sent - if the file exists, the encrypted data is downloaded. Then, the password is used again to derive the AES-256 key, which is then used to decrypt the contents **in your browser!** If a correct FileID but invalid password is given, the encrypted data *is downloaded*, but decryption fails. 

It is important to note that even if someone knows the FileID, they can download the *encrypted data*, but not decrypt it (as long as the password you use is long and secure). It is recommended to communicate the FileID and password over separate, trusted channels.

### Why?
As we make more technological advancements and have better access to the internet, privacy is decreasing. Different companies try and harvest as much data as they can, some going as far as reading your private messages.

Though quick file upload websites can do the job - your files are not encrypted, and said websites can read the files you upload to harvest data. This is especially bad if you intend to share sensitive documents. some sites may claim to "delete in 12 hours", but they could very well be keeping a copy for themselves, unbeknownst to you. Even with "established" companies such as Google Drive or OneDrive, your data is not encrypted and the company *could* read the files and view their contents.

With bacryptup, your files are encrypted in your browser, before you upload them, and so the server is never able to read them. Even if I were to make a copy (which I do not - you can check out the source) I would not be able to decrypt the data.

Bacryptup is currently funded only by donations, if you like the service please donate!

