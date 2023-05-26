<!--
@author Nabil Redmann <repo@bananaacid.de>
@license ISC

@repository https://codesandbox.io/p/sandbox/dropzone-tests-and-styles-r7rows

@version 1.0.0
-->

<template lang="pug">
//- note to convert pug to html: https://html-to-pug.com/

component.filelist-content(
  :is="useFormelement ? 'form' : 'div'"
  ref="dropzone" 
  :id="id ?? ''"
  :style="'--click-content-inital:\"' + clickText + '\";--img-max-size-inital:'+imgMaxSize" 
  :class="(hasClick ? 'hasClick' : '') + ' ' + (columnMode ? columnMode +'-width' : '') "
  )
  .dz-message {{uploadText}}

  //- in VUE/Nuxt, do not use template-Tag -- it will get removed from DOM on page switch
  .template(ref="template")
    //- .filelist-file.msg-onclick will show a message, meant for copying the path or alike on item-click
    .filelist-file
    
      .actions-nav
        slot
        //-
          i.action-open-ext.fas.fa-external-link-square-alt(data-action-open-external)
        span(data-action-remove)
          span(onClick="event.stopPropagation()") ×
          div(data-dz-remove) {{removeText}}
          
      img(data-dz-thumbnail)
      
      div
        header(data-dz-name) Filename.ext
        span
          | Size: 
          em(data-dz-size) 0.0 MB
        //- span
          | Uploaded: 
          em(data-modified) ***
          
      .dz-progress
        span.dz-upload(data-dz-uploadprogress)
      .dz-success-mark
        
        i.fas.fa-check(v-if="useFontAwesomeIcons")
        span(v-if="!useFontAwesomeIcons") ✓
        //- span ✔
      .dz-error-mark
        i.fas.fa-times(v-if="useFontAwesomeIcons")
        span(v-if="!useFontAwesomeIcons") ❌
        //- span ✘
      .dz-error-message
        strong(data-dz-errormessage) Example - Server responded with 0 code.

</template>

<script lang="ts">
// @ts-ignore because it works
import { defineComponent } from '#imports';

//import { PropType, defineComponent } from 'nuxt/dist/app/compat/capi';
//import { defineComponent, PropType } from 'vue';
//import { defineComponent } from 'vue';
import { PropType } from 'vue';


import Dropzone from "dropzone";
import type { DropzoneFile } from "dropzone";

