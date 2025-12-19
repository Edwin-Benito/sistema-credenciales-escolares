<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Grados Escolares</h1>
    </div>

    <!-- Formulario para crear grado -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Crear Nuevo Grado</h2>
      <div class="flex gap-3">
        <input
          v-model="nuevoGradoNombre"
          type="text"
          placeholder="Nombre del grado (ej: 1° Primaria, 2° Primaria)"
          class="form-input h-12 flex-1 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
          @keyup.enter="crearGrado"
        />
        <button
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
          :disabled="!nuevoGradoNombre.trim()"
          @click="crearGrado"
        >
          <span class="material-symbols-outlined">add</span>
          <span>Crear Grado</span>
        </button>
      </div>
    </div>

    <!-- Tabla de grados -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Lista de Grados</h2>
      <div v-if="loading" class="py-8 text-center text-gray-400">
        Cargando grados...
      </div>
      <div v-else-if="grados.length === 0" class="py-8 text-center text-gray-400">
        No hay grados registrados. Crea el primero arriba.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-800 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-300">ID</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Nombre</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="grado in grados"
              :key="grado.id"
              class="border-b border-gray-800 last:border-0"
            >
              <td class="py-4 text-text-dark font-mono">{{ grado.id }}</td>
              <td class="py-4 text-text-dark font-medium">{{ grado.nombre }}</td>
              <td class="py-4">
                <button
                  class="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20"
                  @click="eliminarGrado(grado.id)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Nota informativa -->
    <div class="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
      <div class="flex gap-3">
        <span class="material-symbols-outlined text-yellow-500">info</span>
        <div class="flex-1">
          <p class="text-sm font-medium text-yellow-200">Importante</p>
          <p class="mt-1 text-sm text-yellow-100/80">
            Los grados se usan para organizar los grupos. Asegúrate de crear los grados antes de crear grupos.
            No puedes eliminar un grado si tiene grupos asociados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../api/axiosConfig'

interface Grado {
  id: number
  nombre: string
}

const grados = ref<Grado[]>([])
const nuevoGradoNombre = ref('')
const loading = ref(false)

async function cargarGrados() {
  try {
    loading.value = true
    const { data } = await apiClient.get<Grado[]>('/grados')
    grados.value = data
  } catch (err: any) {
    console.error('Error al cargar grados:', err)
    alert(err?.response?.data?.message || 'Error al cargar los grados')
  } finally {
    loading.value = false
  }
}

async function crearGrado() {
  if (!nuevoGradoNombre.value.trim()) return

  try {
    await apiClient.post('/grados', {
      nombre: nuevoGradoNombre.value.trim(),
    })
    nuevoGradoNombre.value = ''
    await cargarGrados()
  } catch (err: any) {
    console.error('Error al crear grado:', err)
    alert(err?.response?.data?.message || 'Error al crear el grado')
  }
}

async function eliminarGrado(id: number) {
  if (!confirm('¿Estás seguro de eliminar este grado? No podrás eliminarlo si tiene grupos asociados.')) return

  try {
    await apiClient.delete(`/grados/${id}`)
    await cargarGrados()
  } catch (err: any) {
    console.error('Error al eliminar grado:', err)
    alert(err?.response?.data?.message || 'Error al eliminar el grado. Puede tener grupos asociados.')
  }
}

onMounted(cargarGrados)
</script>

<style scoped>
.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
