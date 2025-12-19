<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Importar Alumnos desde Excel</h1>
    </div>

    <!-- Instrucciones -->
    <div class="rounded-xl border border-blue-500/50 bg-blue-500/10 p-6">
      <div class="flex gap-3">
        <span class="material-symbols-outlined text-2xl text-blue-400">info</span>
        <div class="flex-1">
          <h3 class="mb-2 text-lg font-semibold text-blue-400">Instrucciones para la importación</h3>
          <ul class="list-inside list-disc space-y-1 text-sm text-gray-300">
            <li><strong>Modo Masivo:</strong> El Excel contiene todos los alumnos de todos los grados/grupos. El sistema usa la columna "GRADO Y GRUPO" (ej: "1° A") para distribuirlos automáticamente. Los grados y grupos deben existir previamente en el sistema.</li>
            <li><strong>Modo Individual:</strong> Selecciona un grado y grupo específico. Todos los alumnos del Excel se inscribirán en ese grupo. La columna "GRADO Y GRUPO" se ignora.</li>
            <li>El archivo Excel debe contener estas columnas: <strong>GRADO Y GRUPO</strong>, <strong>TUTOR</strong> (nombre del alumno), <strong>TUTOR</strong> (nombre del padre), <strong>TELEFONO 1</strong>, <strong>TELEFONO 2</strong>, <strong>TIPO DE SANGRE</strong>, <strong>DIRECCION</strong></li>
            <li>La primera columna <strong>TUTOR</strong> contiene el nombre completo del alumno (ej: "JUAN PEREZ LOPEZ")</li>
            <li>El sistema parseará automáticamente el nombre completo en: Nombre, Apellido Paterno y Apellido Materno</li>
            <li>Se generará un CURP temporal para cada alumno (puedes editarlo después en la ficha del alumno)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Formulario de importación -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <form @submit.prevent="subirArchivo" class="flex flex-col gap-6">
        <!-- Modo de importación -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            Modo de Importación <span class="text-red-400">*</span>
          </label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                v-model="modoImportacion"
                value="masiva"
                class="h-4 w-4 text-primary focus:ring-primary"
              />
              <div>
                <span class="text-sm font-medium text-text-dark">Importación Masiva</span>
                <p class="text-xs text-gray-400">El Excel contiene todos los grados y grupos. El sistema usa la columna "GRADO Y GRUPO"</p>
              </div>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                v-model="modoImportacion"
                value="individual"
                class="h-4 w-4 text-primary focus:ring-primary"
              />
              <div>
                <span class="text-sm font-medium text-text-dark">Importación por Grupo</span>
                <p class="text-xs text-gray-400">Todos los alumnos del Excel se inscriben en el grupo seleccionado</p>
              </div>
            </label>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <!-- Ciclo Escolar -->
          <div>
            <label for="ciclo" class="mb-2 block text-sm font-medium text-gray-300">
              Ciclo Escolar <span class="text-red-400">*</span>
            </label>
            <select
              id="ciclo"
              v-model="cicloSeleccionado"
              required
              class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            >
              <option :value="0" disabled>-- Selecciona un ciclo --</option>
              <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
                {{ ciclo.nombre }} {{ ciclo.estatus === 'activo' ? '(Activo)' : '' }}
              </option>
            </select>
          </div>

          <!-- Grado -->
          <div>
            <label for="grado" class="mb-2 block text-sm font-medium text-gray-300">
              Grado <span v-if="modoImportacion === 'individual'" class="text-red-400">*</span>
            </label>
            <select
              id="grado"
              v-model="gradoSeleccionado"
              :required="modoImportacion === 'individual'"
              @change="cargarGrupos"
              :disabled="modoImportacion === 'masiva'"
              class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option :value="0" disabled>-- Selecciona un grado --</option>
              <option v-for="grado in grados" :key="grado.id" :value="grado.id">
                {{ grado.nombre }}
              </option>
            </select>
          </div>

          <!-- Grupo -->
          <div>
            <label for="grupo" class="mb-2 block text-sm font-medium text-gray-300">
              Grupo <span v-if="modoImportacion === 'individual'" class="text-red-400">*</span>
            </label>
            <select
              id="grupo"
              v-model="grupoSeleccionado"
              :required="modoImportacion === 'individual'"
              :disabled="modoImportacion === 'masiva' || !gradoSeleccionado || gradoSeleccionado === 0"
              class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option :value="0" disabled>
                {{ gradoSeleccionado && gradoSeleccionado !== 0 ? '-- Selecciona un grupo --' : '-- Primero selecciona un grado --' }}
              </option>
              <option v-for="grupo in gruposFiltrados" :key="grupo.id" :value="grupo.id">
                Grupo {{ grupo.letra }}
              </option>
            </select>
          </div>
        </div>

        <!-- Selector de archivo -->
        <div>
          <label for="archivo" class="mb-2 block text-sm font-medium text-gray-300">
            Archivo Excel <span class="text-red-400">*</span>
          </label>
          <div class="flex items-center gap-4">
            <input
              ref="archivoInput"
              id="archivo"
              type="file"
              accept=".xlsx,.xls"
              class="hidden"
              @change="seleccionarArchivo"
              required
            />
            <button
              type="button"
              class="flex h-12 items-center gap-2 rounded-lg border border-gray-700 px-4 text-sm font-medium text-text-dark hover:bg-gray-800"
              @click="() => archivoInput?.click()"
            >
              <span class="material-symbols-outlined">upload_file</span>
              <span>Seleccionar Archivo</span>
            </button>
            <span v-if="archivoExcel" class="text-sm text-gray-300">
              {{ archivoExcel.name }} ({{ formatearTamano(archivoExcel.size) }})
            </span>
            <span v-else class="text-sm text-gray-500">Ningún archivo seleccionado</span>
          </div>
        </div>

        <!-- Mensajes -->
        <div v-if="mensaje" :class="[
          'rounded-lg border p-4 text-sm',
          error 
            ? 'border-red-500/50 bg-red-500/10 text-red-400' 
            : 'border-green-500/50 bg-green-500/10 text-green-400'
        ]">
          {{ mensaje }}
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-4">
          <button
            type="submit"
            class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:bg-gray-700 disabled:text-gray-500"
            :disabled="cargando || !archivoExcel"
          >
            <span class="material-symbols-outlined">{{ cargando ? 'sync' : 'cloud_upload' }}</span>
            <span>{{ cargando ? 'Importando...' : 'Importar Alumnos' }}</span>
          </button>
          <button
            v-if="archivoExcel"
            type="button"
            class="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 text-sm font-medium text-text-dark hover:bg-gray-800"
            @click="limpiarFormulario"
            :disabled="cargando"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>

    <!-- Plantilla de ejemplo -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-4 text-xl font-semibold text-text-dark">Plantilla de Ejemplo</h2>
      <p class="mb-4 text-sm text-gray-400">
        Tu archivo Excel debe tener esta estructura. La primera fila debe contener exactamente estos nombres de columnas:
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-800">
              <th class="px-4 py-2 text-left font-semibold text-gray-300">GRADO Y GRUPO</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-300">NOMBRE COMPLETO</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-300">TUTOR</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-300">TELEFONO 1</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-300">TELEFONO 2</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-300">TIPO DE SANGRE</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-300">DIRECCION</th>
            </tr>
          </thead>
          <tbody class="font-mono text-gray-400">
            <tr class="border-b border-gray-800">
              <td class="px-4 py-2">1° A</td>
              <td class="px-4 py-2">ATANACIO HERNÁNDEZ DARIKSON</td>
              <td class="px-4 py-2">JOSE ALEJANDRO TORRES MORALES</td>
              <td class="px-4 py-2">7713039686</td>
              <td class="px-4 py-2">7713039738 CASA</td>
              <td class="px-4 py-2">O+</td>
              <td class="px-4 py-2">M1 ED 5 #5 EX-HACIENDA</td>
            </tr>
            <tr class="border-b border-gray-800">
              <td class="px-4 py-2">2° B</td>
              <td class="px-4 py-2">MARIA FERNANDA GONZALEZ RUIZ</td>
              <td class="px-4 py-2">CARLOS GONZALEZ MARTINEZ</td>
              <td class="px-4 py-2">7712345678</td>
              <td class="px-4 py-2">7719876543</td>
              <td class="px-4 py-2">A+</td>
              <td class="px-4 py-2">CALLE PRINCIPAL #123</td>
            </tr>
          </tbody>
        </table>
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

