<template>
  <view class="_container">
    <back></back>
    <background :url="'../../static/ge_back.jpg'"></background>
    <view class="_back"></view>
    <view v-if="containerTop < scrollTop" class="back-top" @click="toTop">
      <image src="../../static/back-top.png"></image>
    </view>
    <view v-if="containerTop < scrollTop" class="hanging-right">
      <image src="../../static/hanging.png"></image>
    </view>
    <view v-if="containerTop < scrollTop" class="hanging-left">
      <image src="../../static/hanging.png"></image>
    </view>
    <view :class="[containerTop < scrollTop * 2 ? 'nav-top-vis' : 'nav-top-transparent', 'nav-top']">
      <view class="in search">
        <image src="../../static/search.png"></image>
        <input placeholder="输入你要搜索的书本" placeholder-style="color: #F48E00; font-size: 13px;"/>
      </view>
      <view class="in latest-read">
        <image src="../../static/latest.png"></image>
        <span>最近阅读</span>
      </view>
      <view class="in bookshelf">
        <image src="../../static/bookshelf.png"></image>
        <span>书架</span>
      </view>
    </view>
    <view class="nav">
      <view class="nav-core">
        <view class="topic">
          <view class="title">
            <span>类别</span>
          </view>
          <view class="ca-container">
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>自然拼读</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>分级读物</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>动画片</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>歌曲</span>
            </view>
          </view>
        </view>
        <view class="topic">
          <view class="title">
            <span>主题</span>
          </view>
          <view class="ca-container">
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>Oxford</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>RAZ</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>海尼曼</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>牛津树</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>丽声北极星</span>
            </view>
            <view class="ca">
              <image src="../../static/bookshelf.png"></image>
              <span>Big Cat</span>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="books-container">
      <view>
        <view class="book-shelfs">
          <view v-for=" item  in  5 " :key="item">
            <view class="books">
              <book-card class="book" :url="$media('oxford.jpg')" :title="'Happy Birthday'"
                         @click.native="toWord"></book-card>
              <book-card class="book" :url="$media('raz-a-post.jpg')" :title="'Fruits in the market and box'"
                         @click.native="toRead"></book-card>
              <book-card class="book" :url="$media('oxford3.jpg')" :title="'Oxford Three'"
                         @click.native="toBookDetail"></book-card>
              <book-card class="book" :url="$media('oxford4.jpg')" :title="'Oxford Four'"
                         @click.native="toRead2"></book-card>
              <book-card class="book" :url="$media('oxford5.jpg')" :title="'Oxford Five'"
                         @click.native="toBook"></book-card>
            </view>
            <view class="shelf"></view>
            <view class="shelf-front"></view>
            <view class="shelf-froot-root">
              <view class="shelf-froot shelf-froot-left"></view>
              <view class="shelf-froot shelf-froot-right"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      containerTop: 0,
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onLoad() {
    const that = this;
    const vi = setInterval(() => {
      that.$u.getRect('.books-container').then(rect => {
        that.containerTop = rect.top;
        clearInterval(vi);
      });
    }, 1000);
  },
  methods: {
    toTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 200
      })
    },
    toWord() {
      uni.navigateTo({
        url: '/pages/library/category/caWord',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    },
    toBook() {
      uni.navigateTo({
        url: '/pages/library/category/caBook',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    },
    toBookDetail() {
      uni.navigateTo({
        url: '/pages/library/category/caBookDetail',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    },
    toRead() {
      uni.navigateTo({
        url: '/pages/library/category/caRead',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    },
    toRead2() {
      uni.navigateTo({
        url: '/pages/library/category/caRead2',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
._back {
  z-index: -10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #FBE7B3;
}

.back-top {
  position: fixed;
  z-index: 2;
  right: 1rem;
  bottom: 1rem;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0px 2px #FFCD7D;

  image {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 13px;
    height: 12px;
  }
}

.hanging-right {
  position: fixed;
  z-index: -9;
  right: -1rem;
  bottom: 30vh;

  image {
    width: 2rem;
    height: 6rem;
  }
}

.hanging-left {
  position: fixed;
  z-index: -9;
  left: -1rem;
  bottom: 10vh;

  image {
    width: 2rem;
    height: 6rem;
  }
}

._container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1rem;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  padding-bottom: 1rem;
  box-sizing: border-box;
}

.nav-top-transparent {
  background-color: transparent;
  transition: .2s linear;
}

.nav-top-vis {
  transition: .2s linear;
  background-color: #FBE7B3;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.nav-top {
  position: fixed;
  width: 100vw;
  height: 14vh;
  padding-top: 1rem;
  z-index: 2;

  .in {
    position: absolute;
    background-color: white;
    height: 26px;
    border-radius: 15px;
    box-shadow: 0 2px #FFC06E;
    color: #F48E00;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span {
      font-size: 15px;
      font-weight: 700;
    }
  }

  .search {
    right: 30%;
    width: 25%;
    border-radius: 20px;
    justify-content: flex-start;

    image {
      margin-left: 5px;
      margin-right: 2px;
      width: 20px;
      height: 20px;
    }

    input {
      font-size: 13px;
      color: #F48E00;
    }
  }

  .latest-read {
    right: 13%;
    width: 13%;

    image {
      width: 20px;
      height: 20px;
      margin-right: .5rem;
    }
  }

  .bookshelf {
    right: 2%;
    width: 9%;

    image {
      width: 15px;
      height: 15px;
      margin-right: .5rem;
    }
  }
}

.nav {
  width: 100vw;
  padding-bottom: 20px;
  background-color: #FFCD7D;
  border-radius: 0 0 3rem 3rem;
  box-shadow: .3rem .3rem 2rem .3rem #FCB146 inset, -.3rem -.3rem 2rem .3rem #FCB146 inset, 0 .4rem #FFD99B;

  .nav-core {
    width: 80%;
    margin-top: 3.5rem;
    margin-left: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 6px;

    .topic {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .title {
        background-color: #FF9400;
        width: 50px;
        height: 28px;
        border-radius: 20px;
        border-style: solid;
        border-width: 2px;
        border-color: #F58400;
        margin-right: 10px;
        display: grid;
        place-content: center;

        span {
          color: white;
          font-size: 13px;
        }
      }

      .ca-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 35px;
        width: 100%;
        overflow-x: scroll;
        scroll-behavior: smooth;

        .ca {
          height: 82%;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 3px #FFC06E;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding-left: 8px;
          padding-right: 8px;
          margin-right: 10px;

          image {
            width: 15px;
            height: 15px;
            margin-right: .5rem;
          }

          span {
            font-size: 12px;
            font-weight: 700;
          }
        }
      }
    }
  }
}

.books-container {
  position: relative;
  width: 90vw;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;

  .book-shelfs {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;

    .books {
      z-index: 5;
      display: grid;
      justify-content: space-between;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      box-sizing: border-box;
      grid-template-columns: repeat(5, 1fr);
      column-gap: 1.5rem;

      .book {
        margin-bottom: -10px;
      }
    }

    .shelf {
      border-bottom: 20px solid #FFC663;
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
    }

    .shelf-front {
      background: white;
      height: 10px;
      width: 90vw;
      border-radius: 0 0 2px 2px;
      box-shadow: 0.01px 0.01px 5px 0.01px #FCB146 inset, -0.01px -0.01px 5px 0.01px #FCB146 inset;
    }

    .shelf-froot-root {
      position: relative;
      width: 100%;

      .shelf-froot {
        position: absolute;
        height: 100%;
        width: .8rem;
        height: .8rem;
        background-color: #f69b23;
        clip-path: polygon(20% 0, 80% 0%, 100% 60%, 0 60%);
      }

      .shelf-froot-left {
        left: 5%;
      }

      .shelf-froot-right {
        right: 5%;
      }
    }
  }
}
</style>