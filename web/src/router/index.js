import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DrawTable from '../views/DrawTable.vue'
import Briefing from '../views/Briefing.vue'
import Timeline from '../views/Timeline.vue'
import Archive from '../views/Archive.vue'

const routes = [
  { path: '/',         name: 'home',     component: Home     },
  { path: '/draw',     name: 'draw',     component: DrawTable },
  { path: '/briefing', name: 'briefing', component: Briefing },
  { path: '/timeline', name: 'timeline', component: Timeline },
  { path: '/archive',  name: 'archive',  component: Archive  },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
