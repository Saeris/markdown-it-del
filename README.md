# ➖ markdown-it-del [![Build Status][ci-badge]][ci] [![npm][npm-badge]][npm]

A [markdown-it][markdown-it] plugin which adds syntax support for the HTML `<del>` element in markdown.

## 📦 Installation

> [!Note]
>
> This library is distributed only as an ESM module.

```bash
npm install @saeris/markdown-it-del
```

or

```bash
yarn add @saeris/markdown-it-del
```

## 🔧 Usage

```ts
import md from "markdown-it";
import delPlugin from "@saeris/markdown-it-del";

md().use(delPlugin).render('--deleted--');

// => "<p><del>deleted</del></p>"
```

## 📣 Acknowledgements

This plugin is adapted from [markdown-it-ins][markdown-it-ins]

## 🥂 License

Released under the [MIT][license] © [Drake Costa][personal-website]

<!-- Definitions -->

[ci]: https://github.com/Saeris/remark-del/actions/workflows/ci.yml
[ci-badge]: https://github.com/Saeris/remark-del/actions/workflows/ci.yml/badge.svg
[npm]: https://www.npmjs.org/package/@saeris/remark-del
[npm-badge]: https://img.shields.io/npm/v/@saeris/remark-del.svg?style=flat
[markdown-it]: https://github.com/markdown-it/markdown-it
[markdown-it-ins]: https://github.com/markdown-it/markdown-it-ins
[license]: ./LICENSE.md
[personal-website]: https://saeris.gg
