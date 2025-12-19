<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Gestión de Alumnos</h1>
      <button
        class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90"
        @click="irANuevoAlumno"
      >
        <span class="material-symbols-outlined">add</span>
        <span>Agregar Nuevo Alumno</span>
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <div class="relative">
        <span class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">search</span>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, apellido o matrícula..."
          class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] pl-12 pr-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>

    <!-- Tabla de alumnos -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-text-dark">Lista de Alumnos</h2>
        <span class="text-sm text-gray-400">{{ alumnosFiltrados.length }} alumnos encontrados</span>
      </div>

      <div v-if="loading" class="py-8 text-center text-gray-400">
        Cargando alumnos...
      </div>
      <div v-else-if="alumnos.length === 0" class="py-8 text-center text-gray-400">
        No hay alumnos registrados. Haz clic en "Agregar Nuevo Alumno" para comenzar.
      </div>
      <div v-else-if="alumnosFiltrados.length === 0" class="py-8 text-center text-gray-400">
        No se encontraron alumnos con el criterio de búsqueda "{{ busqueda }}"
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-800 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-300">Matrícula</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Nombre Completo</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Grado</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Grupo</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Estatus</th>
              <th class="pb-3 text-sm font-semibold text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="alumno in alumnosFiltrados"
              :key="alumno.id"
              class="border-b border-gray-800 last:border-0"
            >
              <td class="py-4 font-mono text-sm text-text-dark">{{ alumno.matricula || 'Sin matrícula' }}</td>
              <td class="py-4 text-text-dark">
                {{ alumno.apellido_paterno }} {{ alumno.apellido_materno }} {{ alumno.nombres }}
              </td>
              <td class="py-4 text-text-dark">{{ alumno.grado || '-' }}</td>
              <td class="py-4 text-text-dark">{{ alumno.grupo || '-' }}</td>
              <td class="py-4">
                <span
                  v-if="alumno.estatus_general === 'activo'"
                  class="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
                >
                  Activo
                </span>
                <span
                  v-else
                  class="inline-flex rounded-full bg-gray-500/20 px-3 py-1 text-xs font-medium text-gray-400"
                >
                  {{ alumno.estatus_general || 'Inactivo' }}
                </span>
              </td>
              <td class="py-4">
                <button
                  class="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                  @click="irADetalle(alumno.id)"
                >
                  <span class="material-symbols-outlined text-base">visibility</span>
                  <span>Ver Detalles</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/axiosConfig'

interface Alumno {
  id: number
  matricula: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  estatus_general: string
  grupo: string | null
  grado: string | null
}

const router = useRouter()
const alumnos = ref<Alumno[]>([])
const busqueda = ref('')
const loading = ref(false)

const alumnosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return alumnos.value

  const termino = busqueda.value.toLowerCase().trim()
  return alumnos.value.filter((alumno) => {
    const nombreCompleto = `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase()
    const matricula = (alumno.matricula || '').toLowerCase()
    return nombreCompleto.includes(termino) || matricula.includes(termino)
  })
})

async function cargarAlumnos() {
  try {
    loading.value = true
    const { data } = await apiClient.get<Alumno[]>('/alumnos')
    alumnos.value = data
  } catch (err: any) {
    console.error('Error al cargar alumnos:', err)
    alert(err?.response?.data?.message || 'Error al cargar la lista de alumnos')
  } finally {
    loading.value = false
  }
}

function irANuevoAlumno() {
  router.push('/alumnos/nuevo')
}

function irADetalle(id: number) {
  router.push(`/alumnos/${id}`)
}

onMounted(cargarAlumnos)
</script>

<style scoped>
.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
