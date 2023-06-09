# Dropzone Filelist

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module with opinionated settings to show a file list, directly based on [dropzone.js](https://www.dropzone.dev/), NOT based on any other dropzone plugin or module.

<img width="911" alt="image" src="https://github.com/BananaAcid/compile-superhero/assets/1894723/31e8000c-a2f1-4116-bc1f-2dca94a5bd6d" style="max-width: 80vw" />

- [Sandbox with dev and tests](https://codesandbox.io/p/sandbox/dropzone-tests-and-styles-r7rows)
- [Git repository](https://github.com/BananaAcid/nuxt-dropzone-filelist)

## Features

<!-- Highlight some of the features your module provide here -->
- no secondary vue dependencies
- opinionated to enable a specific style
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

    ```html
    <template>
      <DropzoneFilelist uploadUrl="/api/upload" />
    </template>
    ```

## Purpose

Adds and removes corresponding `input[type="hidden"]` elements on dropzone usage:
- this is the base idea of this module: use dropzone to upload files and provide a hidden input with the filename for a regular `<form>` element and default logic to handle (as well as to be used with oder form kits)
- also allow getting an array of uploaded files for standalone usage

Wrap around the real dropzone js lib without intermediate js libs:
- this module will only break, when something in dropzone is fundemantally changed
- or nuxt changes something about handling modules

My own styles included:
- I can push my own overall style
- extended with features I thought should be preconfigured / included

## Configuration

### Properties:

Note: When using as attributes, the properies will need to be kebab-case.

#### `id: String = null`
- used for the file[id][] file-input name, falls back to `options.paramName` -> element id -> random number
#### `nameTemplate: String = 'file[${id}][]'`
- template for name to use, supports: `${id}`, `${name}`, `${num}` (current file index, no logic)
- Note: no template-string content support
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
#### `clickFn: ( fileName: string, fileElement: HTMLDivElement, dropzone: Dropzone ):void => ...` 
- default: `console.log("clicked", fileName, { fileElement, dropzone })`
- handler on clicking on an item
#### `clickDurrationMs: Number = 1000`
- how long the click highlight should be shown, 0 will not show the click highlight and message
#### `initialFiles: Array = []`
- list of files to fill in on initialization
#### `filesIconColor: Object = ...` 
- default: `{ txt: "#E9EAEB", rtf: "#7C54AB", pdf: "#f40f02", doc: "#1B5EBE", docx: "#1B5EBE", xls: "#1d6f42", xlsx: "#1d6f42" }`
- file color map for file icon template
#### `fileIconTemplate: String | null = null`
- supply an alternative data string to use as file icon, placeholders: 🔆 = color, ❓ = font-family, 👑 = title
- be aware: it has to be a image url (base64 or passed through `encodeURIComponent()`), resulting in something for SVGs like: `"data:image/svg+xml,%3Csvg ..."`
#### `usePreviewIcon: Boolean = true`
- use to show file icon while loading preview or if preview is not available
#### `useFontAwesomeIcons: Boolean = false`
- uses the fontawesome 5 icons, fontawesome css needs to be available allready
#### `addFileInputs: Boolean = true`
- enable adding text input fields with filenames for each added file
#### `columnMode: String = 'container'`
- adds `.***-width` classes to adjust to available space, select the method to use:
  -  `'media'` == media-query, `'container'` == container-query, `'column'` / nothing == 1fr
#### `useFormelement: Boolean = false`
- usually uses a div as wrapper, this changes it to `<form>`
#### `disabled: Boolean = false`
- disables using of the element like a form element (also sets a real `disabled` property)
#### `options: Object = {}`
- any [native dropzone options](https://docs.dropzone.dev/configuration/basics/configuration-options)
- `uploadMultiple` has no effect

### Events:

#### `@init: (options: {dropzone: Dropzone, element: HTMLElement}): void`
- event handler that gt4s called after initialization

#### `@addedFile: (options: {file: DropzoneFile, dropzone: Dropzone, element: HTMLElement}): void`
- event handler that gets called when a file got added (as well as for `initialFiles`)
- use to add event handlers to slotted elements

#### `@removedFile: (options: { file: DropzoneFile, dropzone: Dropzone, element: HTMLElement}): void`
- event handler that gets called when a file got removed

### Methods: 

To use Methods, you need a [vue ref property](https://vuejs.org/guide/essentials/template-refs.html#accessing-the-refs) on the component, then access it as usual.


#### `.addFile()`

##### Params:
1. `nameOrFileObj: | string | { name: string; size?: number; imageUrl?: string }`
2. `size?: number`
3. `imageUrl?: string`
4. `color?: string | false`
5. `crossOrigin: "anonymous" | "use-credentials" | undefined = 'anonymous'`

##### Examples:
```html
<template>
  <DropzoneFilelist ref="dropzoneFilelist"  uploadUrl="/api/upload" />
</template>
```

Options API:
```html
<script>
export default defineComponent({
  mounted() {
    // just making calling addFile() shorter
    const dropzoneFilelist = this.$refs.dropzoneFilelist;
    
    // add image
    dropzoneFilelist.addFile('name.jpg', 123123/*bytes*/, '/assets/preview.jpg');
    // add non-image
    dropzoneFilelist.addFile('name.ext', 123123/*bytes*/, undefined, '#FF0000');
    // as object
    dropzoneFilelist.addFile({
      name: 'name.ext',
      size: 123123,
      color: '#ff0000',
      // imageUrl: '/assets/preview.jpg'
    });
  }
});
</script>
```

Composition API:
```html
<script setup>
import { ref, onMounted } from 'vue';

// declare a ref to hold the element reference
// the name must match template ref value
const dropzoneFilelist = ref(null);

onMounted(() => {
  // add image
  dropzoneFilelist.addFile('name.jpg', 123123/*bytes*/, '/assets/preview.jpg');
  // add non-image
  dropzoneFilelist.addFile('name.ext', 123123/*bytes*/, undefined, '#FF0000');
  // as object
  dropzoneFilelist.addFile({
    name: 'name.ext',
    size: 123123,
    color: '#ff0000',
    // imageUrl: '/assets/preview.jpg'
  });
});
</script>
```


### Slots

#### default
- use to add html to use as actions that will be visible on hover
- use event `@addedFile` to add click handlers

## Solutions & Examples

Tests are available [here in the ./pages/](https://codesandbox.io/p/sandbox/dropzone-tests-and-styles-r7rows?file=%2Fpages%2Fall.vue%3A1%2C1) *.vue files

- item click handler
  - to have a click action on a file item, add a handler with `:click-fn`
  - appearance can be changed by `:has-click`,`:click-text`,`:click-durration-ms`
- action buttons
  - use default slot for additional buttons/links
  - handler: use `@addedFile` to add click handler by finding it with `.querySelector()`
    ```html
    <template>
      <DropzoneFilelist upload-url="/api/upload" @addedFile="addedFile">
        <button data-action-open-external>open</button>
      </DropzoneFilelist>
    </template>

    <script>
      export default defineComponent({
        methods: {
          addedFile({file, dropzone, element}) {
            element
              .querySelector('[data-action-open-external]')
              .addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                // custom action
                alert(file.name);
              });
          },
        },
      });
    </script>
    ```
- loading initial files
  - `:initial-files` needs an array of: `{name, filesize , imgUrl?, color?}` (imgUrl or color, color for file icon)
- getting a count of added files
  - `this.$refs.dzf.dropzone.files.length`
- getting list of added files
  - `this.$refs.dzf.dropzone.files` => `File[]`
- item select toggle
  - use an item click handler
  - toggle a class on `element` to change the background color
  - use an array to add or remove the file names to keep track
- limit files 
  - use dropzone's options, namely `maxFiles:number`
    ```html 
    <DropzoneFilelist upload-url="/api/upload" :options="{maxFiles: 2}" />
    ```
- allow specific files only
  - use dropzone's options, namely `acceptedFiles:string`
    ```html
    <DropzoneFilelist upload-url="/api/upload" :options="{acceptedFiles: 'image/jpeg,image/png,application/pdf'}" />
    ```
- upload to nuxt /api
  - use [`npm/h3-formidable`](https://www.npmjs.com/package/h3-formidable) 
  - ... to let formidable save the file first, then copy it to where it should go (moving is usually a problem due to file permissions on temp files)
    ```js
    // ./server/api/upload.post.ts
    import fs from "node:fs/promises";
    import path from "node:path";

    import { readFiles } from "h3-formidable";

    export default defineEventHandler(async (event) => {

      // ... do some validation here: session / bearer-token / jwt / ...

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
  - Nuxt (h3) has native Session support: [useSession()](https://www.jsdocs.io/package/h3#useSession) (my [documentation and example](https://codesandbox.io/p/sandbox/h3-session-w93xr7?file=%2FREADME.md))
  - the server could also be a PHP/ASPx/... server (when using the dropzone component from this package without the nuxt module part)

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
