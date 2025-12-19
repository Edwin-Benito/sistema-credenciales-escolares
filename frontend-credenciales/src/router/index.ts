import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'ciclos',
        name: 'ciclos',
        component: () => import('../views/CiclosView.vue'),
      },
      {
        path: 'grados',
        name: 'grados',
        component: () => import('../views/GradosView.vue'),
      },
      {
        path: 'grupos',
        name: 'grupos',
        component: () => import('../views/GruposView.vue'),
      },
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('../views/EscuelaView.vue'),
      },
      {
        path: 'alumnos',
        name: 'alumnos',
        component: () => import('../views/AlumnosView.vue'),
      },
      {
        path: 'alumnos/nuevo',
        name: 'alumno-nuevo',
        component: () => import('../views/AlumnoNuevoView.vue'),
      },
      {
        path: 'alumnos/:id',
        name: 'alumno-detalle',
        component: () => import('../views/AlumnoDetalleView.vue'),
      },
      {
        path: 'importar',
        name: 'importar',
        component: () => import('../views/ImportarView.vue'),
      },
      {
        path: 'cambiar-grupo',
        name: 'cambiar-grupo',
        component: () => import('../views/CambiarGrupoView.vue'),
      },
      {
        path: 'credenciales',
        name: 'credenciales',
        component: () => import('../views/CredencialesView.vue'),
      },
      { path: '', redirect: '/dashboard' },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const needsAuth = to.matched.some(record => record.meta?.requiresAuth)
  if (needsAuth && !authStore.isAuthenticated) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
