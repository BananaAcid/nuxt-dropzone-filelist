<template>
  <div>
    Nuxt module playground!
    <DropzoneFilelist
      upload-url="https://httpbin.org/post"
      :inital-files="getFiles()"
      :has-click="true"
    />
  </div>
</template>

<script>
export default defineComponent({
  methods: {
    getFiles: () => [
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
  },
});
</script>
