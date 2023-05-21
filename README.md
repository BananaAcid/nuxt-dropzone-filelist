# Dropzone Filelist

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module with opiniated settings to show a file list, directly based on dropzone.js (NOT based on any other plugin or module).

<img width="911" alt="image" src="https://github.com/BananaAcid/compile-superhero/assets/1894723/31e8000c-a2f1-4116-bc1f-2dca94a5bd6d" style="max-width: 80vw" />

- [Sandbox with dev and tests](https://codesandbox.io/p/sandbox/dropzone-tests-and-styles-r7rows)
- [Git repository](https://github.com/BananaAcid/nuxt-dropzone-filelist)

<!--
- [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-dropzone-filelist?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- no secondary vue dependencies
- opiniated to enable a specific style
- inbuild file icon
- places text input fields for filenames, while uploads files directly to custom url
- filling files on load
- even files added by code, have an input
- it is always relyably multifile internally, dropzone options can limit the file amount

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

#### `id: String = null`
- used for the file[id][] file-input name, falls back to `options.paramName` -> element id -> random number
#### `uploadUrl: String`  *(required)*
- upload target url to post the files to
#### `uploadText: String = 'Drag files here or click to upload'`
- upload area text
#### `removeText: String = 'remove?'`
- string to use on the remove file item button
#### `imgMaxSize: String = '2.5em'`
- cube side size for the image preview and file icon
#### `hasClick: Boolean = false`
- false will not show the click highlight and message, but still trigger the click-handler
#### `clickText: String = 'Clicked!'`
- text on the click highlight
#### `clickFn: Function` *= (console log debug)*
- handler on clicking on an item
#### `clickDurrationMs: Number = 1000`
- how long the click highlight should be shown, 0 will not show the click highlight and message
#### `initialFiles: Array = []`
- list of files to fill in on initialization
#### `filesIconColor: Object = ...` 
- default: `{ txt: "#E9EAEB", rtf: "#7C54AB", pdf: "#f40f02", doc: "#1B5EBE", docx: "#1B5EBE", xls: "#1d6f42", xlsx: "#1d6f42", }`
- file color map for file icon template
#### `fileIconTemplate: String | null = null`
- supply an alternative data string to use as file icon, placeholders: 🔆 = color, ❓ = font-family, 👑 = title
#### `usePreviewIcon: Boolean = true`
- use to show file icon while loading preview or if preview is not available
#### `useFontAwesomeIcons: Boolean = false`
- uses the fontawesome 5 icons, fontawesome css needs to be available allready
#### `addFileInputs: Boolean = true`
- enable adding text input fields with filenames for each added file
#### `columnMode: String = 'container'`
- adds .***-width, 'media' == media-query, 'container' == container-query, 'column' or nothing == 1fr
#### `options: Object = {}`
- any [native dropzone options](https://docs.dropzone.dev/configuration/basics/configuration-options)
- `uploadMultiple` has no effect


### Methods: 

To use Methods, you need a ref on the component, then accessing it as usual.


#### `.addFile()`
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

## Solutions // --- Section is WiP ! ---

Tests are available [here in the ./pages/](https://codesandbox.io/p/sandbox/dropzone-tests-and-styles-r7rows?file=%2Fpages%2Fall.vue%3A1%2C1) *.vue files

- item click handler
  - click action -> `:click-fn`
  - styling -> `:has-click`,`:click-text`,`:click-durration-ms`
- action buttons
  - primary slot for additional icons
  - handler: use `@addedFile` to add click handler by finding it with querySelector
- loading initial files
  - `:initial-files` with array of: name,filesize,imgUrl/fileicon-color
- getting list of added files
  - `this.$refs.dzf.dropzone.files` -> `File[]`
- item select toggle
  - item click handler, toggle class on element
- server side upload
  - use [`npm/h3-formidable`](https://www.npmjs.com/package/h3-formidable)
    ```js
    // ./server/api/upload.post.ts
    import fs from "node:fs/promises";
    import path from "node:path";

    import { readFiles } from "h3-formidable";

    export default defineEventHandler(async (event) => {

      // ... do some validation here: session / bearer-token / jwt

      const { fields, files } = await readFiles(event, {
        includeFields: true,
        maxFileSize: 20 * 1024 * 1024,
        filter: () => true,
        // filter: ({ name, originalFilename, mimetype }) => mimetype && mimetype.includes("image"),

        // uploadDir: './upload', // direct uploading
        // keepExtensions: true,

        // other formidable options here
        // https://github.com/node-formidable/formidable#options
      });


      // if not `uploadDir` ... we move the file:
      let f: any = files.file[0];

      const targetPath = path.join(
        await fs.realpath("./upload"),
        f.originalFilename
      );

      await fs.copyFile(f.filepath, targetPath);
      await fs.unlink(f.filepath);

      // if a string is returned, it will be shown as error by DropZone
      return "";
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

- [Release Notes](https://github.com/BananaAcid/nuxt-dropzone-filelist/blob/main/CHANGELOG.md)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-dropzone-filelist/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-dropzone-filelist

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-dropzone-filelist.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-dropzone-filelist

[license-src]: https://img.shields.io/npm/l/nuxt-dropzone-filelist.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-dropzone-filelist

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
