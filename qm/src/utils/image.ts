import Vue from 'vue'

const isServer = Vue.prototype.$isServer

export const on = (element, event, handler) => {
  if (!isServer && document.addEventListener) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false)
    }
  } else {
    if (element && event && handler) {
      element.attachEvent('on' + event, handler)
    }
  }
}

export const off = (element, event, handler) => {
  if (!isServer && document.addEventListener) {
    if (element && event && handler) {
      element.removeEventListener(event, handler, false)
    }
  } else {
    if (element && event && handler) {
      element.detachEvent('on' + event, handler)
    }
  }
}

export const rafThrottle = fn => {
  let locked = false
  return (...args) => {
    if (locked) return
    locked = true
    window.requestAnimationFrame(_ => {
      fn.apply(this, args)
      locked = false
    })
  }
}

export const isFirefox = () =>
  !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i)
