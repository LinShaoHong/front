<template>
  <view>
    <back></back>
    <view class="_back"></view>
    <image class="pen" src="../../../static/pen.png"></image>
    <image class="ruler" src="../../../static/ruler.png"></image>
    <image class="earth" src="../../../static/earth.png"></image>
    <image class="paper-fly" src="../../../static/paper-fly.png"></image>
    <image class="bottle" src="../../../static/bottle.png"></image>
    <view class="box">
      <view class="left">
        <view class="left-middle">
          <view class="left-top">
            <view class="poster">
              <image :src="$media('raz-a-3.jpg')"></image>
              <view class="op">
                <view class="circle">
                  <image class="collect" src="../../../static/collect.png"></image>
                </view>
              </view>
            </view>
            <view class="intro">
              <view class="title"><span>Happy Birthday</span></view>
              <view class="category">
                <view class="ca-name">RAZ</view>
                <view class="ca-level">Level aa</view>
              </view>
              <view class="age-words">
                <view class="age">3-6岁</view>
                <view class="words"><span>单词数：</span><span style="font-weight: 700;">24</span></view>
              </view>
              <view class="time">
                <image src="../../../static/timer.png"></image>
                <view class="desc">阅读时间：<span style="font-weight: 700; letter-spacing: .5px;">3分钟</span></view>
              </view>
              <view class="core-words">
                <image src="../../../static/core.png"></image>
                <view class="desc">核心单词</view>
              </view>
            </view>
            <view class="brief">
              <image src="../../../static/problem.png"></image>
              <span>一年级的开学日是什么样的呢? 来看看绘本里的小朋友都干了些什么吧!</span>
            </view>
          </view>
        </view>
      </view>
      <view class="right">
        <view class="right-middle">
          <view class="right-top">
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
._back {
  z-index: -10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #FAEFD5;
  opacity: .8;
}

