---
title: "One time my bff taiwlind and I..."
description: "In defense of the tailwindcss library as a developer who has traditionally hated on similar libraries"
publishedDate: "27 Oct 2023"
tags: ["dear-diary", "tailwindcss"]
feeling: copacetic
---

## Dear Diary

Today I want to give a little love to [tailwindcss](https://tailwindcss.com) because I've seen many polarizing opinions on various [subreddits](https://www.reddit.com/r/Frontend). For the rock dwelers, [tailwindcss](https://tailwindcss.com) is a "utility-first" css library used to speed up development of eye-catching sites. It is **NOT** a component library as it is oft-confused with [tailwindui](https://tailwindui.com/) (which **IS** a component library built on top of [tailwindcss](https://tailwindcss.com)). The "utility-first" paradigm is what usually causes the polarized opinions.

## At first I was all like...

I've come across utility-based css frameworks before. Earlier versions of [Bootstrap](https://getbootstrap.com/) come to mind. I can honestly say that I have never willingly created a site using [bootstrap](https://getbootstrap.com/). I come from the early days of dom-scripting where it was _all the rage_ to start separating concerns. We don't need to litter html markup with event listeners and styles anymore. Everything can be moved to external files thus keeping our HTML markup clean and pristine!

[Bootstrap](https://getbootstrap.com/) (and [tailwindcss](https://tailwindcss.com) by extension) seemed to fly directly in the face of our notion to keep markup clean. I resisted, **HARD**. Why would I want to stick 20 items in the `class=""` attribute that could be accomplished with 1 representative class and all the same css rules in the stylesheet?

> "This is nonsense!" <br/><small>_- past me_</small>

## But then I was like...

Why am I so concerned about keeping markup clean? Does markup service a human in any way? Fairly minimally I'd argue. Functionally, markup doesnt change its meaning with 20 classes vs 1 class. I'm sure there is a point where this crosses over, but generally speaking the amount of classes needed in [tailwindcss](https://tailwindcss.com) is an upper bound in the 10s. Should I give this a try? Can a utility-first library **REALLY** become my bff 🩷?

Tuns out, it can! I started out approaching it with caution on a day where I was feeling particularly "unopinionated." I couldn't take a wiz near a tech-bro without hearing about [tailwindcss](https://tailwindcss.com). After the usual amount of pain required in setting **ANYTHING** up on a front-end project, a few things became clear real quick ...

- This tool is **EXTENSIVE**.
  - They really covered a ton of the css scope and I hadn't immediately found anything I had to go back to css for.
  - It became clear that writing css in an external file really **WAS** the anti-pattern in [tailwindcss](https://tailwindcss.com)
- Its ~~mostly~~ all about the DX (developer experience).
  - Installing the requisite editor tools opened a massive epiphany of suggestions with extensive annotations as if I was writing CSS myself!
  - Customizations in the config? The editor tool suggestions pull those in too!
- Using this tool is **NOT** a substitute for learning CSS. 👈🏻 This stuck out to me.
  - There are so many tools out there that are meant to short-circuit **actually** learning the core languages, thus promoting a crop of vendor-locked full-stack devs.
  - [tailwindcss](https://tailwindcss.com) merely extracted single css rules into utility classes, to where you don't need learn much to use it. Conversely, if you want to learn how to be effective with it, you just have to learn the core CSS language!
- Did I mention the DX?
  - It became clear that I was starting to develop UIs **CONSIDERABLY** faster when I don't have to switch contexts (both physically and mentally) from my componet to css.
  - This experience was enough for me to realize that I had too strong of a grip on the old ideal that markup should be pristine.

> "This is the greatest thing evar! <br/><small>_- recent me_</small>

## I love you, I hate you, I love you

Its not all 🦄s and 💩s tho. It **REALLY** does make for some ugly markup. I experimented with [inline fold](https://github.com/moalamri/vscode-inline-fold) to try and hide the filth while I wasn't concerning myself with styles. I even wrote an entire application using this notation:

```html
<body
  class="`"
  flex
  flex-1
  mx-auto
  text-lg
  flex-col
  max-w-5xl
  font-normal
  antialiased
  min-h-screen
  smooth-scroll
  items-stretch
  tracking-tight
  `
></body>
```

NO, not talking about my psychotic obsession with "waterfall" notation, but more the backtick single class per line notation. Which is likely invalid markup, but still does render as expected 🤷🏻‍♂️. Nothing really makes the pain go away, But dammit I am sooooo fast with [tailwindcss](https://tailwindcss.com), so I can live with that right? Most of the time. Till I can't

## Andy + [tailwindcss](https://tailwindcss.com) 4-eva!?!

I'm not sure how long I will stick with it. But I've used it on **COUNTLESS** personal projects, and a few production projects, even on this site, duh! There are still some really valid concerns beyond just the ugly markup that I didn't touch on.

I guess I just wanted to show some love to something I really thought I would immediately reject. It taught me that my old skool thinking isn't always going to hold up. Since my time with [tailwindcss](https://tailwindcss.com) I have been much more open-minded about popular tools being viable options.

If I think back, I might have given this a shot before I embraced [typescript](https://www.typescriptlang.org/), I am even more open to [react](https://react.dev/) work recently, and even am seeing some value to 3rd party component libraries! I'm in my 40s now, so I guess I need to embrace current or I might become _that one senior dev_ that everyone talks about!

If you haven't already, give it a shot! Like, **REALLY** give it a shot. Don't just look over the (amazing btw) [docs](https://tailwindcss.com/docs/installation) and immediately dismiss it. Let me know what your opinions are in the comments. Until next time, diary.

<br/>
