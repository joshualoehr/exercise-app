# starter-kit

This is a small JavaScript development environment starter kit created for my own personal use on my projects. It's intended to be as lightweight as possible, and tailored to my own personal preferences. This kit is also not geared towards production deployment, and should not be used for such.

Inspired by Cory House's PluralSight course, "Building a JavaScript Development Environment," but implemented with my own flavor.

## Why?

I'm tired of using `create-react-app` everytime I want to hack on a small project idea, and getting a bloated mess of boilerplate when, in reality, I probably only need half of what it provides. Plus, I wanted to actually understand what my starter kit was doing, instead of blindly relying on someone else's work. Mostly though, I did this to learn what exactly it takes to spin up a modern JavaScript project from the ground up.

## Overview

Here's a list of this starter-kit's components, and some reasoning for including them:

-   `.editorconfig` - A no-brainer. This keeps my code looking my code, which I like.
-   `npm` - I already know how to use it, it's ubiquitous, it gives me everything I need. Easy.
-   `browser-sync` - Allows accessing localhost from other devices on the same network. Useful for testing development work on my phone.
-   `npm scripts` - Very simple task automation, baked right into the package.json. I use this to automatically run `npm audit` after `npm install`, among other things.
-   `babel` - Transpiles ES6+ into browser compatible JavaScript. Typically quick to adopt experimental features, which makes it a good choice for this starter-kit.
-   `webpack` - Maybe not the most lightweight option, but I picked this because of its wide adoption and its comprehensive bundling features for more than just JavaScript (HTML, CSS, images, fonts, etc).
-   `webpack-dev-server` - Another reason I picked webpack was for the built-in development server with live reloading.
-   `eslint` - ESLint is the de facto standard for JavaScript linting these days, so this was another no-brainer. Here I'm just using the recommended React configs.
-   `prettier` - An opinionated autoformatter for JavaScript (and other) code. Can be combined with eslint.
-   `json-server`, `json-schema-faker` - A really cool and fast way to generate a mock API. When prototyping, I like to start with the UI as I formulate the shape of what I ultimately want my data to be returned as from the backend. With `json-schema-faker`, I can play with that data shape on the fly, AND easily get realistic-looking fake data on a whim. `json-server` makes it easy to serve that fake data to my prototype UI, AND allows me to interact with it like a REST API - with data persistence and all. Now that's pretty sweet.
-   `react` - My JavaScript framework of choice. Easily swapped out with anything else if I desire.

## Future Considerations

Some things I may consider adding in the future:

-   `localtunnel` - Allows localhost to be publicly accessible. Could be helpful for collaborating. (Alternative: `ngrok`)
-   `TypeScript` or `Elm` - I might consider trying out these other transpiled languages in the future.
