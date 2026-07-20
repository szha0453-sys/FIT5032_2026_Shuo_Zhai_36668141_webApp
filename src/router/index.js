import { createRouter, createWebHistory } from 'vue-router'

import FindSupportView from '@/views/FindSupportView.vue'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ResourcesView from '@/views/ResourcesView.vue'

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
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | SilverCare`
})

export default router
