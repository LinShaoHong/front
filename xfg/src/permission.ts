import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import i18n from '@/lang'
import settings from './settings'
import { UserModule } from '@/store/modules/user'
import { info } from '@/api/user'
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false })

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, from: Route, next: any) => {
  NProgress.start()
  if (UserModule.user === null) {
    const cookie = Cookies.get('XFG-TOKEN')
    if (cookie != null) {
      const user = await info()
      UserModule.Set(user.value)
    }
  }
  next()
  NProgress.done()
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()
  // set page title
  document.title = getPageTitle(to.meta.title)
})