export default defineComponent({
  props: {
    id: {
      type: String,
      default: null,
      description: "used for the file[id][] file-input name, falls back to `options.paramName` -> element id -> random number",
    },
    nameTemplate: {
      type: String,
      default: 'file[${id}][]',
      description: "template for name to use, supports template-string content",
    },
    uploadUrl: {
      type: String,
      required: true,
      description: "upload target url to post the files to",
    },
    uploadText: {
      type: String,
      default: "Drag files here or click to upload",
      description: "upload area text",
    },
    removeText: {
      type: String,
      default: "remove?",
      description: "string to use on the remove file item button",
    },
    imgMaxSize: {
      type: String,
      default: "2.5em",
      description: "cube side size for the image preview and file icon",
    },
    hasClick: {
      type: Boolean,
      default: false,
      description:
        "false will not show the click highlight and message, but still trigger the click-handler",
    },
    clickText: {
      type: String,
      default: "Clicked!",
      description: "text on the click highlight",
    },
    clickFn: {
      type: Function,
      default: (
        fileName: string,
        fileElement: HTMLDivElement,
        dropzone: Dropzone
      ) => console.log("clicked", fileName, { fileElement, dropzone }),
      description: "handler on clicking on an item",
    },
    clickDurrationMs: {
      type: Number,
      default: 1000,
      description:
        "how long the click highlight should be shown, 0 will not show the click highlight and message",
    },
    initialFiles: {
      type: Array,
      default: [] as PropType<
        {
          filename: string;
          size?: number;
          imageUrl?: string;
          color?: string; // with or without hash, both is fine
        }[]
      >,
      description: "list of files to fill in on initialization",
    },
    filesIconColor: {
      type: Object,
      default: () => ({
        txt: "#E9EAEB",
        rtf: "#7C54AB",
        pdf: "#f40f02",
        doc: "#1B5EBE",
        docx: "#1B5EBE",
        xls: "#1d6f42",
        xlsx: "#1d6f42",
      }),
      description: "file color map for file icon template",
    },
    fileIconTemplate: {
      type: String,
      default: null,
      description:
        "supply an alternative data string to use as file icon, placeholders: 🔆 = color, ❓ = font-family, 👑 = title",
    },
    usePreviewIcon: {
      type: Boolean,
      default: true,
      description: "use to show file icon while loading preview or if preview is not available",
    },
    useFontAwesomeIcons: {
      type: Boolean,
      default: false,
      description:
        "uses the fontawesome 5 icons, fontawesome css needs to be available allready",
    },
    addFileInputs: {
      type: Boolean,
      default: true,
      description:
        "enable adding text input fields with filenames for each added file",
    },
    columnMode: {
      type: String,
      default: "container",
      description:
        "adds .***-width, 'media' == media-query, 'container' == container-query, 'column' or nothing == 1fr",
    },
    useFormelement: {
      type: Boolean,
      default: false,
      description: "usually uses a div as wrapper, this changes it to `<form>`",
    },

    disabled: {
      type: Boolean,
      default: false,
      description: "disables using of the element like a form element (also sets a real `disabled` property)",
    },

    options: {
      type: Object,
      default: () => ({}),
      description: "any native dropzone option",
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init: (options: { dropzone: Dropzone; element: HTMLElement }) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addedFile: (options: { file: DropzoneFile; dropzone: Dropzone; element: HTMLElement; }) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removedFile: (options: { file: DropzoneFile, dropzone: Dropzone, element: HTMLElement }) => true,
  },

  data() {
    return {
      dropzone: null as unknown as Dropzone,
    };
  },

  watch: {
    disabled(newVal: boolean /*, oldVal: boolean*/) {
      const el = this.$refs.dropzone as HTMLElement;
      if (newVal) {
        el.setAttribute('disabled', '');
        el.querySelectorAll('input').forEach(item => item.setAttribute('disabled', ''));
      }
      else {
        el.removeAttribute('disabled');
        el.querySelectorAll('input').forEach(item => item.removeAttribute('disabled'));
      }
    },
  },

  async mounted() {
    const vm = this;
    const dzElement = this.$refs.dropzone as HTMLElement;

    const ptElement = (this.$refs.template as HTMLTemplateElement).cloneNode(
      true
    ) as HTMLTemplateElement;
    (this.$refs.template as HTMLTemplateElement).remove();

    // Options: https://github.com/dropzone/dropzone/blob/main/src/options.js
    const self = new Dropzone(dzElement, {
      url: this.uploadUrl,
      ...(this.options || {}),
      previewTemplate: ptElement!.innerHTML,
    });

    vm.dropzone = self;

    // used for the file[id][] file-input name
    const id =
      vm.options.paramName ||
      vm.id ||
      self.element.id ||
      //self.element.className?.replaceAll(' ', '.') ||
      Math.floor(Math.random() * 10000);

    // only these will be used for thumbnails
    const typesImage = {
      bmp: "image/bmp",
      gif: "image/gif",
      jpe: "image/jpeg",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      svg: "image/svg+xml",
      svgz: "image/svg+xml",
      tif: "image/tiff",
      tiff: "image/tiff",
      heif: "image/heif",
      heic: "image/heic",
      webp: "image/webp",
    };

    // why here? to have any addition of files in `init()` to trigger `addedfile`
    self.on("addedfile", function (file) {
      //console.log("F", file.name || "??", file, "-----");

      const fname = file?.name?.trim() || '';
      if (!fname) return;

      const ext = fname.split(".").pop() || "";
      // mock files have no type, nor do image mock files
      const type = file.type || (typesImage as any)[ext] || "";

      if (vm.usePreviewIcon || !type.match(/image.*/)) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const manualColor = !(file as any)["color"]
          ? false
          : (() => {
            const c = (file as any)["color"];
            delete (file as any)["color"];
              return c;
            })();
        const ff =
          "-apple-system, BlinkMacSystemFont, open_sanslight, Helvetica, Arial, sans-serif";

        // file icon, ref: https://jsfiddle.net/BananaAcid/wL04zerk/
        const url = (
          vm.fileIconTemplate ||
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 116 128' style='--color:%23🔆;'%3E%3Cg transform='translate(-271 -88)'%3E%3Cpath d='M7,0H63.631c1.666,0-2.117,23.8,4.858,30.709C75.631,37.644,97,31.937,97,34.137V121a7,7,0,0,1-7,7H7a7,7,0,0,1-7-7V7A7,7,0,0,1,7,0Z' transform='translate(290 88)' fill='%23e2e5e7'%3E%3C/path%3E%3Cpath d='M0,0,33,33.134V56L0,27.426Z' transform='translate(354 88)' fill='%23cad1d8'%3E%3C/path%3E%3Cpath d='M62.1,0c5.647.793,35.01,29.741,34.694,34.7.254,3.042-20-1.078-25.071,0C61.5,34.737,62.1,30.05,62.1,26.184Z' transform='translate(290 88)' fill='%23b0b7bd'%3E%3C/path%3E%3C/g%3E%3Cg transform='translate(-271 -88)'%3E%3Cpath d='M4,0H93a4,4,0,0,1,4,4V44a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z' transform='translate(274 151)' fill='%23cad1d8'%3E%3C/path%3E%3Crect width='97' height='48' rx='4' transform='translate(271 148)' style='fill: var(--color)'%3E%3C/rect%3E%3Ctext class='text' transform='translate(319 172)' fill='%23fff' font-size='27' font-family='❓' font-weight='700' text-anchor='middle' alignment-baseline='central' style='text-transform: uppercase; pointer-events: none;'%3E👑%3C/text%3E%3C/g%3E%3C/svg%3E"
        )
          .replace(/🔆/, manualColor || vm.filesIconColor[ext] || randomColor) // color
          .replace(/❓/, ff) // font-family
          .replace(/👑/, ext); // title

        self.emit("thumbnail", file, url);
      }

      /*
      // attach event to sub element of item
      file
        .previewElement!.querySelector("[data-action-open-external]")
        ?.addEventListener("click", (ev:Event) => {
          ev.preventDefault();
          ev.stopPropagation();

          // custom action
          alert(file.name);
        });
      */
      vm.$emit("addedFile", {
        file,
        dropzone: self,
        element: file.previewElement,
      });
    });

    // append input fields to the container
    self.on("addedfile", ({ name }) => {
      if (!this.addFileInputs) return;
      const el = document.createElement("input");
      el.type = "hidden";
      el.classList.add("file");
      el.name = eval('`' + this.nameTemplate + '`') || `file[${id}][]`;
      el.value = name;
      self.element.append(el);
    });
    self.on("removedfile", ({ name }) => {
      self.element
        .querySelectorAll(`.file[value="${name}"]`)
        .forEach((el) => el.remove());
    });

    // on click on element
    self.element.addEventListener("click", (ev) => {
      const el = ev.target as HTMLElement;
      const fileElement = el.closest(
        ".filelist-file:not(.dz-error)"
      ) as HTMLElement;

      if (this.clickFn && fileElement) {
        const fileName =
          fileElement?.querySelector("[data-dz-name]")?.innerHTML || "";

        this.clickFn.apply(fileElement, [fileName, fileElement, self]);

        if (this.hasClick && this.clickDurrationMs) {
          fileElement?.classList.add("msg-onclick");
          setTimeout(
            () => fileElement.classList.remove("msg-onclick"),
            this.clickDurrationMs
          );
        }
      }
    });

    if (vm.initialFiles && vm.initialFiles instanceof Array) {
      vm.initialFiles.forEach((el: any) => this.addFile(el));
    }

    vm.$emit("init", { dropzone: self, element: self.element });

    self.on("removedfile", (file: Dropzone.DropzoneFile) =>
      vm.$emit("removedFile", { dropzone: self, file, element: self.element })
    );

  },

  methods: {
    addFile(
      nameOrFileObj:
        | string
        | { name: string; size?: number; imageUrl?: string },
      size?: number,
      imageUrl?: string,
      color?: string | false,
      crossOrigin: "anonymous" | "use-credentials" | undefined = 'anonymous'
    ): void {
      let filename: string;
      if (nameOrFileObj instanceof Object) {
        filename = nameOrFileObj.name;
        size = nameOrFileObj.size;
        imageUrl = nameOrFileObj.imageUrl;
        color = (nameOrFileObj as any)["color"]; // cheating: special option that needs to be removed by next function
      } else {
        filename = nameOrFileObj;
      }

      const mockFile: Dropzone.DropzoneMockFile = {
        name: filename,
        size: size || 0,
        status: "success",
        ...(color ? { color: color.replace("#", "") } : {}),
      };

      // File.dataURL
      if (this.options.createImageThumbnails && imageUrl) {
        // add to visible items
        this.dropzone.displayExistingFile(
          mockFile,
          /*imageUrl*/ imageUrl.trim(),
          /*callback*/ undefined,
          /*crossOrigin*/ crossOrigin,
          /*resizeThumbnail*/ true
        );
      } else {
        // add to visible items
        // ref: https://github.com/dropzone/dropzone/blob/main/src/dropzone.js#L956:L957
        this.dropzone.emit("addedfile", mockFile);
        this.dropzone.emit("complete", mockFile);
      }

      // add to dropzones file list
      this.dropzone.files.push(mockFile as DropzoneFile);
    },
  },
});
</script>

