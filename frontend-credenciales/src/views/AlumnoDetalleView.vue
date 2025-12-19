<template>
  <div class="flex flex-col gap-6">
    <!-- Encabezado con botón de regresar -->
    <div class="flex items-center gap-4">
      <button
        class="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-text-dark hover:bg-gray-800"
        @click="$router.push('/alumnos')"
      >
        <span class="material-symbols-outlined text-base">arrow_back</span>
        <span>Regresar a Alumnos</span>
      </button>
      <h1 class="text-3xl font-bold text-text-dark">Ficha del Alumno</h1>
    </div>

    <div v-if="loading" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-8 text-center text-gray-400">
      Cargando información del alumno...
    </div>

    <div v-else-if="!alumno" class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-8 text-center text-gray-400">
      No se encontró el alumno solicitado
    </div>

    <template v-else>
      <!-- Tarjeta de información principal -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Columna izquierda: Foto -->
        <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
          <h2 class="mb-4 text-xl font-semibold text-text-dark">Fotografía</h2>
          <div class="flex flex-col items-center gap-4">
            <div class="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-900">
              <img
                :src="fotoUrl || '/assets/placeholder-avatar.svg'"
                alt="Foto del alumno"
                class="h-full w-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).src = '/assets/placeholder-avatar.svg'"
              />
            </div>
            
            <div class="w-full">
              <p v-if="!inscripcionActiva" class="mb-2 text-center text-sm text-yellow-400">
                El alumno no tiene inscripción activa. No se puede subir foto.
              </p>
              <p v-else class="mb-2 text-center text-sm text-gray-400">
                Ciclo: {{ inscripcionActiva.ciclo_nombre }} - {{ inscripcionActiva.grado_nombre }} {{ inscripcionActiva.grupo_letra }}
              </p>
              
              <input
                ref="fotoInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="subirFoto"
                :disabled="!inscripcionActiva"
              />
              
              <button
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent/90 disabled:bg-gray-700 disabled:text-gray-500"
                @click="() => fotoInput?.click()"
                :disabled="!inscripcionActiva || uploading"
              >
                <span class="material-symbols-outlined">{{ uploading ? 'sync' : 'upload' }}</span>
                <span>{{ uploading ? 'Subiendo...' : 'Cambiar Fotografía' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Datos personales -->
        <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6 lg:col-span-2">
          <h2 class="mb-4 text-xl font-semibold text-text-dark">Datos Personales</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-gray-400">Matrícula</p>
              <p class="text-base font-semibold text-text-dark">{{ alumno.matricula || 'Sin matrícula' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-400">Estatus</p>
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
            </div>
            <div class="sm:col-span-2">
              <p class="text-sm font-medium text-gray-400">Nombre Completo</p>
              <p class="text-lg font-semibold text-text-dark">
                {{ alumno.nombres }} {{ alumno.apellido_paterno }} {{ alumno.apellido_materno }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-400">CURP</p>
              <p class="font-mono text-base text-text-dark">{{ alumno.curp || 'No registrado' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-400">Fecha de Nacimiento</p>
              <p class="text-base text-text-dark">{{ formatearFecha(alumno.fecha_nacimiento) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de Inscripciones -->
      <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-text-dark">Historial de Inscripciones</h2>
          <button
            @click="mostrarFormInscripcion = !mostrarFormInscripcion"
            class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
          >
            <span class="material-symbols-outlined text-base">{{ mostrarFormInscripcion ? 'close' : 'add' }}</span>
            <span>{{ mostrarFormInscripcion ? 'Cancelar' : 'Nueva Inscripción' }}</span>
          </button>
        </div>

        <!-- Formulario de nueva inscripción -->
        <div v-if="mostrarFormInscripcion" class="mb-6 rounded-lg border border-blue-700 bg-blue-900/20 p-4">
          <h3 class="mb-3 text-sm font-semibold text-blue-300">Inscribir en nuevo ciclo/grupo</h3>
          <div class="grid gap-4 md:grid-cols-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-300">
                Ciclo Escolar <span class="text-red-400">*</span>
              </label>
              <select
                v-model="nuevaInscripcion.cicloId"
                class="form-select h-10 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-3 text-sm text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              >
                <option :value="0" disabled>Selecciona ciclo</option>
                <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
                  {{ ciclo.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-gray-300">
                Grado <span class="text-red-400">*</span>
              </label>
              <select
                v-model="nuevaInscripcion.gradoId"
                @change="cargarGruposParaInscripcion"
                class="form-select h-10 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-3 text-sm text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              >
                <option :value="0" disabled>Selecciona grado</option>
                <option v-for="grado in grados" :key="grado.id" :value="grado.id">
                  {{ grado.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-gray-300">
                Grupo <span class="text-red-400">*</span>
              </label>
              <select
                v-model="nuevaInscripcion.grupoId"
                :disabled="!nuevaInscripcion.gradoId || nuevaInscripcion.gradoId === 0"
                class="form-select h-10 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-3 text-sm text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option :value="0" disabled>Selecciona grupo</option>
                <option v-for="grupo in gruposFiltradosInscripcion" :key="grupo.id" :value="grupo.id">
                  {{ grupo.letra }}
                </option>
              </select>
            </div>

            <div class="flex items-end">
              <button
                @click="crearInscripcion"
                :disabled="!nuevaInscripcion.cicloId || !nuevaInscripcion.grupoId || inscribiendo"
                class="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
              >
                <span class="material-symbols-outlined text-base" :class="{ 'animate-spin': inscribiendo }">
                  {{ inscribiendo ? 'sync' : 'check' }}
                </span>
                <span>{{ inscribiendo ? 'Inscribiendo...' : 'Inscribir' }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="inscripciones.length === 0" class="py-8 text-center text-gray-400">
          El alumno no tiene inscripciones registradas
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-800 text-left">
                <th class="pb-3 text-sm font-semibold text-gray-300">Ciclo Escolar</th>
                <th class="pb-3 text-sm font-semibold text-gray-300">Grado</th>
                <th class="pb-3 text-sm font-semibold text-gray-300">Grupo</th>
                <th class="pb-3 text-sm font-semibold text-gray-300">Fotografía</th>
                <th class="pb-3 text-sm font-semibold text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="inscripcion in inscripciones"
                :key="inscripcion.id"
                class="border-b border-gray-800 last:border-0"
              >
                <td class="py-4 text-text-dark">{{ inscripcion.ciclo_nombre }}</td>
                <td class="py-4 text-text-dark">{{ inscripcion.grado_nombre }}</td>
                <td class="py-4 text-text-dark">{{ inscripcion.grupo_letra }}</td>
                <td class="py-4">
                  <span v-if="inscripcion.path_foto" class="flex items-center gap-2 text-green-400">
                    <span class="material-symbols-outlined text-base">check_circle</span>
                    <span class="text-sm">Registrada</span>
                  </span>
                  <span v-else class="flex items-center gap-2 text-gray-500">
                    <span class="material-symbols-outlined text-base">cancel</span>
                    <span class="text-sm">Sin foto</span>
                  </span>
                </td>
                <td class="py-4">
                  <button
                    @click="confirmarBajaInscripcion(inscripcion)"
                    :disabled="eliminandoInscripcion === inscripcion.id"
                    class="flex items-center gap-1 rounded-lg border border-red-600 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-50"
                  >
                    <span class="material-symbols-outlined text-base" :class="{ 'animate-spin': eliminandoInscripcion === inscripcion.id }">
                      {{ eliminandoInscripcion === inscripcion.id ? 'sync' : 'delete' }}
                    </span>
                    <span>{{ eliminandoInscripcion === inscripcion.id ? 'Eliminando...' : 'Dar de Baja' }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '../api/axiosConfig'

interface Alumno {
  id: number
  matricula: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  curp: string | null
  fecha_nacimiento: string | null
  estatus_general: string
}

interface Inscripcion {
  id: number
  alumno_id: number
  ciclo_escolar_id: number
  grado_id: number
  grupo_id: number
  path_foto: string | null
  ciclo_nombre: string
  grupo_letra: string
  grado_nombre: string
}

interface Ciclo {
  id: number
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  activo: boolean
}

interface Grado {
  id: number
  nombre: string
  escuela_id: number
}

interface Grupo {
  id: number
  letra: string
  grado_id: number
}

const route = useRoute()
const alumno = ref<Alumno | null>(null)
const inscripciones = ref<Inscripcion[]>([])
const loading = ref(false)
const uploading = ref(false)
const fotoInput = ref<HTMLInputElement | null>(null)

// Estados para nueva inscripción
const mostrarFormInscripcion = ref(false)
const ciclos = ref<Ciclo[]>([])
const grados = ref<Grado[]>([])
const grupos = ref<Grupo[]>([])
const nuevaInscripcion = ref({
  cicloId: 0,
  gradoId: 0,
  grupoId: 0
})
const inscribiendo = ref(false)

// Estados para eliminación
const eliminandoInscripcion = ref<number | null>(null)

const gruposFiltradosInscripcion = computed(() => {
  if (!nuevaInscripcion.value.gradoId) return []
  return grupos.value.filter(g => g.grado_id === nuevaInscripcion.value.gradoId)
})

const inscripcionActiva = computed(() => {
  // La primera inscripción del array es la más reciente (ORDER BY DESC en el backend)
  return inscripciones.value.length > 0 ? inscripciones.value[0] : null
})

const fotoUrl = computed(() => {
  if (inscripcionActiva.value?.path_foto) {
    return `http://localhost:3000/${inscripcionActiva.value.path_foto}`
  }
  return null
})

async function cargarDatos() {
  const id = route.params.id as string
  
  try {
    loading.value = true
    
    // Cargar datos del alumno
    const { data: alumnoData } = await apiClient.get<Alumno>(`/alumnos/${id}`)
    alumno.value = alumnoData
    
    // Cargar historial de inscripciones
    const { data: inscripcionesData } = await apiClient.get<Inscripcion[]>(`/alumnos/${id}/inscripciones`)
    inscripciones.value = inscripcionesData
  } catch (err: any) {
    console.error('Error al cargar datos del alumno:', err)
    if (err?.response?.status === 404) {
      alumno.value = null
    } else {
      alert(err?.response?.data?.message || 'Error al cargar los datos del alumno')
    }
  } finally {
    loading.value = false
  }
}

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
  } catch (err: any) {
    console.error('Error al cargar catálogos:', err)
  }
}

function cargarGruposParaInscripcion() {
  nuevaInscripcion.value.grupoId = 0
}

async function crearInscripcion() {
  if (!alumno.value?.id) return
  
  if (!nuevaInscripcion.value.cicloId || !nuevaInscripcion.value.grupoId) {
    alert('Debes seleccionar ciclo escolar y grupo')
    return
  }
  
  try {
    inscribiendo.value = true
    
    await apiClient.post('/inscripciones', {
      alumno_id: alumno.value.id,
      ciclo_escolar_id: nuevaInscripcion.value.cicloId,
      grupo_id: nuevaInscripcion.value.grupoId
    })
    
    // Limpiar formulario
    nuevaInscripcion.value = { cicloId: 0, gradoId: 0, grupoId: 0 }
    mostrarFormInscripcion.value = false
    
    // Recargar inscripciones
    await cargarDatos()
    
    alert('✅ Inscripción creada exitosamente')
  } catch (err: any) {
    console.error('Error al crear inscripción:', err)
    
    if (err?.response?.status === 409) {
      alert('El alumno ya está inscrito en este grupo y ciclo')
    } else {
      alert(err?.response?.data?.message || 'Error al crear la inscripción')
    }
  } finally {
    inscribiendo.value = false
  }
}

async function confirmarBajaInscripcion(inscripcion: Inscripcion) {
  if (inscripcion.path_foto) {
    const confirmar = confirm(
      `⚠️ Esta inscripción tiene una fotografía registrada.\n\n` +
      `Ciclo: ${inscripcion.ciclo_nombre}\n` +
      `Grado: ${inscripcion.grado_nombre}\n` +
      `Grupo: ${inscripcion.grupo_letra}\n\n` +
      `Si continúas, se eliminará la fotografía también.\n\n` +
      `¿Estás seguro de dar de baja esta inscripción?`
    )
    
    if (!confirmar) return
  } else {
    const confirmar = confirm(
      `¿Estás seguro de dar de baja esta inscripción?\n\n` +
      `Ciclo: ${inscripcion.ciclo_nombre}\n` +
      `Grado: ${inscripcion.grado_nombre}\n` +
      `Grupo: ${inscripcion.grupo_letra}`
    )
    
    if (!confirmar) return
  }
  
  await eliminarInscripcion(inscripcion.id)
}

async function eliminarInscripcion(inscripcionId: number) {
  try {
    eliminandoInscripcion.value = inscripcionId
    
    await apiClient.delete(`/inscripciones/${inscripcionId}`)
    
    // Recargar inscripciones
    await cargarDatos()
    
    alert('✅ Inscripción eliminada exitosamente')
  } catch (err: any) {
    console.error('Error al eliminar inscripción:', err)
    alert(err?.response?.data?.message || 'Error al eliminar la inscripción')
  } finally {
    eliminandoInscripcion.value = null
  }
}

async function subirFoto(event: Event) {
  const input = event.target as HTMLInputElement
  const archivo = input.files?.[0]
  
  if (!archivo) return
  
  if (!inscripcionActiva.value) {
    alert('El alumno no tiene inscripción activa')
    return
  }
  
  try {
    uploading.value = true
    
    const formData = new FormData()
    formData.append('foto', archivo)
    
    await apiClient.post(`/inscripciones/${inscripcionActiva.value.id}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Recargar datos para ver la foto nueva
    await cargarDatos()
    
    // Limpiar el input
    if (fotoInput.value) {
      fotoInput.value.value = ''
    }
  } catch (err: any) {
    console.error('Error al subir foto:', err)
    alert(err?.response?.data?.message || 'Error al subir la fotografía')
  } finally {
    uploading.value = false
  }
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return 'No registrada'
  
  try {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return fecha
  }
}

onMounted(() => {
  cargarDatos()
  cargarCatalogos()
})
</script>

<style scoped>
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
