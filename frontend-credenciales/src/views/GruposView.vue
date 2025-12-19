<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Grupos Escolares</h1>
    </div>

    <!-- Formulario para crear grupo -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Crear Nuevo Grupo</h2>
      <div class="flex gap-3">
        <select
          v-model="gradoSeleccionado"
          class="form-input h-12 flex-1 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
        >
          <option :value="0" disabled>Selecciona un grado</option>
          <option v-for="grado in grados" :key="grado.id" :value="grado.id">
            {{ grado.nombre }}
          </option>
        </select>
        <input
          v-model="nuevoGrupoLetra"
          type="text"
          maxlength="1"
          placeholder="Letra (A, B, C...)"
          class="form-input h-12 w-32 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-center text-base uppercase text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
          @keyup.enter="crearGrupo"
        />
        <button
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
          :disabled="!gradoSeleccionado || !nuevoGrupoLetra.trim()"
          @click="crearGrupo"
        >
          <span class="material-symbols-outlined">add</span>
          <span>Crear Grupo</span>
        </button>
      </div>
    </div>

    <!-- Tabla de grupos -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Lista de Grupos</h2>
      <div v-if="loading" class="py-8 text-center text-gray-400">
        Cargando grupos...
      </div>
      <div v-else-if="grupos.length === 0" class="py-8 text-center text-gray-400">
        No hay grupos registrados.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-800 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-300">Grado</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Letra</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Nombre Completo</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="grupo in grupos"
              :key="grupo.id"
              class="border-b border-gray-800 last:border-0"
            >
              <td class="py-4 text-text-dark">{{ grupo.grado_nombre }}</td>
              <td class="py-4 text-text-dark">{{ grupo.letra }}</td>
              <td class="py-4 text-text-dark font-medium">{{ grupo.grado_nombre }} - {{ grupo.letra }}</td>
              <td class="py-4">
                <button
                  class="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20"
                  @click="eliminarGrupo(grupo.id)"
                >
                  Eliminar
                </button>
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

interface Grado {
  id: number
  nombre: string
}

interface Grupo {
  id: number
  grado_id: number
  letra: string
  grado_nombre: string
}

const grupos = ref<Grupo[]>([])
const grados = ref<Grado[]>([])
const nuevoGrupoLetra = ref('')
const gradoSeleccionado = ref<number>(0)
const loading = ref(false)

async function cargarDatos() {
  try {
    loading.value = true
    const [gradosRes, gruposRes] = await Promise.all([
      apiClient.get<Grado[]>('/grados'),
      apiClient.get<Grupo[]>('/grupos'),
    ])
    grados.value = gradosRes.data
    grupos.value = gruposRes.data
  } catch (err: any) {
    console.error('Error al cargar datos:', err)
    alert(err?.response?.data?.message || 'Error al cargar grados y grupos')
  } finally {
    loading.value = false
  }
}

async function crearGrupo() {
  if (!gradoSeleccionado.value || !nuevoGrupoLetra.value.trim()) return

  try {
    await apiClient.post('/grupos', {
      grado_id: gradoSeleccionado.value,
      letra: nuevoGrupoLetra.value.trim().toUpperCase(),
    })
    nuevoGrupoLetra.value = ''
    gradoSeleccionado.value = 0
    await cargarDatos()
  } catch (err: any) {
    console.error('Error al crear grupo:', err)
    alert(err?.response?.data?.message || 'Error al crear el grupo')
  }
}

async function eliminarGrupo(id: number) {
  if (!confirm('¿Estás seguro de eliminar este grupo?')) return

  try {
    await apiClient.delete(`/grupos/${id}`)
    await cargarDatos()
  } catch (err: any) {
    console.error('Error al eliminar grupo:', err)
    alert(err?.response?.data?.message || 'Error al eliminar el grupo')
  }
}

onMounted(cargarDatos)
</script>

<style scoped>
.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