.box {
  position: absolute;
  width: 100vw;
  height: 90vh;
  top: 5vh;
  background-color: transparent;
  transform-style: preserve-3D;
  perspective: 3000px;

  .left {
    position: absolute;
    width: 50%;
    height: 100%;
    transform: rotateY(-15deg);
    transform-origin: right;
    border-radius: 40px 0 0 40px;
    background-color: #FE7A15;
    box-shadow: 3px 3px 3px #F84408 inset, 3px -3px 3px #F84408 inset;

    .left-middle {
      position: absolute;
      width: 96%;
      height: 90%;
      right: 0;
      top: 0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
      border-radius: 30px 0 0 30px;
      background-color: #FFEFDE;
      box-shadow: -2px -5px 3px #F84408, -2px 5px 5px #F84408, 3px 0 2px #F9B661 inset, 3px 3px 2px #F9B661 inset, 0 -3px 2px #F9B661 inset;

      .left-top {
        position: absolute;
        width: 98%;
        height: 94%;
        right: 0;
        top: 0;
        bottom: 0;
        margin-top: auto;
        margin-bottom: auto;
        border-radius: 25px 0 0 25px;
        background-color: #FFEFDE;
        box-shadow: 2px 0 1px #F9B661 inset, 2px 2px 1px #F9B661 inset, 0 -2px 1px #F9B661 inset;

        .poster {
          position: absolute;
          width: 35%;
          height: 60%;
          left: 8%;
          top: 10%;
          border-radius: 10px;
          background-color: #FFF8EE;
          box-shadow: #F9B661 .1px .1px 1px .1px;

          image {
            top: 5%;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            position: absolute;
            height: 75%;
            width: 85%;
          }

          .op {
            position: absolute;
            top: 83%;
            height: 15%;
            width: 86%;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .circle {
              position: relative;
              width: 22%;
              height: 90%;
              border-radius: 50%;
              box-shadow: rgba(0, 0, 0, 0.15) .5px 1px 1px;

              .collect {
                position: absolute;
                width: 80%;
                height: 80%;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
              }
            }
          }
        }

        .intro {
          position: absolute;
          left: 50%;
          width: 45%;
          height: 60%;
          top: 10%;

          .title {
            width: 100%;
            line-height: 22px;

            span {
              color: #8F6637;
              font-size: 18px;
              font-weight: 700;
            }
          }

          .category {
            margin-top: 5px;
            display: flex;
            flex-direction: row;
            column-gap: 10px;

            .ca-name {
              color: #F79A2A;
              font-size: 15px;
              font-weight: 700;
            }

            .ca-level {
              color: #F79A2A;
              font-size: 15px;
              font-weight: 700;
            }
          }

          .age-words {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            padding-right: 30px;
            justify-content: space-between;

            .age {
              color: #A97526;
              font-size: 14px;
              font-weight: 700;
              letter-spacing: .5px;
            }

            .words {
              color: #A97526;
              font-size: 14px;
            }
          }

          .time {
            display: flex;
            flex-direction: row;
            column-gap: 3px;
            margin-top: 5px;

            image {
              width: 20px;
              height: 20px;
            }

            .desc {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              color: #A97526;
              font-size: 14px;
            }
          }

          .core-words {
            margin-top: 10px;
            width: 50%;
            height: 15%;
            box-sizing: border-box;
            border-radius: 20px;
            background-color: #FDAD34;
            display: flex;
            flex-direction: row;
            column-gap: 3px;
            align-items: center;
            justify-content: space-between;
            padding-left: 5px;
            padding-right: 5px;
            box-shadow: #8B4000 1px 1px 1.5px;

            image {
              width: 15px;
              height: 15px;
            }

            .desc {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              color: #8B4000;
              font-size: 12px;
            }
          }
        }

        .brief {
          position: absolute;
          top: 75%;
          width: 85%;
          left: 8%;
          min-height: 16%;
          background: #FFFBF2;
          border-radius: 10px;
          box-shadow: #F9B661 0px 1px 2px 0px, #F9B661 0px 0px 0px 1px;
          line-height: 12px;
          padding: 8px 10px 5px 10px;

          image {
            z-index: 5;
            position: absolute;
            top: -5px;
            left: -5px;
            width: 20px;
            height: 20px;
          }

          span {
            font-size: 12px;
            color: #AD8150;
            font-weight: bold;
            letter-spacing: 1px;
          }
        }
      }
    }
  }

  .right {
    position: absolute;
    left: 50%;
    width: 50%;
    height: 100%;
    transform: rotateY(15deg);
    transform-origin: left;
    border-radius: 0 40px 40px 0;
    background-color: #FE7A15;
    box-shadow: -3px -3px 3px #F84408 inset, -3px 3px 3px #F84408 inset;

    .right-middle {
      position: absolute;
      width: 96%;
      height: 90%;
      left: 0;
      top: 0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
      border-radius: 0 30px 30px 0;
      background-color: #FFEFDE;
      box-shadow: 2px -5px 3px #F84408, 2px 5px 5px #F84408, -3px 0 2px #F9B661 inset, -3px 3px 2px #F9B661 inset, 0 -3px 2px #F9B661 inset;

      .right-top {
        position: absolute;
        width: 98%;
        height: 94%;
        left: 0;
        top: 0;
        bottom: 0;
        margin-top: auto;
        margin-bottom: auto;
        border-radius: 0 25px 25px 0;
        background-color: #FFEFDE;
        box-shadow: -2px 0 1px #F9B661 inset, -2px 2px 1px #F9B661 inset, 0 -2px 1px #F9B661 inset;
      }
    }
  }
}

.pen {
  position: fixed;
  z-index: 5;
  bottom: 7%;
  right: 5%;
  height: 60px;
  width: 30px;
}

.earth {
  position: fixed;
  z-index: 2;
  bottom: 7%;
  right: 45%;
  height: 80px;
  width: 80px;
}

.paper-fly {
  position: fixed;
  z-index: 2;
  bottom: 7%;
  left: 6%;
  height: 40px;
  width: 40px;
}

.bottle {
  position: fixed;
  z-index: 2;
  top: 5%;
  right: 3%;
  height: 60px;
  width: 60px;
}

.ruler {
  position: fixed;
  z-index: 1;
  bottom: 5%;
  right: 6%;
  height: 50px;
  width: 60px;
}
</style>