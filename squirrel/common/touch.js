export default {
  data() {
    return {
      startX: 0,
      touchToLeft: false,
      touchToRight: false
    }
  },
  methods: {
    touchStart: function (e) {
      if (e.touches.length == 1) {
        this.startX = e.touches[0].clientX;
      }
    },
    touchEnd: function (e) {
      if (e.changedTouches.length == 1) {
        var endX = e.changedTouches[0].clientX;
        let diff = endX - this.startX;
        if (Math.abs(diff) > 20) {
          if (diff > 0) {
            this.swipToRight();
          } else {
            this.swipToLeft();
          }
        }
      }
    }
  }
}