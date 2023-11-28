<template>
    <view class="lds-ripple">
        <view />
        <view />
    </view>
</template>

<script lang="ts">
export default {
  name:'loading'
}
</script>

<style lang="scss" scoped>
.lds-ripple {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    margin-top: 1rem;
}

.lds-ripple view {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple view:nth-child(2) {
    animation-delay: -0.5s;
}

@keyframes lds-ripple {
    0% {
        top: 36px;
        left: 36px;
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        top: 0;
        left: 0;
        width: 72px;
        height: 72px;
        opacity: 0;
    }
}
</style>