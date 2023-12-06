export default {
  data() {
    return {
      imageError: false,
      imageLoaded: false
    }
  },
  methods: {
    onImageError(e) {
      this.imageError = true;
      this.imageLoaded = false;
    },
    onImageLoaded() {
      this.imageError = false;
      this.imageLoaded = true;
    }
  }
}