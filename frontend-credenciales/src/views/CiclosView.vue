<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Ciclos Escolares</h1>
    </div>

    <!-- Formulario para crear ciclo -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Crear Nuevo Ciclo</h2>
      <div class="flex gap-3">
        <input
          v-model="nuevoCiclo"
          type="text"
          placeholder="Ej: 2024-2025"
          class="form-input h-12 flex-1 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
          @keyup.enter="crearCiclo"
        />
        <button
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
          :disabled="!nuevoCiclo.trim()"
          @click="crearCiclo"
        >
          <span class="material-symbols-outlined">add</span>
          <span>Crear Ciclo</span>
        </button>
      </div>
    </div>

    <!-- Tabla de ciclos -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Lista de Ciclos</h2>
      <div v-if="loading" class="py-8 text-center text-gray-400">
        Cargando ciclos...
      </div>
      <div v-else-if="ciclos.length === 0" class="py-8 text-center text-gray-400">
        No hay ciclos escolares registrados.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-800 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-300">Nombre</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Estatus</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ciclo in ciclos"
              :key="ciclo.id"
              class="border-b border-gray-800 last:border-0"
            >
              <td class="py-4 text-text-dark">{{ ciclo.nombre }}</td>
              <td class="py-4">
                <span
                  v-if="ciclo.estatus === 'activo'"
                  class="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
                >
                  Activo
                </span>
                <span
                  v-else
                  class="inline-flex rounded-full bg-gray-500/20 px-3 py-1 text-xs font-medium text-gray-400"
                >
                  Inactivo
                </span>
              </td>
              <td class="py-4">
                <button
                  v-if="ciclo.estatus !== 'activo'"
                  class="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                  @click="activarCiclo(ciclo.id)"
                >
                  Activar
                </button>
                <span v-else class="text-sm text-gray-500">Ciclo activo</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../api/axiosConfig'

interface Ciclo {
  id: number
  nombre: string
  estatus: 'activo' | 'inactivo'
}

const ciclos = ref<Ciclo[]>([])
const nuevoCiclo = ref('')
const loading = ref(false)

async function cargarCiclos() {
  try {
    loading.value = true
    const { data } = await apiClient.get<Ciclo[]>('/ciclos-escolares')
    ciclos.value = data
  } catch (err: any) {
    console.error('Error al cargar ciclos:', err)
    alert(err?.response?.data?.message || 'Error al cargar los ciclos escolares')
  } finally {
    loading.value = false
  }
}

async function crearCiclo() {
  if (!nuevoCiclo.value.trim()) return

  try {
    await apiClient.post('/ciclos-escolares', { nombre: nuevoCiclo.value.trim() })
    nuevoCiclo.value = ''
    await cargarCiclos()
  } catch (err: any) {
    console.error('Error al crear ciclo:', err)
    alert(err?.response?.data?.message || 'Error al crear el ciclo escolar')
  }
}

async function activarCiclo(id: number) {
  try {
    await apiClient.put(`/ciclos-escolares/${id}/activar`)
    await cargarCiclos()
  } catch (err: any) {
    console.error('Error al activar ciclo:', err)
    alert(err?.response?.data?.message || 'Error al activar el ciclo')
  }
}

onMounted(cargarCiclos)
</script>

<style scoped>
.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
