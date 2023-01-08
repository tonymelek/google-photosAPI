<template>
  <Loading :show-loading="showLoading" />
  <label for="baseUrl">Directory location</label>
  <input type="text" name="baseUrl" id="baseUrl" v-model="baseUrl">
  <label for="albumName">Album name</label>
  <input type="text" name="albumName" id="albumName" v-model="albumName">
  <button @click="uploader">Uploader</button>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Photo</th>
        <th scope="col">File Name</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(photo, index) in photos" :key="photo.fileName">
        <th scope="row">{{ index+ 1}}</th>
        <td><img :src="`http://localhost:5000/file/${photo}?baseUrl=${baseUrl}`" height="200"></td>
        <td>{{ photo }}</td>
        <td><input type="text" v-model="details[index].desc"></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import axios from 'axios';
import Loading from './Loading.vue';

export default {
  name: "home",
  data: () => ({
    path: "",
    baseUrl: "",
    photos: [],
    details: [],
    albumName: "",
    showLoading: false
  }),
  methods: {
    printDetails() {
      console.log(this.details);
    },
    async uploader() {
      this.showLoading = true;
      await axios({
        method: "post",
        url: `http://localhost:5000/upload?baseUrl=${this.baseUrl}&albumName=${this.albumName}`,
        data: this.details
      });
      this.showLoading = false;
    }
  },
  watch: {
    baseUrl: {
      async handler(newUrl) {
        if (newUrl !== "") {
          const { data } = await axios.get(`http://localhost:5000/photos?baseUrl=${newUrl}`);
          this.photos = data;
          this.details = data.map(fileName => ({ fileName, desc: "" }));
        }
      },
      immediate: true
    }
  },
  async mounted() {
  },
  components: { Loading }
}
</script>
<style scoped>

</style>