<template>
    <view class="rate-container">
        <span>慢</span>
        <movable-area class="slider-area" animation="false">
            <view class="gone" :style="'width: ' + (x !== 0 ? (x + 8 + sliderWidth/2 + 'px') : 'calc(50%);')">
                <view class="rate-score" :style="'left: ' + (x !== 0 ? (x + sliderWidth/2 + 'px') : 'calc(50%);')">{{ rate + 'X' }}</view>
            </view>
            <movable-view class="slider" :x="x" direction="horizontal" animation="false" @change="onChange"></movable-view>
        </movable-area>
        <span>快</span>
    </view>
</template>
<script>
export default {
    name: "play-rate",
    data() {
        return {
            x: 0,
            rate: 1,
            sliderWidth: 0,
        }
    },
    created() {
        this.calSliderWidth();
    },
    methods: {
        onChange(e) {
            this.x = e.detail.x;
            const step = this.x / (this.sliderWidth / 8) / 10;
            this.rate = 1 + new Number(step.toFixed(1));
            this.$emit('rateChange', this.rate);
        },
        calSliderWidth() {
            if (this.sliderWidth === 0) {
                let sliderAreaWidth;
                const vi = setInterval(() => {
                    this.$u.getRect('.slider-area').then(rect => {
                        sliderAreaWidth = rect.width;
                        clearInterval(vi);
                    });
                }, 1000);

                const _vi = setInterval(() => {
                    this.$u.getRect('.slider').then(rect => {
                        this.sliderWidth = sliderAreaWidth - rect.width;
                        clearInterval(_vi);
                    });
                }, 1000);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.rate-container {
    width: 100%;
    height: .8em;
    margin-top: 10%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    span {
        display: block;
        font-size: 12px;
        color: #8F6637;
    }
    .slider-area {
        width: 100%;
        height: .8rem;
        border-radius: 10px;
        pointer-events: none;
        background-color: #D9CAA1;
        touch-action: none;
        .gone {
            height: 100%;
            border-radius: 10px 0 0 10px;
            background-color: #FFD67A;
            .rate-score {
                display: block;
                position: absolute;
                top: -15px;
                font-size: 12px;
                line-height: 12px;
            }
        }
        .slider {
            position: absolute;
            width: .8rem;
            height: .8rem;
            top: -.35rem;
            left: calc(50% - .5rem);
            border-radius: 50%;
            background-color: #FCBE15;
            pointer-events: auto;
        }
    }
}
</style>