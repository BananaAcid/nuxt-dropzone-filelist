# Dropzone Filelist

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module with opiniated settings to show a file list, directly based on dropzone.js (NOT based on any other plugin or module).

<img width="911" alt="image" src="https://github.com/BananaAcid/compile-superhero/assets/1894723/31e8000c-a2f1-4116-bc1f-2dca94a5bd6d" style="max-width: 80vw" />

- [Release Notes](/CHANGELOG.md)
- [Dev and tests](https://codesandbox.io/p/sandbox/dropzone-tests-and-styles-r7rows)

<!--
- [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-dropzone-filelist?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- no secondary dependencies
- opiniated to enable a specific style
- inbuild file icon
- places text input fields for filenames, while uploads files directly to custom url
- filling files on load

## Quick Setup

1. Add `nuxt-dropzone-filelist` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-dropzone-filelist

# Using yarn
yarn add --dev nuxt-dropzone-filelist

# Using npm
npm install --save-dev nuxt-dropzone-filelist
```

2. Add `nuxt-dropzone-filelist` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-dropzone-filelist'
  ]
})
```

3. Use it

```js
<template>
  <DropzoneFilelist />
</template>
```

### Properties:

#### `id: String`
- used for the file[id][] file-input name
#### `uploadUrl: String`
- upload target url to post the files to
#### `uploadText: String`
- upload area text
#### `removeText: String`
- string to use on the remove file item button
#### `imgMaxSize: String`
- cube side size for the image preview and file icon
#### `hasClick: Boolean`
- false will not show the click highlight and message, but still trigger the click-handler
#### `clickText: String`
- text on the click highlight
#### `clickFn: Function`
- handler on clicking on an item
#### `clickDurrationMs: Number`
- how long the click highlight should be shown, 0 will not show the click highlight and message
#### `initialFiles: Array`
- list of files to fill in on initialization
#### `filesIconColor: Object`
- file color map for file icon template
#### `fileIconTemplate: String | null`
- supply an alternative data string to use as file icon, placeholders: 🔆 = color, ❓ = font-family, 👑 = title
#### `useFontAwesomeIcons: Boolean`
- uses the fontawesome 5 icons, fontawesome css needs to be available allready
#### `addFileInputs: Boolean`
- enable adding text input fields with filenames for each added file
#### `columnMode: String`
- adds .***-width, 'media' == media-query, 'container' == container-query, 'column' or nothing == 1fr
#### `options: Object`
- any native dropzone option


### Methods: 

To use Methods, you need a ref on the component, then accessing it as usual.


`.addFile()`
```js
// add image
this.$refs.dropzoneFilelist.addFile('name.jpg', 123123/*bytes*/, '/assets/preview.jpg');
// add non-image
this.$refs.dropzoneFilelist.addFile('name.ext', 123123/*bytes*/, undefined, '#FF0000');
// as object
this.$refs.dropzoneFilelist.addFile({
  name: 'name.ext',
  size: 123123,
  color: '#ff0000',
  // imageUrl: '/assets/preview.jpg'
});
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-dropzone-filelist/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-dropzone-filelist

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-dropzone-filelist.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-dropzone-filelist

[license-src]: https://img.shields.io/npm/l/nuxt-dropzone-filelist.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-dropzone-filelist

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
