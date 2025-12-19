<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Generar Credenciales</h1>
    </div>

    <!-- Instrucciones -->
    <div class="rounded-xl border border-blue-800 bg-blue-950/30 p-6">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-2xl text-blue-400">info</span>
        <div class="flex-1">
          <h3 class="mb-2 text-lg font-semibold text-blue-300">¿Cómo funciona?</h3>
          <ul class="space-y-1 text-sm text-blue-200">
            <li>• <strong>Generación por Grupo:</strong> Selecciona ciclo, grado y grupo para generar todas las credenciales del grupo en un solo PDF</li>
            <li>• <strong>Generación Individual:</strong> Busca un alumno por matrícula para generar solo su credencial</li>
            <li>• El PDF se abrirá en una nueva pestaña y podrás imprimirlo o descargarlo</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Tabs: Grupo vs Individual -->
    <div class="flex gap-2 border-b border-gray-800">
      <button
        @click="modoGeneracion = 'grupo'"
        :class="[
          'px-6 py-3 text-sm font-medium transition-colors border-b-2',
          modoGeneracion === 'grupo'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-400 hover:text-gray-300'
        ]"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined">groups</span>
          <span>Generar por Grupo</span>
        </div>
      </button>
      <button
        @click="modoGeneracion = 'individual'"
        :class="[
          'px-6 py-3 text-sm font-medium transition-colors border-b-2',
          modoGeneracion === 'individual'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-400 hover:text-gray-300'
        ]"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined">person</span>
          <span>Generar Individual</span>
        </div>
      </button>
    </div>

    <!-- Modo: Generar por Grupo -->
    <div v-if="modoGeneracion === 'grupo'" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Filtros</h2>
      
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Ciclo Escolar <span class="text-red-400">*</span>
          </label>
          <select
            v-model="cicloId"
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
            v-model="gradoId"
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
            v-model="grupoId"
            :disabled="!gradoId || gradoId === 0"
            class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option :value="0" disabled>
              {{ gradoId && gradoId !== 0 ? 'Selecciona un grupo' : 'Primero selecciona un grado' }}
            </option>
            <option v-for="grupo in gruposFiltrados" :key="grupo.id" :value="grupo.id">
              {{ grupo.letra }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex gap-4">
        <button
          @click="generarPorGrupo"
          :disabled="!grupoId || grupoId === 0 || generando"
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
        >
          <span class="material-symbols-outlined" :class="{ 'animate-spin': generando }">
            {{ generando ? 'sync' : 'picture_as_pdf' }}
          </span>
          <span>{{ generando ? 'Generando PDF...' : 'Generar PDF por Grupo' }}</span>
        </button>
      </div>
    </div>

    <!-- Modo: Generar Individual -->
    <div v-else class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Búsqueda de Alumno</h2>
      
      <div class="max-w-md space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Buscar por Matrícula o Nombre
          </label>
          <div class="relative">
            <span class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">search</span>
            <input
              v-model="busquedaAlumno"
              @input="buscarAlumnos"
              type="text"
              placeholder="Escribe la matrícula o nombre del alumno..."
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] pl-12 pr-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Lista de resultados -->
        <div v-if="busquedaAlumno.length >= 2 && alumnosBuscados.length > 0" class="max-h-64 overflow-y-auto rounded-lg border border-gray-700">
          <div
            v-for="alumno in alumnosBuscados"
            :key="alumno.id"
            @click="seleccionarAlumno(alumno)"
            class="flex cursor-pointer items-center justify-between border-b border-gray-800 p-3 hover:bg-gray-800/50 last:border-0"
          >
            <div>
              <p class="font-medium text-text-dark">
                {{ alumno.apellido_paterno }} {{ alumno.apellido_materno }} {{ alumno.nombres }}
              </p>
              <p class="text-sm text-gray-400">Matrícula: {{ alumno.matricula || 'S/M' }}</p>
            </div>
            <span class="material-symbols-outlined text-primary">chevron_right</span>
          </div>
        </div>

        <div v-else-if="busquedaAlumno.length >= 2 && alumnosBuscados.length === 0" class="rounded-lg border border-gray-700 p-4 text-center text-sm text-gray-400">
          No se encontraron alumnos
        </div>

        <!-- Alumno seleccionado -->
        <div v-if="alumnoSeleccionado" class="rounded-lg border border-primary/50 bg-primary/10 p-4">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-primary">Alumno Seleccionado</h3>
            <button @click="limpiarSeleccionAlumno" class="text-gray-400 hover:text-gray-300">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <p class="font-medium text-text-dark">
            {{ alumnoSeleccionado.apellido_paterno }} {{ alumnoSeleccionado.apellido_materno }} {{ alumnoSeleccionado.nombres }}
          </p>
          <p class="text-sm text-gray-400">Matrícula: {{ alumnoSeleccionado.matricula || 'S/M' }}</p>
          <p class="text-sm text-gray-400">CURP: {{ alumnoSeleccionado.curp }}</p>
        </div>
      </div>

      <div class="mt-6 flex gap-4">
        <button
          @click="generarIndividual"
          :disabled="!alumnoSeleccionado || generando"
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
        >
          <span class="material-symbols-outlined" :class="{ 'animate-spin': generando }">
            {{ generando ? 'sync' : 'picture_as_pdf' }}
          </span>
          <span>{{ generando ? 'Generando PDF...' : 'Generar Credencial Individual' }}</span>
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
        <button @click="mensaje = ''" class="text-gray-400 hover:text-gray-300">
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
  curp: string
}

