<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-dark p-4">
    <div class="layout-container flex h-full grow flex-col items-center justify-center">
      <div class="w-full max-w-md">
        <div class="flex flex-col items-center rounded-xl border border-gray-800 bg-[#1e1e1e] p-6 shadow-lg sm:p-8">
          <div class="mb-6 h-20 w-20">
            <div class="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
              <span class="material-symbols-outlined text-8xl text-primary">school</span>
            </div>
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-100">Iniciar Sesión</h1>

          <form class="mt-8 w-full space-y-5" @submit.prevent="handleLogin">
            <div v-if="errorMessage" class="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
              {{ errorMessage }}
            </div>

            <div class="flex w-full flex-col">
              <label class="mb-2 text-base font-medium text-gray-300" for="username">Usuario / Correo Electrónico</label>
              <div class="relative flex w-full items-center">
                <span class="material-symbols-outlined pointer-events-none absolute left-4 text-xl text-gray-500">person</span>
                <input
                  id="username"
                  type="text"
                  class="form-input h-14 w-full flex-1 rounded-lg border border-gray-700 bg-[#2b2b2b] p-[15px] pl-12 text-base font-normal text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="Su correo electrónico"
                  v-model="username"
                  autocomplete="username"
                  required
                />
              </div>
            </div>

            <div class="flex w-full flex-col">
              <label class="mb-2 text-base font-medium text-gray-300" for="password">Contraseña</label>
              <div class="relative flex w-full items-center">
                <span class="material-symbols-outlined pointer-events-none absolute left-4 text-xl text-gray-500">lock</span>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input h-14 w-full flex-1 rounded-lg border border-gray-700 bg-[#2b2b2b] p-[15px] pl-12 pr-12 text-base font-normal text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  v-model="password"
                  autocomplete="current-password"
                  required
                />
                <button
                  aria-label="Mostrar contraseña"
                  class="absolute right-4 text-gray-500 hover:text-gray-300"
                  type="button"
                  @click="toggleShowPassword"
                >
                  <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <button
              class="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-base font-bold tracking-[0.015em] text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-70"
              :disabled="isSubmitting"
              type="submit"
            >
              <span class="truncate">{{ isSubmitting ? 'Entrando…' : 'Entrar' }}</span>
            </button>
          </form>

          <a class="mt-6 text-sm text-primary hover:underline" href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)
const showPassword = ref(false)

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}

async function handleLogin() {
  errorMessage.value = null
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await authStore.login(username.value, password.value)
    await router.push('/dashboard')
  } catch (err: unknown) {
    const anyErr = err as any
    errorMessage.value =
      anyErr?.response?.data?.message || anyErr?.message || 'Error al iniciar sesión'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
