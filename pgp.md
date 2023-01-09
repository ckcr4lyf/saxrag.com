---
layout: page
title: PGP & its importance
---

## tl;dr

PGP allows you to verify that a message is really from the person whom the sender claims they are. It also allows you to encrypt messages, knowing _only_ the intended recipient(s) can decrypt and read them.

## Introduction

Communicating online (or offline, but indirectly), has two main issues surrounding privacy & security:

* Making sure no one else other than the intended recipient can read the contents of the message
* Ensuring that a message is really from whom it claims to be from

PGP is a system to help guarantee either one or both of the above. 

In this post, we will focus mostly on determining the identity of the sender and confirming its authenticity, as well as discuss why centralized institutions can't be trusted. Finally, we will briefly cover encryption as well.

## The problem with messaging services

When you see someone's tweet, or receive an E-Mail, or get DM'd on Instagram - how do you really know its from whom they claim to be? Most likely, your answer would be "because it's from their account". But how much control does an end user have over their account really?

For E-Mail, they're most likely using a service such as Gmail or similar, in which case Google is the one who is truly in control of the account. Your username + password (+ 2FA) is a valid guard against external attackers. However, Google itself could technically send email's via your account without your consent.

If you're using Instagram, whenever you receive a message, you can see the username of the account which sent it to you. But again, Instagram (or Meta) employees may have access to accounts in such a manner, that they can send messages directly, "from" someone else's account, such that it shows up in both people's accounts. You're not the true "owner" of the account, Meta is.

If you're not convinced yet, let's look at twitter. Similar to the above two scenarios, some Twitter employees might have the ability to tweet from your account, pretending to be you. In fact, they definitely do (or at least did) have internal tools to reset account authentication, _despite_ end user's 2FA. Even if they do not use it maliciously, external attackers might be able to compromise them and assume control. 

This is exactly what happened in 2020, when over a 100 high profile accounts were hijacked to post cryptocurrency scams. Given the reach of some of these accounts, it isn't hard to imagine how much more real world damage could be done, for instance by tweeting misleading information about stocks or politics from these accounts.

## Digital Signatures

Digital signatures are a tool that can help us verify the identity of a message's sender. The term "signature" is used as it is similar to how people would sign on documents or cheques as a way to "confirm" that it was really them - they authorized the transaction. However, unlike pen-and-paper signatures, digital signatures are extremely difficult to forge.


To explain how they work, we imagine a scenario where Alice (the sender) wants to send a message to Bob (the recipient). Alice has a pair of keys - a private key, which she keeps secret, and a public key, which she gives to Bob. Alice can then use her private key to "sign" the message, producing a digital signature. When bob receives the signed message, he can verify the signature using the Alice's public key. 

The actual signing and verification processes are mathematical operations, but basically a valid signature tells Bob that "whomever sent this message holds Alice's private key". It is Alice's duty to keep her private key, well, private. If she prepares the signed message on her own computer, then she could send it over any channel - Email, Twitter, Instagram or Reddit, while allowing Bob (or anyone else) to guarantee the message really came from her.

### Encryption

Bob would also have a keypair. If Alice has Bob's public key, she can encrypt the message such that only Bob can decrypt it. This helps guarantee that no one in the middle can see it (e.g. Google, Meta).

## The Key Exchange Problem

The keys mentioned above are usually either very large numbers (e.g. when using RSA), or points on an elliptic curve (e.g. when using ECDSA). Alice needs to generate her keys (the public/private keypair) on her own computer, which is simple. However, for Bob to verify Alice's signature, he needs to get her public key. 

This poses a problem - how does Alice send the public key she generated to Bob? Since Bob doesn't have her public key yet, he cannot trust a message sent over any channel. One of the ways is to send it over an insecure channel anyway, but then to _compare it in real life_. For this, Alice & Bob would meet up and confirm that Bob received the correct key, without any tampering.


