import { createRouter, createWebHashHistory } from 'vue-router'
import InicioView from './views/InicioView.vue'
import ModuloView from './views/ModuloView.vue'
import ProgresoView from './views/ProgresoView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'inicio', component: InicioView },
    { path: '/modulo/:id', name: 'modulo', component: ModuloView, props: true },
    { path: '/progreso', name: 'progreso', component: ProgresoView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
