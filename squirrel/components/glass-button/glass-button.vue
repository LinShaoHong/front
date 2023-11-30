<template>
  <view>
    <button hover-class="ani_scale" class="bt" :style="style">{{ text }}</button>
  </view>
</template>

<script>
export default {
  name: "glass-button",
  props: {
    text: { default: '', type: String },
    radius: { default: '10px', type: String },
    width: { default: '10rem', type: String },
    height: { default: '2rem', type: String },
    fontSize: { default: '18px', type: String },
    fontWeight: { default: '600', type: String }
  },
  computed: {
    style() {
      return {
        "width": this.width,
        "height": this.height,
        "font-size": this.fontSize,
        "font-weight": this.fontWeight,
        "border-radius": this.radius
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bt {
  background-color: #F38A1E;
  border: 0;
  color: #fff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
}

.bt:before {
  background-color: initial;
  background-image: linear-gradient(#fff 0, #ffffff00 100%);
  border-radius: 10px;
  content: "";
  height: 50%;
  left: 4%;
  opacity: .5;
  position: absolute;
  top: 0;
  transition: all .3s;
  width: 92%;
}

@media (min-width: 768px) {
  .bt {
    padding: 16px 16px;
  }
}

.ani_scale {
  transform: scale(1.1);
}
</style>