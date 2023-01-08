# Isomorphic HTMLParser

[![CodeQL](https://github.com/KiraLT/isomorphic-htmlparser/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/KiraLT/isomorphic-htmlparser/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/KiraLT/isomorphic-htmlparser/branch/main/graph/badge.svg?token=E599EPAOPM)](https://codecov.io/gh/KiraLT/isomorphic-htmlparser)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

HTML parser that works both in JavaScript and NodeJS with TypeScript support.

Missing something? Create [feature request](https://github.com/KiraLT/isomorphic-htmlparser/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=)!

Read [Documentation 📘](https://kiralt.github.io/isomorphic-htmlparser/)

Check [Demo 🎁](https://kiralt.github.io/isomorphic-htmlparser/demo/)

## Installation

[![npm version](https://badge.fury.io/js/isomorphic-htmlparser.svg)](https://www.npmjs.com/package/isomorphic-htmlparser)
[![npm](https://img.shields.io/npm/dt/isomorphic-htmlparser)](https://www.npmjs.com/package/isomorphic-htmlparser)

### Install with NPM/yarn:

```bash
# NPM
npm install isomorphic-htmlparser
# Yarn
yarn add isomorphic-htmlparser
```

Import what you need:

```typescript
import { parseHTML } from 'isomorphic-htmlparser'

const text = parseHTML(html).find('.my-class > a.title')
console.log(text)
```

> Always import only what is necessary to take full advantage of [tree shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking).

## Load directly in the browser

### Include UMD bundle

Include script from CDN and use `isomorphicHtmlparser` global variable:

```html
<script src="https://unpkg.com/isomorphic-htmlparser"></script>
<script>
  const text = isomorphicHtmlparser
    .parseHTML(html)
    .find('.my-class > a.title')
  console.log(text)
</script>
```

