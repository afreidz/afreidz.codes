---
title: OMG! I failed the art test!?!?
description: Have you struggled with writing effective unit tests for front-end components? I have. Here are my thoughs on the matter
publishedDate: 3 Nov 2023
tags: ["dear-diary", "testing"]
feeling: opinionated
draft: true
---

## Dear Diary

Have you struggled with writing effective unit tests for front-end components? Boy howdy, I sure have! I generally have a "guarded" opinion on unit-testing in general. Its not that its a worthless endeavor, its just that **SO** many developers get it wrong, junior, senior, it doesn't matter.

There is the excruciating pain that the setup and maintenance of test environments introduce. Not to mention that silly, teeny, issue of writing **USEFUL** tests. Furthermore, how many of the test cases test **YOUR** code and not the component framework?

But, also, I've gotten to the point where I can write UI components so efficiently, that my cycle times nearly **DOUBLE** when unit testing is introduced. Add in some effective TypeScript/ESLint, and honestly, how many bugs are we preventing in the pure UI layer? How many important ones are still getting passed the unit test layer? Lets continue, shall we?

## I dunno like HALF this crap!

When looking at testing a UI component, not as a system but as a developer, there are 2 things that I want to be sure of. I want to know that the component **functions** the way I intend it, and I also want to know that it **looks** the way I intend it. At the unit test level, we can essentially throw 50% of that out the window. At the time of this post, there is no idomatic way to do visual regression **UNIT** testing. There is actually very few idiomatic solutions for any sort of automated visual regression testing **AT ANY LEVEL**.