<style scoped lang="less">
// Note: to convert the less to css: https://jsonformatter.org/less-to-css

// dependency
//@import url("https://use.fontawesome.com/releases/v5.15.4/css/all.css");

// background style
section {
  .filelist-content {
  }
}

// container style
.filelist-content {
  .template {
    display: none;
  }

  display: grid;
  gap: 0em;
  grid-template-columns: repeat(1, 1fr);

  position: relative;
  padding: 0em;

  box-sizing: border-box;

  &.column-width {
    // grid-template-columns: repeat(1, 1fr);
  }

  &.media-width {
    @media (min-width: 2700px) {
      grid-template-columns: repeat(8, 1fr);
    }
    @media (max-width: 2400px) {
      grid-template-columns: repeat(7, 1fr);
    }
    @media (max-width: 2100px) {
      grid-template-columns: repeat(6, 1fr);
    }
    @media (max-width: 1800px) {
      grid-template-columns: repeat(5, 1fr);
    }
    @media (max-width: 1500px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}

// no support of LESS for @container
//&:not(.media-width) {
@container (min-width: 2700px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(8, 1fr);
  }
}
@container (max-width: 2400px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(7, 1fr);
  }
}
@container (max-width: 2100px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(6, 1fr);
  }
}
@container (max-width: 1800px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(5, 1fr);
  }
}
@container (max-width: 1500px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(4, 1fr);
  }
}
@container (max-width: 1200px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(3, 1fr);
  }
}
@container (max-width: 900px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(2, 1fr);
  }
}
@container (max-width: 600px) {
  .filelist-content.container-width {
    grid-template-columns: repeat(1, 1fr);
  }
}

