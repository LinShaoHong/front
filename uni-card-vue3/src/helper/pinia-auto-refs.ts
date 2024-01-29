import type { AutoToRefs, ToRef } from 'vue'

import appStore from '@/store/appStore'
import configStore from '@/store/configStore'
import userStore from '@/store/userStore'

import store from '@/store'

declare module 'vue' {
  export type AutoToRefs<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : ToRef<T[K]>
  }
}

const storeExports = {
  app: appStore,
  user: userStore,
  config: configStore
}

export function useStore<T extends keyof typeof storeExports>(storeName: T) {
  const targetStore = storeExports[storeName](store)
  const storeRefs = storeToRefs(targetStore)
  return { ...targetStore, ...storeRefs } as unknown as AutoToRefs<ReturnType<typeof storeExports[T]>>
}