[Chromatic](https://www.chromatic.com/) is probably one of the best visual regression tools, but its still designed around passing the results to a human. Its also not something you'd want to run locally during development of the "unit." The best we can get at the unit level, is to virtualize the DOM somehow and assert against the existence of certain DOM elements. Tools like [testing library](https://testing-library.com/) are great for that. Sometimes even snapshot testing has been used to basically assert that the HTML string that comes out of a component matches what was saved in the snapshot. These are all massive compromises!

Any front-end developer will tell you that 2 developers will produce **MASSIVELY** different HTML/CSS outputs when approching the same component. Both of them could result in a potentially pixel-identical output on screen, but its highly likely the assertions and tests would also difer. This isn't the way we hope to work.

Developer A may have:

```svelte
<p class="alert">
  <strong>Alert!</strong>
  <span>something happened</span>
</p>

<style>
  .alert {
    margin: 0;
    padding: 10px;
    font-size: 10px;
    background-color: red;
  }

  .alert strong {
    font-weight: 100;
    font-size: 1.2em;
  }
</style>
```

Developer B may have:

```svelte
<div style={`background-color: ${props.bg};`}>
  <em class="alert-heading">Alert!</em> something happened
</div>

<style>
  div {
    padding: 10px;
    font-size: 10px;
  }

  .alert-heading {
    font-weight: 100;
    font-size: 12px;
  }
</style>
```

Those likely result in acceptable outputs to the user. But their output differs fairly significantly to a test. Effective assertions would have to require deep DOM node inspection. Ive also seen implementations where `data-test` attributes are used to tag "important" nodes to assert their existence. Rarely in either case can we update this component without circling back to the test to make some associate change to the test.

Conversely on a non-visual unit, a solid test case would be entirely agnostic of the implementation. If 2 developers produced a massively different implementation, their unit test could be the same. A unit test works when it produces the same output with the same input consistently. However, tests are not good at realizing that "different" output from a front-end component doesn't necessarily mean that it **IS** different. At least not to the user.

Its been my experience that unit tests for front-end components change about as often as the source code of the component does. At that point, what are we gaining? Unit tests are not catching anything, other that the fact that we forgot to update the test when we changed the DOM structure.

## I totally tried to copy your test!

When dealing with code coverage, which I've already [covered](/post/code-coverage-is-a-poor-metric), I have learned that a simple way to decide what to test is to look for conditions within your implementation. In coverage, these are often called "branches." Aside from the obvious things like funcs/methods, these are the easiest thing to identify for a test case. Make sure you hit on all sides of the condition. When you get to front-end components, there are still some fairly obvious conditional rendering tools in a typical modern framework. So we should just hit both the `if` and the `else` to hit our coverage and move on?

[Welllll](https://youtu.be/Nl-4nHCYLyY?t=22), depending on the scenario, this is fairly pointless. Frameworks like [react 💩](https://react.dev/) (jsx more specifically), [vue 🫤](https://vuejs.org/), or [svelte 🥳](https://svelte.dev/) are all pretty mature and have a robust set of tests for their framework (ok, I can't 100% verifty this, but ... they do).

When you see code like:

```svelte
{#if isLoading}
  <Loader />
{:else}
  <Content />
{/if}
```

If we write a test to cover if `isLoading` is `true` or `false` by asserting that some DOM for `<Loader />` or `<Content />` is present...

> what are we really testing?

Sure, that's what the test coverage may want from you, but all you are really doing is RE-testing that the internals of the framework (specifically conditional rendering) are functioning. Don't do their jobs for them! A better test may be to isolate the logic for determining the value of `isLoading` and testing that all the parameters involved in that calculation lead to the appropriate truthy/falsy output. If we know that, we can say with confidence that the block being rendered will behave because we trust that a released version of our framework was fully tested.

I see this time, and again. So many test cases out there are covering much of the scope that the framework itself should cover. Again I say, don't do their jobs!

## Are you mocking me???

Writing testable code on the front-end is something that had escaped our practice for quite some time. Back in the days of [jquery](https://jquery.com/) things were a mess. Everything was a plate of spaghetti stuffed into a `DOMReady` callback. Massively important business logic was burried deep inside some anonymous callback that was quite ~~difficult~~ impossible to isolate and test. I laugh when a client presents me with a legacy `jQuery` codebase and asks what the effort would be to retro-fit unit tests 😂.

Probably the most imporant part of isolating code down to a unit is the ability to ignore irrelevant code. Mocks are one of the means to do this. We aren't concerned with how an external block of code arrives at a particular output, we only want to be concerned with what **OUR** code does with it. So we tell our code, when run in the test environment, to ignore the calls to the actual dependency, and take our fake response instead.

This greatly simplifies what we have to do in the test, and decouples us from the external block and any of its quirks (and also **its** dependencies, and its **dependencies** dependencies, ya dig?). Mocking is sometimes a chore in/of itself, but its increasingly difficult in a UI-component setting. A component is meant to be rendered in a DOM with full fidelity and access to all the wonderful APIs it provides, `fetch` being one of the most common.

```svelte
<script>
  import { onMount } from "svelte";

  let data;

  onMount(() => {
    fetch("/api/data")
      .then((r) => r.json)
      .then((d) => {
        data = d;
      });
  });
</script>

{#if data}
  <Content {data} />
{:else}
  <Loading />
{/if}
```

Using `fetch` in a component is an insanely common pattern. But what happens when you do that? You not only introduce a dependency on something assocaited with the DOM/browser, but also something that depends on `HTTP`! `fetch` makes an `HTTP` call to some web resource. So now we have to mock the entire concept of an `HTTP` request and response. Thankfully this pattern is so common, that nearly every front-end test harness has some community-driven implementation of a `fetch` mock. But they are complex! Essentially they can grow to being a measurable percentage of the [expressjs](https://expressjs.com/) scope!

A better idea may be to isolate the usage of `fetch` (or other complex apis) outside of your component. Such that you can more intentionally mock the expected output without needing to do things like intercepting an outgoing `HTTP` call. This is a practice I am still learning. How to write code in a testable manner is something newer to our field, and requires some careful forethought. When you are surrounded by complex browser APIs and an insane dependency tree, this becomes harder to do.

Its been my experience that I spend way more time mocking, refactoring, mocking some more, than I do authoring the component and the test cases combined.