const ciclos = ref<Ciclo[]>([])
const grados = ref<Grado[]>([])
const grupos = ref<Grupo[]>([])

const modoImportacion = ref<'masiva' | 'individual'>('masiva')
const cicloSeleccionado = ref<number>(0)
const gradoSeleccionado = ref<number>(0)
const grupoSeleccionado = ref<number>(0)
const archivoExcel = ref<File | null>(null)
const archivoInput = ref<HTMLInputElement | null>(null)

const cargando = ref(false)
const mensaje = ref('')
const error = ref(false)

const gruposFiltrados = computed(() => {
  if (!gradoSeleccionado.value || gradoSeleccionado.value === 0) {
    return []
  }
  return grupos.value.filter(g => g.grado_id === gradoSeleccionado.value)
})

async function cargarDatos() {
  try {
    const [ciclosRes, gradosRes, gruposRes] = await Promise.all([
      apiClient.get<Ciclo[]>('/ciclos-escolares'),
      apiClient.get<Grado[]>('/grados'),
      apiClient.get<Grupo[]>('/grupos')
    ])
    
    ciclos.value = ciclosRes.data
    grados.value = gradosRes.data
    grupos.value = gruposRes.data
    
    // Seleccionar el ciclo activo por defecto
    const cicloActivo = ciclos.value.find(c => c.estatus === 'activo')
    if (cicloActivo) {
      cicloSeleccionado.value = cicloActivo.id
    }
  } catch (err: any) {
    console.error('Error al cargar datos:', err)
    mensaje.value = 'Error al cargar los datos iniciales'
    error.value = true
  }
}

