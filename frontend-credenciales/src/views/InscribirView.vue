<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Inscribir Alumnos</h1>
    </div>

    <!-- Instrucciones -->
    <div class="rounded-xl border border-blue-800 bg-blue-950/30 p-6">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-2xl text-blue-400">info</span>
        <div class="flex-1">
          <h3 class="mb-2 text-lg font-semibold text-blue-300">¿Cómo funciona?</h3>
          <ul class="space-y-1 text-sm text-blue-200">
            <li>• Selecciona el ciclo escolar, grado y grupo destino</li>
            <li>• Busca y selecciona los alumnos que deseas inscribir (pueden estar sin grupo o de otro ciclo)</li>
            <li>• El sistema creará las inscripciones automáticamente</li>
            <li>• Si un alumno ya está inscrito en el ciclo, no se duplicará</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Paso 1: Selección de Ciclo, Grado y Grupo -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Paso 1: Destino de Inscripción</h2>
      
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Ciclo Escolar <span class="text-red-400">*</span>
          </label>
          <select
            v-model="destino.cicloId"
            class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
          >
            <option :value="0" disabled>Selecciona un ciclo</option>
            <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
              {{ ciclo.nombre }} {{ ciclo.estatus === 'activo' ? '(Activo)' : '' }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Grado <span class="text-red-400">*</span>
          </label>
          <select
            v-model="destino.gradoId"
            @change="cargarGrupos"
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
            v-model="destino.grupoId"
            :disabled="!destino.gradoId || destino.gradoId === 0"
            class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option :value="0" disabled>
              {{ destino.gradoId && destino.gradoId !== 0 ? 'Selecciona un grupo' : 'Primero selecciona un grado' }}
            </option>
            <option v-for="grupo in gruposFiltrados" :key="grupo.id" :value="grupo.id">
              {{ grupo.letra }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="destino.grupoId && destino.grupoId !== 0" class="mt-4 rounded-lg border border-green-700 bg-green-900/20 p-4">
        <div class="flex items-center gap-2 text-green-300">
          <span class="material-symbols-outlined">check_circle</span>
          <p class="text-sm font-medium">
            Los alumnos seleccionados se inscribirán en: 
            <strong>{{ cicloSeleccionadoNombre }} - {{ gradoSeleccionadoNombre }} {{ grupoSeleccionadoLetra }}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Paso 2: Selección de Alumnos -->
    <div v-if="destino.grupoId && destino.grupoId !== 0" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
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
                <th class="p-3 text-left text-sm font-semibold text-gray-300">Estado Actual</th>
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
                <td class="p-3">
                  <span v-if="alumno.yaInscrito" class="inline-flex items-center gap-1 rounded-full bg-amber-900/30 px-2 py-1 text-xs font-medium text-amber-300">
                    <span class="material-symbols-outlined text-sm">warning</span>
                    Ya inscrito en este ciclo
                  </span>
                  <span v-else-if="alumno.grupo" class="text-sm text-gray-400">
                    {{ alumno.grado }} {{ alumno.grupo }}
                  </span>
                  <span v-else class="text-sm text-gray-500">Sin grupo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Botón de Inscribir -->
    <div v-if="alumnosSeleccionados.length > 0" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="mb-1 text-lg font-semibold text-text-dark">
            ¿Listo para inscribir?
          </h3>
          <p class="text-sm text-gray-400">
            Se inscribirán {{ alumnosSeleccionados.length }} alumno(s) en {{ gradoSeleccionadoNombre }} {{ grupoSeleccionadoLetra }}
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="limpiarSeleccion"
            :disabled="inscribiendo"
            class="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 text-sm font-medium text-text-dark hover:bg-gray-800"
          >
            Limpiar
          </button>
          <button
            @click="inscribirAlumnos"
            :disabled="inscribiendo"
            class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
          >
            <span class="material-symbols-outlined" :class="{ 'animate-spin': inscribiendo }">
              {{ inscribiendo ? 'sync' : 'person_add' }}
            </span>
            <span>{{ inscribiendo ? 'Inscribiendo...' : 'Inscribir Alumnos' }}</span>
          </button>
        </div>
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
          <div v-if="resultadoDetalle" class="mt-3 text-sm" :class="error ? 'text-red-200' : 'text-green-200'">
            <p><strong>Inscritos exitosamente:</strong> {{ resultadoDetalle.exitosos }}</p>
            <p v-if="resultadoDetalle.duplicados > 0" class="text-amber-300">
              <strong>Ya estaban inscritos:</strong> {{ resultadoDetalle.duplicados }}
            </p>
            <p v-if="resultadoDetalle.errores > 0" class="text-red-300">
              <strong>Errores:</strong> {{ resultadoDetalle.errores }}
            </p>
          </div>
        </div>
        <button @click="mensaje = ''; resultadoDetalle = null" class="text-gray-400 hover:text-gray-300">
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
  yaInscrito?: boolean
}

const ciclos = ref<Ciclo[]>([])
const grados = ref<Grado[]>([])
const grupos = ref<Grupo[]>([])
const alumnos = ref<Alumno[]>([])

const destino = ref({
  cicloId: 0,
  gradoId: 0,
  grupoId: 0
})

const alumnosSeleccionados = ref<number[]>([])
const busqueda = ref('')
const loading = ref(false)
const inscribiendo = ref(false)
const mensaje = ref('')
const error = ref(false)
const resultadoDetalle = ref<{ exitosos: number; duplicados: number; errores: number } | null>(null)

const gruposFiltrados = computed(() => {
  if (destino.value.gradoId === 0) return []
  return grupos.value.filter(g => g.grado_id === destino.value.gradoId)
})

const alumnosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return alumnos.value

  const termino = busqueda.value.toLowerCase().trim()
  return alumnos.value.filter((alumno) => {
    const nombreCompleto = `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase()
    const matricula = (alumno.matricula || '').toLowerCase()
    return nombreCompleto.includes(termino) || matricula.includes(termino)
  })
})

const todosSeleccionados = computed(() => {
  return alumnosFiltrados.value.length > 0 && 
         alumnosFiltrados.value.every(a => alumnosSeleccionados.value.includes(a.id))
})

const cicloSeleccionadoNombre = computed(() => {
  return ciclos.value.find(c => c.id === destino.value.cicloId)?.nombre || ''
})

const gradoSeleccionadoNombre = computed(() => {
  return grados.value.find(g => g.id === destino.value.gradoId)?.nombre || ''
})

const grupoSeleccionadoLetra = computed(() => {
  return grupos.value.find(g => g.id === destino.value.grupoId)?.letra || ''
})

async function cargarCatalogos() {
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
      destino.value.cicloId = cicloActivo.id
      cargarAlumnos()
    }
  } catch (err: any) {
    console.error('Error al cargar catálogos:', err)
  }
}

async function cargarAlumnos() {
  try {
    loading.value = true
    const { data } = await apiClient.get<Alumno[]>('/alumnos')
    
    // Verificar cuáles ya están inscritos en el ciclo seleccionado
    const inscripciones = await apiClient.get('/inscripciones/por-ciclo', {
      params: { ciclo_id: destino.value.cicloId }
    })
    
    const alumnosInscritos = new Set(inscripciones.data.map((i: any) => i.alumno_id))
    
    alumnos.value = data.map(a => ({
      ...a,
      yaInscrito: alumnosInscritos.has(a.id)
    }))
  } catch (err: any) {
    console.error('Error al cargar alumnos:', err)
    alumnos.value = []
  } finally {
    loading.value = false
  }
}

function cargarGrupos() {
  destino.value.grupoId = 0
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
    alumnosSeleccionados.value = alumnosSeleccionados.value.filter(
      id => !alumnosFiltrados.value.some(a => a.id === id)
    )
  } else {
    const filtradosIds = alumnosFiltrados.value.map(a => a.id)
    alumnosSeleccionados.value = [...new Set([...alumnosSeleccionados.value, ...filtradosIds])]
  }
}

async function inscribirAlumnos() {
  if (!destino.value.grupoId || alumnosSeleccionados.value.length === 0) return

  try {
    inscribiendo.value = true
    mensaje.value = ''
    error.value = false
    resultadoDetalle.value = null

    let exitosos = 0
    let duplicados = 0
    let errores = 0

    // Inscribir cada alumno
    for (const alumnoId of alumnosSeleccionados.value) {
      try {
        await apiClient.post('/inscripciones', {
          alumno_id: alumnoId,
          ciclo_escolar_id: destino.value.cicloId,
          grupo_id: destino.value.grupoId
        })
        exitosos++
      } catch (err: any) {
        if (err?.response?.status === 409) {
          duplicados++
        } else {
          errores++
        }
      }
    }

    resultadoDetalle.value = { exitosos, duplicados, errores }
    
    if (exitosos > 0) {
      mensaje.value = `Se inscribieron ${exitosos} alumno(s) exitosamente`
      error.value = false
      
      // Recargar alumnos y limpiar selección
      await cargarAlumnos()
      limpiarSeleccion()
    } else if (duplicados === alumnosSeleccionados.value.length) {
      mensaje.value = 'Todos los alumnos seleccionados ya estaban inscritos en este ciclo'
      error.value = true
    } else {
      mensaje.value = 'Hubo errores al inscribir algunos alumnos'
      error.value = true
    }
  } catch (err: any) {
    console.error('Error al inscribir:', err)
    mensaje.value = err?.response?.data?.message || 'Error al inscribir alumnos'
    error.value = true
  } finally {
    inscribiendo.value = false
  }
}

function limpiarSeleccion() {
  alumnosSeleccionados.value = []
}

onMounted(cargarCatalogos)
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
