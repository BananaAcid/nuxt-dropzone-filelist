import { defineNuxtModule, createResolver, addComponent } from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "dropzone-filelist",
    configKey: "DropzoneFilelist",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(/*options, nuxt*/) {
    const resolver = createResolver(import.meta.url);

    addComponent({
      name: "DropzoneFilelist", // name of the component to be used in vue templates
      filePath: resolver.resolve("runtime/components/dropzone-filelist.vue"),
    });

    // nuxt.options.css.push(resolve('./runtime/style.css'))
  },
});