.overlay() {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: grid;
  justify-content: center;
  align-content: center;

  padding: 0 1em;
  box-sizing: border-box;

  color: white;
  background: var(--overlay-color);
}

.filelist-content {
  // accessable for dragover as well
  --overlay-color: rgb(35 49 193 / 80%);

  &.hasClick {
    //--click-content: var(--click-content-inital, "Text");

    .filelist-file.msg-onclick::after {
      .overlay();

      content: var(--click-content-inital, "Clicked!");
    }
  }

  &[disabled] {
    filter: grayscale(1);
    opacity: .7;
    pointer-events: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
// list style
.filelist-content .filelist-file {
  --img-max-size: var(--img-max-size-inital, 2.5em);

  position: relative;
  display: inline-grid;
  padding: 1em 1em 1em 1em;
  border-radius: 0.2em;

  grid-template-columns: var(--img-max-size) 1fr;
  align-items: center;
  gap: 2em;

  transition: all 0.2s;
  cursor: pointer;

  overflow: hidden;

  &:hover {
    //box-shadow: 0 0 10px 1px #0004;
    //background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
  }

  &::after {
    transition: all 0.3;
  }

  img {
    justify-self: center;

    max-width: 100%;
    max-height: var(--img-max-size);
    // for not square elements and non-pixel imgs (svg, ...)
    // and prevent jump on loading
    width: var(--img-max-size);
    height: var(--img-max-size);
    object-fit: contain;
    object-position: center;

    border-radius: 0.2em;
    // filter instead of box-shadow: support transparent icons/svgs
    //filter: drop-shadow(0 0 0.1em rgba(0, 0, 0, 0.25));

    // extra border of text color, not border to not occupy space
    //box-shadow: 0 0 0 2px white;
  }

  > div:has(> header) {
    overflow: hidden;
  }

  div span,
  div header {
    display: block;
  }

  div header {
    margin-bottom: 0.25em;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  div span {
    font-size: small;
  }

  .actions-nav {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1em;

    opacity: 0;

    transition: opacity 0.2s;

    z-index: 1; // above
  }
  &:hover .actions-nav {
    opacity: 1;
  }
  .actions-nav > * {
    opacity: 0.5;
    font-size: 1em;
  }
  .actions-nav > *:hover {
    opacity: 1;
  }

  .actions-nav [data-action-remove] > span {
    font-size: 2em;
    font-weight: 300;
    line-height: 1;
    margin-top: -0.16em;
  }
}

// common dz elements
.filelist-content {
  &.dz-drag-hover {
    box-shadow: inset 0 0 3px 1px var(--overlay-color);
    border-radius: 0.2em;
  }

  .dz-message {
    opacity: 0.5;
    grid-column: 1 / -1;

    padding: 2em 0;

    text-align: center;
    cursor: pointer;
  }

  [data-action-remove] {
    z-index: 1;
    display: flex;
    flex-direction: row-reverse;

    [data-dz-remove] {
      //display: none;
      max-height: 0;
      opacity: 0;
      max-width: 0;
      overflow: hidden;
      transition: max-width 0.3s 0.5s, opacity 0.3s 0.5s, padding 0s 0.5s,
        max-height 0s 0.5s;
      padding: 0;

      position: absolute;
      right: 1.5em;
      top: 0.4em;

      line-height: 1;
      font-size: 0.75em;
      background: red;
      border-radius: 0.2em;

      color: white;

      &:hover {
        background: darkred;
      }
    }

    &:hover {
      [data-dz-remove] {
        padding: 0.25em 0.5em;

        //display: block;
        max-height: 2em;
        opacity: 1;
        max-width: 100px;
      }
    }
  }
  .filelist-file.dz-error [data-action-remove] span {
    color: red;
  }
}

// common dz notifications
.filelist-content .filelist-file {
  .dz-progress,
  .dz-success-mark,
  .dz-error-mark,
  .dz-error-message {
    opacity: 0;

    position: absolute;
    margin-bottom: 1em;

    transition: opacity 0.3s;
    pointer-events: none;
  }

  .dz-progress {
    left: 1em;
    bottom: -0.5em;
    background: aliceblue;

    width: calc(100% - 2em);
    height: 0.2em;
    border-radius: 0.2em;

    .dz-upload {
      width: 0%;
      height: 100%;
      border-radius: 0.2em;
      background: dodgerblue;
    }
  }

  &.dz-processing {
    .dz-progress {
      opacity: 1;
    }
  }
  &.dz-complete {
    .dz-progress {
      opacity: 0;
    }
  }

  .dz-success-mark,
  .dz-error-mark,
  .dz-error-message {
    .overlay();

    // dz unicode
    > span {
      font-size: 2em;
    }
    // in case of font awesome
    > i {
      font-size: 1.5em;
    }
  }
  &.dz-success {
    .dz-success-mark {
      //opacity: 1;
      animation: fade-in-out 3s forwards;
      color: lightgreen;
    }
  }
  &.dz-error {
    .dz-error-mark {
      //opacity: 1;
      animation: fade-in-out 3s forwards;
      color: coral;
    }
  }
  &.dz-error {
    .dz-error-message {
      opacity: 1;
      transition: opacity 0.3s 2.5s;
      color: coral;
      background: rgba(0 0 0 / 80%);
    }
  }

  @keyframes fade-in-out {
    0% {
      opacity: 0;
    }

    20% {
      opacity: 1;
    }

    80% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
}
</style>
