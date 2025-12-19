<template>
  <div class="font-display bg-background-dark text-text-dark">
    <div class="relative flex min-h-screen w-full flex-col group/design-root">
      <header class="sticky top-0 z-10 flex h-16 items-center justify-between whitespace-nowrap border-b border-gray-800 bg-[#1e1e1e] px-6">
        <div class="flex items-center gap-4 text-text-dark">
          <svg class="text-primary size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_6_543)">
              <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
              <path clip-rule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fill-rule="evenodd"></path>
            </g>
            <defs>
              <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
            </defs>
          </svg>
          <h2 class="text-lg font-bold tracking-[-0.015em]">School Logo</h2>
        </div>
        <div class="flex flex-1 justify-end gap-4 items-center">
          <p class="text-sm font-medium text-text-dark hidden sm:block">{{ displayRol }}, {{displayName}}</p>
          <button
            class="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-text-dark hover:bg-gray-800"
            @click="handleLogout"
          >
            Cerrar Sesión
          </button>
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User avatar of Laura Pérez"
            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCycXbTUSlnEOjLUv3U6p3nooDoNRYY_pHtPjifQFHYDg6RLQjRS-ArK0mY6_0O0kSidLagNkevet-rEd-G9d5U2TslN-eVEYtLJhDKjURJQDI-qcaz5gqo7CJfZ5ef_CvKmCuRC3TQrs0u_TZhjVsmaee5HYFZ13uErd_Pkv7w13LVUmRmB4KfEQR2vK76kzHfTlE77kcRq6fFNPX8iiOBEb7HQ7tvMx_woFGADgnuqH1TJ95kwH6BH5DfUB1XGpEdJXPbeqZG4b4");'></div>
        </div>
      </header>

      <div class="flex flex-1">
        <aside class="sticky top-16 h-[calc(100vh-64px)] w-64 flex-col justify-between bg-[#1e1e1e] p-4 border-r border-gray-800 hidden lg:flex">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3 px-3 py-2">
              <div class="flex flex-col">
                <h1 class="text-3xl  font-bold  text-text-dark">{{displayName}}</h1>
                <p class="text-lg font-normal text-gray-400">{{displayRol}}</p>
              </div>
            </div>
            <nav class="flex flex-col gap-2 mt-4">
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/dashboard" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">dashboard</span>
                <p class="text-sm font-medium">Dashboard</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/alumnos" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">person</span>
                <p class="text-sm font-medium">Alumnos</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/importar" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">upload_file</span>
                <p class="text-sm font-medium">Importar Excel</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/cambiar-grupo" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">swap_horiz</span>
                <p class="text-sm font-medium">Cambiar Grupo</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/credenciales" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">badge</span>
                <p class="text-sm font-medium">Credenciales</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/grados" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">school</span>
                <p class="text-sm font-medium">Grados</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/grupos" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">groups</span>
                <p class="text-sm font-medium">Grupos</p>
              </RouterLink>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/ciclos" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">event</span>
                <p class="text-sm font-medium">Ciclos Escolares</p>
              </RouterLink>
              <div class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed opacity-50">
                <span class="material-symbols-outlined">bar_chart</span>
                <p class="text-sm font-medium">Reportes <span class="text-xs">(Próximamente)</span></p>
              </div>
              <RouterLink class="flex items-center gap-3 rounded-lg px-3 py-2 text-text-dark hover:bg-white/10" to="/configuracion" active-class="bg-primary/20 text-primary">
                <span class="material-symbols-outlined">settings</span>
                <p class="text-sm font-medium">Configuración</p>
              </RouterLink>
            </nav>
          </div>
        </aside>

        <main class="flex-1 p-6 md:p-8">
          <div class="max-w-7xl mx-auto">
            <!-- Aquí se renderizan las vistas hijas protegidas -->
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(
  () => authStore.user?.name || authStore.user?.username || "........"
);

const displayRol = computed(() => {
  const rol = authStore.user?.rol ?? ""
  return rol ? String(rol).toUpperCase() : "........"
});

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