const modoGeneracion = ref<'grupo' | 'individual'>('grupo')

// Catálogos
const ciclos = ref<Ciclo[]>([])
const grados = ref<Grado[]>([])
const grupos = ref<Grupo[]>([])

// Filtros para modo grupo
const cicloId = ref<number>(0)
const gradoId = ref<number>(0)
const grupoId = ref<number>(0)

// Búsqueda individual
const busquedaAlumno = ref('')
const alumnosBuscados = ref<Alumno[]>([])
const alumnoSeleccionado = ref<Alumno | null>(null)

// Estados
const generando = ref(false)
const mensaje = ref('')
const error = ref(false)

const gruposFiltrados = computed(() => {
  if (gradoId.value === 0) return []
  return grupos.value.filter(g => g.grado_id === gradoId.value)
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
      cicloId.value = cicloActivo.id
    }
  } catch (err: any) {
    console.error('Error al cargar catálogos:', err)
    mensaje.value = 'Error al cargar los datos iniciales'
    error.value = true
  }
}

function cargarGrupos() {
  grupoId.value = 0
}

async function generarPorGrupo() {
  if (!grupoId.value || grupoId.value === 0) {
    mensaje.value = 'Selecciona un grupo para generar las credenciales'
    error.value = true
    return
  }

  try {
    generando.value = true
    mensaje.value = ''
    error.value = false

    const params: any = { grupo_id: grupoId.value }
    if (cicloId.value && cicloId.value !== 0) {
      params.ciclo_id = cicloId.value
    }

    const response = await apiClient.get('/credenciales/generar-pdf', {
      params,
      responseType: 'blob'
    })

    // Crear URL temporal para el archivo
    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    
    // Crear enlace invisible <a>
    const fileLink = document.createElement('a')
    fileLink.href = fileURL
    
    // Nombre del archivo
    const gradoInfo = grados.value.find(g => g.id === gradoId.value)
    const grupoInfo = gruposFiltrados.value.find(g => g.id === grupoId.value)
    const nombreArchivo = `credenciales-${gradoInfo?.nombre || 'grupo'}-${grupoInfo?.letra || ''}.pdf`
    fileLink.setAttribute('download', nombreArchivo)
    
    // Agregarlo, hacer clic y removerlo
    document.body.appendChild(fileLink)
    fileLink.click()
    document.body.removeChild(fileLink)
    
    // Liberar memoria
    window.URL.revokeObjectURL(fileURL)

    mensaje.value = 'PDF descargado exitosamente. Revisa tu carpeta de Descargas.'
    error.value = false
  } catch (err: any) {
    console.error('Error al generar PDF:', err)
    mensaje.value = err?.response?.data?.message || 'Error al generar el PDF del grupo'
    error.value = true
  } finally {
    generando.value = false
  }
}

async function buscarAlumnos() {
  if (busquedaAlumno.value.length < 2) {
    alumnosBuscados.value = []
    return
  }

  try {
    const { data } = await apiClient.get<Alumno[]>('/alumnos')
    const termino = busquedaAlumno.value.toLowerCase().trim()
    
    alumnosBuscados.value = data.filter((alumno) => {
      const nombreCompleto = `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase()
      const matricula = (alumno.matricula || '').toLowerCase()
      return nombreCompleto.includes(termino) || matricula.includes(termino)
    }).slice(0, 10) // Limitar a 10 resultados
  } catch (err: any) {
    console.error('Error al buscar alumnos:', err)
  }
}

function seleccionarAlumno(alumno: Alumno) {
  alumnoSeleccionado.value = alumno
  busquedaAlumno.value = ''
  alumnosBuscados.value = []
}

function limpiarSeleccionAlumno() {
  alumnoSeleccionado.value = null
  busquedaAlumno.value = ''
}

async function generarIndividual() {
  if (!alumnoSeleccionado.value) {
    mensaje.value = 'Selecciona un alumno para generar su credencial'
    error.value = true
    return
  }

  try {
    generando.value = true
    mensaje.value = ''
    error.value = false

    const response = await apiClient.get('/credenciales/generar-pdf', {
      params: { alumno_id: alumnoSeleccionado.value.id },
      responseType: 'blob'
    })

    // Crear URL temporal para el archivo
    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    
    // Crear enlace invisible <a>
    const fileLink = document.createElement('a')
    fileLink.href = fileURL
    
    // Nombre del archivo
    const nombreArchivo = `credencial-${alumnoSeleccionado.value.id}.pdf`
    fileLink.setAttribute('download', nombreArchivo)
    
    // Agregarlo, hacer clic y removerlo
    document.body.appendChild(fileLink)
    fileLink.click()
    document.body.removeChild(fileLink)
    
    // Liberar memoria
    window.URL.revokeObjectURL(fileURL)

    mensaje.value = 'Credencial descargada exitosamente. Revisa tu carpeta de Descargas.'
    error.value = false
  } catch (err: any) {
    console.error('Error al generar credencial:', err)
    mensaje.value = err?.response?.data?.message || 'Error al generar la credencial'
    error.value = true
  } finally {
    generando.value = false
  }
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
