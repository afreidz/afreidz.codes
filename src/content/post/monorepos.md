---
title: "I caught mono. A story about monorepos"
description: "I was asked about my thoughts on using nx/turbo for an upcomming project and I had a relavant experience recently"
publishedDate: "17 Oct 2023"
tags: ["monorepo"]
---

## Dear Diary

Today I was asked about my thoughts on using [nx](https://github.com/nrwl/nx) and/or [turbo](https://github.com/vercel/turbo) for an upcomming project. I have only dabbled in both of these tools, but it reminded me of a story that had happend waaaaay back earlier that week.

Let me start by saying that I am **PRO** monorepositories. Ever since we started down the road of "microservice all the things" it became apparent, rather quickly, that meant a metric crap-ton of git repos. And I think we all underestimated the overhead of managing everything thru tools like [npm](https://npmjs.org).

> How can we avoid the pains of dependency management _and_ still promote smaller domain-specific units of code?

You may think `monorepositories` because, well, that was _supposed_ to be an answer.

## Like, so ick!

So I was playing around with a newer component library on a separate react project. I am one of those old skool front-end guys that will shout:

> No self-respecting front-end developer would ever use a 3rd party component library! YARGGHHH!!!!

... yet secretly has a half-dozen repos of self-made public ones that never will see the light of day. But that is a topic for another post. [_\*\* link to future post here \*\*_]()

This library was part of a monorepo that hosted (rough estimate) 2 dozen packages. I came across a bug that I wanted to file in the GH repo. As a good citizen, I tried to look at the existing issues to make sure it wasn't a dupe.

## Why do you have so many issues?!?!?

Oh yea, because the GH issues is singular/common across **all** packages in the monorepo. After about 15 mins or so, I gave up because there was so much noise from un-related packages, so I just opened the ticket anyway.

As luck would have it, the ticket _was_ dupe that already had a merged resolution. I thought I would poke around at the repo to see if I could track down this merge commit and see if it was deployed.

_\*\* Checks `tags` and `releases` \*\*_ Uhhh wut? Every package had contributed tags and none of them made sense. Every package had different version numbers ... as they should. There was no indicator of what package release the tag was intended to represent. Releases? Nah, don't need em. This is the opposite of fun.

In the end I got a faster response from a maintainer on my closed GH issue than it would have taken me to find the state of that commit myself!

## Shut up-ah!

At this point, you astute reader, you are probably thinking about how issue search tags/filters could be used to help me find that dupe. Or how I could use this process in GH to track down the commit relative to the npm package. Blah blah. There is **always** a way. But its not very idiomatic. The tools weren't designed around monorepos.

This is where [nx](https://github.com/nrwl/nx) and [turbo](https://github.com/vercel/turbo) have made their home. Not necessarily to solve the above issues, but to fill the gaps in tooling in attempts to make monorepos seem more appealing. Their software is pretty brilliant, albeit a non-zero learning curve.

Maximizing build concurrency is fun at the start, but becomes quite the brain exercise at scale. We can cache build results and share them over the cloud with our team? What!?!?! 🤯 What an amazing, and simultaneously ridiculous, idea! Why make 2 machines do the work that 1 already did? [Victor](https://github.com/vsavkin) and [Jared](https://github.com/jaredpalmer) are nuts ... _the good kind_&trade;!

## Whoa, what just happened?

This post had nothing to do with the merits of [nx](https://github.com/nrwl/nx) and [turbo](https://github.com/vercel/turbo). It also doesn't mean that I suggest we go _away_ from monorepos. It just illustrated one instance of a pain point I have with them. As a single developer maintained project, they shine! So do the tools to support them. At scale, things are a bit more tricky.

If you do want to use a monorepo approach, take the time to setup your processes specifically around them. Invest in understanding the tools used to support them. [Turbo](https://github.com/vercel/turbo) and [nx](https://github.com/nrwl/nx) aren't silver bullet solutions, they require some cognitive overhead to be useful. It is worth that investment IMO. Careful release planning and issue tagging are equally important to nail down before your repo grows too large.

If all of this sounds like a lot to think about, welcome to the web-development ecosystem! Tune in next month, when I have finally finished boilerplating the monorepo for this new project we are starting.
