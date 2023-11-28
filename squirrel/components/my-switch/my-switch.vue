<template>
    <view class="switch-container" :style="containerStyle">
    
        <view class="switch_view" :style="'border-radius:' + ( width + 'rem' )" @click.prevent.stop="changeSwitch"></view>
    
        <view class="position-box" :style="this.defaultSwitch? 'left: 50%;' : ''" :animation="animationData">
    
            <view class="position_view" :style="positionStyle"><span>{{ this.isSwitch ? '开' : '关' }}</span></view>
    
        </view>
    
    </view>
</template>

<script>
export default {
    name: "my-switch",
    props: {
        defaultSwitch: { // 默认状态
            type: Boolean,
            default: false
        },
        width: {
			type: Number,
			default: 3
		},
		height: {
			type: Number,
			default: 1.5
		},
        bj_color: { //开时背景色
            type: String,
            default: '#FF9417'
        },
        un_bj_color: { //关时背景色
            type: String,
            default: '#FADDB5'
        },
        checked_bj_color: { //开 小圆背景色
            type: String,
            default: '#fff'
        },
        un_checked_bj_color: { // 关 小圆背景色
            type: String,
            default: '#fff'
        }
    },
    data() {
        return {
            isSwitch: false,
            animationData: null
        }
    },
    computed: {
        containerStyle() {
            return {
                "background": this.isSwitch? this.bj_color : this.un_bj_color,
                "width": this.width + "rem",
                "height": this.height + "rem",
                "border-radius": this.width + "rem"
            }
        },
        positionStyle() {
            return {
                "background": this.isSwitch? this.checked_bj_color : this.un_checked_bj_color,
                "width": this.width * 0.5 * 0.8 + "rem",
                "height": this.height * 0.8 + "rem"
            }
        }
    },
    beforeMount() {
        this.isSwitch = this.defaultSwitch;
        this.changeAnimation();
    },
    methods: {
        initAnimation()  {
            return uni.createAnimation({
		        duration: 500,
		        timingFunction: 'ease'
	        });
        },
        changeAnimation() {
            if (!this.isSwitch) {
                this.animationData = this.initAnimation().left(0).step().export();
            } else {
                this.animationData = this.initAnimation().left('50%').step().export();
            }
        },
        changeSwitch() {
            if (this.disabled) return;
            this.isSwitch = !this.isSwitch
            this.$emit('isSwitch', this.isSwitch);
            this.changeAnimation();
        }
    }
}
</script>

<style lang="scss" scoped>
.switch-container {
    position: relative;
    .switch_view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    .position-box {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .position_view {
            position: absolute;
            border-radius: 50%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            span {
                display: block;
                font-size: .7rem;
                color: #EF9838;
                font-weight: bold;
            }
        }
    }
}
</style>