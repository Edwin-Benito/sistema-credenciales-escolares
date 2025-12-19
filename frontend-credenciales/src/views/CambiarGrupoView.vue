<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Cambio de Grupo</h1>
    </div>

    <!-- Instrucciones -->
    <div class="rounded-xl border border-blue-800 bg-blue-950/30 p-6">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-2xl text-blue-400">info</span>
        <div class="flex-1">
          <h3 class="mb-2 text-lg font-semibold text-blue-300">¿Cómo funciona?</h3>
          <ul class="space-y-1 text-sm text-blue-200">
            <li>• Selecciona el ciclo escolar actual</li>
            <li>• Busca y selecciona uno o varios alumnos</li>
            <li>• Elige el nuevo grado y grupo de destino</li>
            <li>• El sistema actualizará la inscripción automáticamente</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Selector de ciclo -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Paso 1: Ciclo Escolar</h2>
      <div class="max-w-md">
        <select
          v-model="cicloSeleccionado"
          @change="cargarAlumnos"
          class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
        >
          <option :value="0" disabled>Selecciona un ciclo</option>
          <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
            {{ ciclo.nombre }} {{ ciclo.estatus === 'activo' ? '(Activo)' : '' }}
          </option>
        </select>
      </div>
    </div>

    <!-- Búsqueda y selección de alumnos -->
    <div v-if="cicloSeleccionado" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Paso 2: Seleccionar Alumnos</h2>
      
      <!-- Barra de búsqueda -->
      <div class="mb-4 relative">
        <span class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">search</span>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, apellido o matrícula..."
          class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] pl-12 pr-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div v-if="loading" class="py-8 text-center text-gray-400">
        Cargando alumnos...
      </div>

      <div v-else-if="alumnosFiltrados.length === 0" class="py-8 text-center text-gray-400">
        No se encontraron alumnos
      </div>

      <div v-else>
        <div class="mb-4 flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="todosSeleccionados"
              @change="toggleTodos"
              class="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary"
            />
            <span class="text-sm text-gray-300">Seleccionar todos ({{ alumnosFiltrados.length }})</span>
          </label>
          <span class="text-sm text-gray-400">{{ alumnosSeleccionados.length }} seleccionados</span>
        </div>

        <div class="max-h-96 overflow-y-auto rounded-lg border border-gray-800">
          <table class="w-full">
            <thead class="sticky top-0 bg-[#2b2b2b] border-b border-gray-800">
              <tr>
                <th class="p-3 text-left text-sm font-semibold text-gray-300 w-12"></th>
                <th class="p-3 text-left text-sm font-semibold text-gray-300">Matrícula</th>
                <th class="p-3 text-left text-sm font-semibold text-gray-300">Nombre</th>
                <th class="p-3 text-left text-sm font-semibold text-gray-300">Grupo Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="alumno in alumnosFiltrados"
                :key="alumno.id"
                class="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
              >
                <td class="p-3">
                  <input
                    type="checkbox"
                    :checked="alumnosSeleccionados.includes(alumno.id)"
                    @change="toggleAlumno(alumno.id)"
                    class="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary"
                  />
                </td>
                <td class="p-3 font-mono text-sm text-text-dark">{{ alumno.matricula || 'S/M' }}</td>
                <td class="p-3 text-text-dark">
                  {{ alumno.apellido_paterno }} {{ alumno.apellido_materno }} {{ alumno.nombres }}
                </td>
                <td class="p-3 text-text-dark">
                  {{ alumno.grado ? `${alumno.grado} ${alumno.grupo}` : 'Sin grupo' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Selección de nuevo grupo -->
    <div v-if="alumnosSeleccionados.length > 0" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Paso 3: Nuevo Grado y Grupo</h2>
      
      <div class="grid gap-4 md:grid-cols-2 max-w-2xl">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Grado <span class="text-red-400">*</span>
          </label>
          <select
            v-model="nuevoGrado"
            @change="cargarGruposNuevos"
            class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
          >
            <option :value="0" disabled>Selecciona un grado</option>
            <option v-for="grado in grados" :key="grado.id" :value="grado.id">
              {{ grado.nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Grupo <span class="text-red-400">*</span>
          </label>
          <select
            v-model="nuevoGrupo"
            :disabled="!nuevoGrado || nuevoGrado === 0"
            class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option :value="0" disabled>
              {{ nuevoGrado && nuevoGrado !== 0 ? 'Selecciona un grupo' : 'Primero selecciona un grado' }}
            </option>
            <option v-for="grupo in gruposFiltrados" :key="grupo.id" :value="grupo.id">
              {{ grupo.letra }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex gap-4">
        <button
          @click="cambiarGrupo"
          :disabled="!nuevoGrupo || nuevoGrupo === 0 || cambiando"
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:bg-gray-700 disabled:text-gray-500"
        >
          <span class="material-symbols-outlined">{{ cambiando ? 'sync' : 'swap_horiz' }}</span>
          <span>{{ cambiando ? 'Procesando...' : `Cambiar ${alumnosSeleccionados.length} Alumno(s)` }}</span>
        </button>
        <button
          @click="limpiarSeleccion"
          :disabled="cambiando"
          class="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 text-sm font-medium text-text-dark hover:bg-gray-800"
        >
          Limpiar Selección
        </button>
      </div>
    </div>

    <!-- Mensaje de resultado -->
    <div
      v-if="mensaje"
      :class="[
        'rounded-xl border p-6',
        error ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'
      ]"
    >
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-2xl" :class="error ? 'text-red-400' : 'text-green-400'">
          {{ error ? 'error' : 'check_circle' }}
        </span>
        <div class="flex-1">
          <h3 class="mb-1 text-lg font-semibold" :class="error ? 'text-red-300' : 'text-green-300'">
            {{ error ? 'Error' : 'Éxito' }}
          </h3>
          <p class="text-sm" :class="error ? 'text-red-200' : 'text-green-200'">
            {{ mensaje }}
          </p>
        </div>
        <button
          @click="mensaje = ''"
          class="text-gray-400 hover:text-gray-300"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apiClient from '../api/axiosConfig'

interface Ciclo {
  id: number
  nombre: string
  estatus: string
}

interface Grado {
  id: number
  nombre: string
}

interface Grupo {
  id: number
  grado_id: number
  letra: string
}

interface Alumno {
  id: number
  matricula: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  grado: string | null
  grupo: string | null
}

const ciclos = ref<Ciclo[]>([])
const grados = ref<Grado[]>([])
const grupos = ref<Grupo[]>([])
const alumnos = ref<Alumno[]>([])

const cicloSeleccionado = ref<number>(0)
const nuevoGrado = ref<number>(0)
const nuevoGrupo = ref<number>(0)
const alumnosSeleccionados = ref<number[]>([])
const busqueda = ref('')

const loading = ref(false)
const cambiando = ref(false)
const mensaje = ref('')
const error = ref(false)

const alumnosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return alumnos.value

  const termino = busqueda.value.toLowerCase().trim()
  return alumnos.value.filter((alumno) => {
    const nombreCompleto = `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase()
    const matricula = (alumno.matricula || '').toLowerCase()
    return nombreCompleto.includes(termino) || matricula.includes(termino)
  })
})

const gruposFiltrados = computed(() => {
  if (nuevoGrado.value === 0) return []
  return grupos.value.filter(g => g.grado_id === nuevoGrado.value)
})

const todosSeleccionados = computed(() => {
  return alumnosFiltrados.value.length > 0 && 
         alumnosFiltrados.value.every(a => alumnosSeleccionados.value.includes(a.id))
})

async function cargarDatosIniciales() {
  try {
    const [ciclosRes, gradosRes, gruposRes] = await Promise.all([
      apiClient.get<Ciclo[]>('/ciclos-escolares'),
      apiClient.get<Grado[]>('/grados'),
      apiClient.get<Grupo[]>('/grupos')
    ])
    
    ciclos.value = ciclosRes.data
    grados.value = gradosRes.data
    grupos.value = gruposRes.data

    // Seleccionar ciclo activo por defecto
    const cicloActivo = ciclos.value.find(c => c.estatus === 'activo')
    if (cicloActivo) {
      cicloSeleccionado.value = cicloActivo.id
      cargarAlumnos()
    }
  } catch (err: any) {
    console.error('Error al cargar datos:', err)
    mensaje.value = 'Error al cargar los datos iniciales'
    error.value = true
  }
}

async function cargarAlumnos() {
  if (!cicloSeleccionado.value) return

  try {
    loading.value = true
    const { data } = await apiClient.get<Alumno[]>('/alumnos')
    alumnos.value = data
  } catch (err: any) {
    console.error('Error al cargar alumnos:', err)
    mensaje.value = 'Error al cargar la lista de alumnos'
    error.value = true
  } finally {
    loading.value = false
  }
}

function cargarGruposNuevos() {
  nuevoGrupo.value = 0
}

function toggleAlumno(id: number) {
  const index = alumnosSeleccionados.value.indexOf(id)
  if (index > -1) {
    alumnosSeleccionados.value.splice(index, 1)
  } else {
    alumnosSeleccionados.value.push(id)
  }
}

function toggleTodos() {
  if (todosSeleccionados.value) {
    // Deseleccionar todos los filtrados
    alumnosSeleccionados.value = alumnosSeleccionados.value.filter(
      id => !alumnosFiltrados.value.some(a => a.id === id)
    )
  } else {
    // Seleccionar todos los filtrados
    const filtradosIds = alumnosFiltrados.value.map(a => a.id)
    alumnosSeleccionados.value = [...new Set([...alumnosSeleccionados.value, ...filtradosIds])]
  }
}

async function cambiarGrupo() {
  if (!nuevoGrupo.value || alumnosSeleccionados.value.length === 0) return

  try {
    cambiando.value = true
    mensaje.value = ''
    error.value = false

    // Procesar cada alumno
    const promesas = alumnosSeleccionados.value.map(alumnoId =>
      apiClient.put(`/inscripciones/cambiar-grupo`, {
        alumno_id: alumnoId,
        ciclo_escolar_id: cicloSeleccionado.value,
        nuevo_grupo_id: nuevoGrupo.value
      })
    )

    await Promise.all(promesas)

    mensaje.value = `Se cambió exitosamente de grupo a ${alumnosSeleccionados.value.length} alumno(s)`
    error.value = false

    // Recargar alumnos y limpiar selección
    await cargarAlumnos()
    limpiarSeleccion()
  } catch (err: any) {
    console.error('Error al cambiar grupo:', err)
    mensaje.value = err?.response?.data?.message || 'Error al cambiar de grupo'
    error.value = true
  } finally {
    cambiando.value = false
  }
}

function limpiarSeleccion() {
  alumnosSeleccionados.value = []
  nuevoGrado.value = 0
  nuevoGrupo.value = 0
}

onMounted(cargarDatosIniciales)
</script>

<style scoped>
.form-select, .form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.form-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888888' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.material-symbols-outlined.sync {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
