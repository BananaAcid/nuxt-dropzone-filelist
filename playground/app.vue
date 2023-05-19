<template>
  <div style="container-type: inline-size;">
    Nuxt module playground!
    <DropzoneFilelist
      ref="dzf"
      upload-url="https://httpbin.org/post"
      :initial-files="files"
      :has-click="true"
    />

    <button @click="addFile">add file</button>
  </div>
</template>

<script>
// required, won't work in the playground otherwise
import { defineComponent } from '#imports';



export default defineComponent({

  data() {
    return {
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
      ],
    }
  },

  methods: {
    addFile() {
      this.$refs.dzf.addFile('abc.def', 1);
    },
  },
});
</script>