function cargarGrupos() {
  // Resetear grupo seleccionado cuando cambie el grado
  grupoSeleccionado.value = 0
}

function seleccionarArchivo(event: Event) {
  const input = event.target as HTMLInputElement
  const archivo = input.files?.[0]
  
  if (archivo) {
    // Validar que sea un archivo Excel
    const extension = archivo.name.split('.').pop()?.toLowerCase()
    if (extension !== 'xlsx' && extension !== 'xls') {
      mensaje.value = 'Por favor selecciona un archivo Excel (.xlsx o .xls)'
      error.value = true
      archivoExcel.value = null
      return
    }
    
    archivoExcel.value = archivo
    mensaje.value = ''
  }
}

async function subirArchivo() {
  mensaje.value = ''
  error.value = false
  
  if (!cicloSeleccionado.value || cicloSeleccionado.value === 0) {
    mensaje.value = 'Debes seleccionar un ciclo escolar'
    error.value = true
    return
  }
  
  if (modoImportacion.value === 'individual') {
    if (!grupoSeleccionado.value || grupoSeleccionado.value === 0) {
      mensaje.value = 'En modo individual debes seleccionar un grado y grupo'
      error.value = true
      return
    }
  }
  
  if (!archivoExcel.value) {
    mensaje.value = 'Debes seleccionar un archivo Excel'
    error.value = true
    return
  }
  
  try {
    cargando.value = true
    
    const formData = new FormData()
    formData.append('ciclo_escolar_id', cicloSeleccionado.value.toString())
    formData.append('modo_importacion', modoImportacion.value)
    
    if (modoImportacion.value === 'individual' && grupoSeleccionado.value) {
      formData.append('grupo_id', grupoSeleccionado.value.toString())
    }
    
    formData.append('excelFile', archivoExcel.value)
    
    const { data } = await apiClient.post('/importar-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    mensaje.value = data.message || 'Importación completada con éxito'
    error.value = false
    
    // Limpiar el formulario después de una importación exitosa
    limpiarFormulario()
  } catch (err: any) {
    console.error('Error al importar alumnos:', err)
    console.error('Error response:', err?.response?.data)
    const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Error al importar el archivo Excel'
    mensaje.value = errorMsg
    error.value = true
  } finally {
    cargando.value = false
  }
}

function limpiarFormulario() {
  archivoExcel.value = null
  if (archivoInput.value) {
    archivoInput.value.value = ''
  }
  gradoSeleccionado.value = 0
  grupoSeleccionado.value = 0
  
  // Mantener el ciclo activo seleccionado
  const cicloActivo = ciclos.value.find(c => c.estatus === 'activo')
  if (cicloActivo) {
    cicloSeleccionado.value = cicloActivo.id
  }
}

function formatearTamano(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

onMounted(cargarDatos)
</script>

<style scoped>
.form-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888888' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.material-symbols-outlined.sync {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
