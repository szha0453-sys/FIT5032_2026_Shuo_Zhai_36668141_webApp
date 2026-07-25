import { createRouter, createWebHistory } from 'vue-router'

import { currentUser, isAuthenticated } from '@/stores/auth'
import AccountView from '@/views/AccountView.vue'
import FindSupportView from '@/views/FindSupportView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import StaffView from '@/views/StaffView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesView,
      meta: { title: 'Health resources' },
    },
    {
      path: '/find-support',
      name: 'find-support',
      component: FindSupportView,
      meta: { title: 'Find support' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Log in', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Create an account', guestOnly: true },
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { title: 'My account', requiresAuth: true },
    },
    {
      path: '/staff',
      name: 'staff',
      component: StaffView,
      meta: { title: 'Staff area', requiresAuth: true, roles: ['staff'] },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
      meta: { title: 'Access denied', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page not found' },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (
    Array.isArray(to.meta.roles) &&
    !to.meta.roles.includes(currentUser.value?.role)
  ) {
    return { name: 'unauthorized', query: { from: to.fullPath } }
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: currentUser.value?.role === 'staff' ? 'staff' : 'account' }
  }

  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | SilverCare`
})

export default router
