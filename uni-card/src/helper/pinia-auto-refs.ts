import type { AutoToRefs, ToRef } from 'vue'

import configStore from '@/store/config'
import userStore from '@/store/user'

import store from '@/store'

declare module 'vue' {
  export type AutoToRefs<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : ToRef<T[K]>
  }
}

const storeExports = {
  config: configStore,
  user: userStore,
}

export function useStore<T extends keyof typeof storeExports>(storeName: T) {
  const targetStore = storeExports[storeName](store)
  const storeRefs = storeToRefs(targetStore)
  return { ...targetStore, ...storeRefs } as unknown as AutoToRefs<ReturnType<typeof storeExports[T]>>
}
