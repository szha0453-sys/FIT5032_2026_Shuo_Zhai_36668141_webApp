import { createRouter, createWebHistory } from 'vue-router'

import FindSupportView from '@/views/FindSupportView.vue'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import AccountView from '@/views/AccountView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import StaffView from '@/views/StaffView.vue'

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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page not found' },
    },
    { path: '/login', 
      name: 'login', 
      component: LoginView, 
      meta: { title: 'Log in' } 
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Create an account' },
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { title: 'My account' },
    },
    { path: '/staff', 
      name: 'staff', 
      component: StaffView, 
      meta: { title: 'Staff area' } 
    },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | SilverCare`
})

export default router
