---
layout: page
title: PGP & its importance
---

On the Internet, nobody knows ~~you're a dog~~ if its _really_ you

## Introduction

Communicating online, has two main issues surrounding privacy & identity:

* Making sure no one else other than the intended recipient can read the contents of the message
* Ensuring that a message is really from whom it claims to be from

PGP is a system to help perform these two tasks. In this post, we will focus mostly on issues regarding the identity of a sender and confirming it's legitimacy. Ensuring no one else can _read_ the message is out of scope. 

By the end, I will provide you with an opportunity to get a free beer!

## The problem with messaging services

When you see someone's tweet, or receive an E-Mail, or get DM'd on Instagram - how do you really know its from whom they claim to be? A common answer would be "because it's from their account". But how much control does an end user really have over their social media, or even E-Mail accounts?

For **E-Mail**, most people use a service such as Gmail or similar, in which case Google is the one who is truly in control of the account. Your username + password (+ maybe 2FA) is a valid guard against _external attackers_. However, Google itself could technically send an email, appearing to be from your account, without your consent.

If you're using **Instagram**, whenever you receive a message, you can see the username of the account which sent it to you. But again, Instagram (or Meta) employees may have access to accounts in such a manner, that they can send messages directly, "from" someone else's account, such that it shows up in both people's accounts. You're not the true "owner" of the account, Meta is.

Lastly, let's look at **Twitter**. Similar to the above two scenarios, some Twitter employees might have the ability to tweet from your account, pretending to be you. In fact, they definitely do (or at least did) have internal tools to reset account authentication, _despite_ an end user's 2FA. Even if they do not use it maliciously, external attackers might be able to compromise these tools and misuse them. 

In fact, this is exactly what happened in 2020, when over a 100 high profile accounts were hijacked to post cryptocurrency scams. These tweets appeared to be authored by these prominent public figures, with nothing out of the ordinary about them (apart from the obviously suspicious scammy nature of them). This attack happened by targeting Twitter directly, so it didn't matter what precautions an individual user took, since Twitter has ultimate control of the account.

![Example of Bill Gates hijacked tweet](/assets/images/pgp/twitter.png)
*A tweet from Bill Gates's account during the Twitter hack*

## Digital Signatures

Digital signatures are a tool that can help us verify the identity of a message's sender. The term "signature" is used as it is similar to how people would sign on documents or cheques as a way to "prove" that it was really them - they authorized the transaction. However, unlike pen-and-paper signatures, digital signatures are extremely difficult to forge. 

Digital signatures require generating two "keys" - keys being very large numbers, one which you keep private (used for signing messages), and one which is public (used by people to verify that _you_ signed a message). These "keys" must be generated on your own computer, using free & open source software, such as [GnuPG](https://www.gnupg.org/). This ensures that you don't need to rely on third party services, and are the _only_ person in possession of your own private key. The public & private key are related to each other, and are generated at the same time. 

To explain how they work, we imagine a scenario where **Alice (the sender)** wants to send a message to **Bob (the recipient)**. Alice should have generated her PGP keys, and shared her _public key_ with Bob. Alice can then use her private key to "sign" the message, producing a digital signature. When bob receives the signed message, he can verify the signature using the Alice's public key. 

The actual signing and verification processes are mathematical operations, but basically a valid signature tells Bob that "whomever sent this message knows Alice's private key, since they were able to generate a valid signature". It is Alice's duty to keep her private key, well, private. Once she signs the message on her own computer, she could send it over any channel - Email, Twitter, Instagram or Reddit, while allowing Bob (or anyone else) to guarantee the message really came from her.

P.S. If you want to see some examples of digital signatures, [I've included them at the end!](#signing--verification-in-action)


## The Key Exchange Problem

The keys mentioned above are very very large numbers. Recall that Alice needs to generate her keys (the public/private keypair) on her own computer, which is simple. However, for Bob to verify Alice's signature, he needs to somehow get her public key. 

This poses a problem - how does Alice send the public key she generated to Bob? Since Bob doesn't have her public key yet, he cannot trust that a public key sent to him over Email or Facebook is really Alice's public key. The solution is rather primitive: Alice & Bob need to meet and exchange their keys _in real life_, in order to guarantee no one in the middle has tampered with the key.

A common compromise is to exchange keys digitally anyway, for instance via E-Mail. But until you've met them in person, you mark the key as unverified - so can at least being to communicate with the second party. Later on, when you meet them in real life and verify keys, you can mark it as verified, which can then give confidence in future messages.

![Example of Bill Gates hijacked tweet](/assets/images/pgp/thunderbird.png)
*Key acceptance options in [Thunderbird](https://www.thunderbird.net/), a popular open source email client*

### Free Beer

If you're interested in PGP, and want to exchange keys with me IRL, I would be more than happy to try and arrange such a meeting. Please <a href="mailto:poiasdpoiasd@live.com">contact me via email</a>, and [use my PGP key](/assets/pgp/Raghu_Saxena_poiasdpoiasd@live.com_0xA1E21ED06A67D28A.asc) to encrypt & sign the email (but don't mark it as verified yet!). On a successful key exchange, I'll buy you a beer!

## Appendix

### Signing & Verification in action

This is not meant to be a guide / tutorial on how to use GPG for signing & verification. Rather it's just to give a small taste, and increase your interest to try it yourself

Signing a message with my own private key:

```
$ echo "This is really me" | gpg --clearsign --armor --out signed.asc
$ cat signed.asc
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

This is really me
-----BEGIN PGP SIGNATURE-----

iHUEARYIAB0WIQRgCvAcYAVfkwM+dkRiUPnKH1Pl9AUCZCe54wAKCRBiUPnKH1Pl
9GZlAQCQV4Yb2ikfMJwWKiyeQZSi0tovtYPx560h6n1sHKM/UQD/b/XORmsuFwrl
f/R0XYyRu7YZ9uHQZdcXdw/OVJ+8xg4=
=Y4tg
-----END PGP SIGNATURE-----
```

Verifying a signed message (The corresponding public key must be imported into GPG):

```
$ gpg --verify signed.asc
gpg: Signature made Sat Apr  1 12:58:11 2023 HKT
gpg:                using EDDSA key 600AF01C60055F93033E76446250F9CA1F53E5F4
gpg: Good signature from "Raghu Saxena <poiasdpoiasd@live.com>" [ultimate]
```
