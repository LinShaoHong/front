<template>
  <div class="body">
    <div class="Hole" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Dashboard'
})
export default class extends Vue {
}
</script>
<style>
  .body {
    background: #f0f2f5;
    display: flex;
    height: 93vh;
    align-items: center;
    justify-content: center;
    filter: blur(3px);
  }

  .Hole, .Hole:before, .Hole:after {
    display: flex;
    border-radius: 50%;
    animation: anim 7s linear infinite;
  }

  @keyframes anim {
    0% {transform: rotate(0deg)}
    100% {transform: rotate(-360deg)}
  }

  .Hole{
    width: 50vh;
    height: 50vh;
    box-shadow: 1vh 0 3vh 2vh #f50,
    inset -2vh 0 3vh 4vh #f80,
    -1vh -1vh 35vh 0 #f60;
  }

  .Hole:before, .Hole:after {
    content: '';
    background: #fff;
    position: relative;
    top: 6vh;
  }

  .Hole:before {
    width: 3vmin;
    height: 3vmin;
    left: 40vmin;
    box-shadow: #f4eb42 0 0 2vh 2vh,
    #f4eb42 2vh 4vh 2vh 0.3vh;
  }
</style>
