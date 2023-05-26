<template>
  <div style="container-type: inline-size;">
    Nuxt module playground!
    <DropzoneFilelist
      id="file1"
      ref="dzf"
      use-formelement
      upload-url="https://httpbin.org/post"
      :initial-files="files"
      :has-click="true"
      :options="{ createImageThumbnails: true, paramName: 'files' }"
      :disabled="isDisabled"
      name-template="f-test[${id}][]"
    />

    <button @click="addFile">add file</button>
    <button @click="addImage">add image</button>
    <button @click="addBlank">add blank</button>
    <button @click="isDisabled = !isDisabled">switch disabled state</button>
  </div>
</template>

<script>
// required, won't work in the playground otherwise
import { defineComponent } from '#imports';


export default defineComponent({

  data() {
    return {
      isDisabled: false,

      files: [
        {
          name: "Filename_1.jpg",
          size: 880571.4592652392,
          imageUrl:
            "https://source.unsplash.com/200x200/?nature,water&0.3200066248430764",
        },
        {
          name: "Filename_2.jpg",
          size: 996965.2070423159,
          imageUrl:
            "https://source.unsplash.com/200x200/?nature,water&0.6889461421169023",
        },
        {
          name: "Filename_3.jpg",
          size: 996965.2070423159,
        },
      ],
    }
  },

  methods: {
    addFile() {
      const i = this.$refs.dzf.dropzone.files.length + 1;

      this.$refs.dzf.addFile(`Filename_${i}.abc`, 0);
    },
    addBlank() {
      this.$refs.dzf.addFile(undefined, 0);
    },

    addImage() {
      const imageUrl =
        "https://source.unsplash.com/200x200/?nature,water&%_RAND_%"
          .replace("%_RAND_%", Math.random().toString());

      const i = this.$refs.dzf.dropzone.files.length + 1;

      const mockFile = {
        name: `Filename_${i}.jpg`,
        size: Math.random() * 1000000,
      };

      this.$refs.dzf.addFile({ ...mockFile, imageUrl });
    }
  },

});
</script>

<style>
body {
  padding: 2em;

  font-family: -apple-system, BlinkMacSystemFont, open_sanslight,
    "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>