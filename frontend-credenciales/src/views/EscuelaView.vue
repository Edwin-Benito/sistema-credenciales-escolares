<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-text-dark">Configuración de la Escuela</h1>
    </div>

    <!-- Formulario de datos institucionales -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h2 class="mb-6 text-xl font-semibold text-text-dark">Datos Institucionales</h2>
      
      <div v-if="loading" class="py-8 text-center text-gray-400">
        Cargando información...
      </div>

      <form v-else class="space-y-5" @submit.prevent="guardarCambios">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-300" for="nombre_escuela">
            Nombre de la Escuela <span class="text-red-400">*</span>
          </label>
          <input
            id="nombre_escuela"
            v-model="escuela.nombre_escuela"
            type="text"
            required
            class="form-input h-12 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            placeholder="Nombre completo de la institución"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-300" for="cct">
            CCT (Clave del Centro de Trabajo) <span class="text-red-400">*</span>
          </label>
          <input
            id="cct"
            v-model="escuela.cct"
            type="text"
            required
            class="form-input h-12 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            placeholder="Ej: 12ABC0123D"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-300" for="direccion">
            Dirección
          </label>
          <input
            id="direccion"
            v-model="escuela.direccion"
            type="text"
            class="form-input h-12 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            placeholder="Calle, número, colonia, ciudad"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-300" for="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            v-model="escuela.telefono"
            type="tel"
            class="form-input h-12 rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            placeholder="(555) 123-4567"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-300" for="datos_contacto_reverso">
            Datos de Contacto para Reverso
          </label>
          <textarea
            id="datos_contacto_reverso"
            v-model="escuela.datos_contacto_reverso"
            rows="3"
            class="form-input rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 py-3 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            placeholder="Información que aparecerá en el reverso de las credenciales"
          ></textarea>
          <p class="text-xs text-gray-500">
            Esta información se imprimirá en el reverso de las credenciales escolares
          </p>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
            :disabled="saving"
          >
            <span class="material-symbols-outlined">save</span>
            <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
          </button>
          <button
            type="button"
            class="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-600 px-6 text-sm font-medium text-gray-300 hover:bg-gray-800"
            @click="cargarDatos"
          >
            <span class="material-symbols-outlined">refresh</span>
            <span>Recargar</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Información adicional -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <h3 class="mb-3 text-lg font-semibold text-text-dark">Nota importante</h3>
      <p class="text-sm text-gray-400">
        Los cambios realizados en esta sección afectarán la información que aparece en las credenciales escolares.
        Asegúrate de que todos los datos sean correctos antes de generar nuevas credenciales.
      </p>
    </div>

    <!-- Sección de Backup -->
    <div class="rounded-xl border border-amber-800 bg-amber-950/30 p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-2xl text-amber-400">backup</span>
            <h3 class="text-lg font-semibold text-amber-300">Respaldo de Base de Datos</h3>
          </div>
          <p class="text-sm text-amber-200 mb-4">
            Descarga una copia de seguridad completa de la base de datos. Se recomienda realizar respaldos periódicos para proteger la información.
          </p>
          <button
            @click="descargarBackup"
            :disabled="descargandoBackup"
            class="flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 text-sm font-bold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span class="material-symbols-outlined" :class="{ 'animate-spin': descargandoBackup }">
              {{ descargandoBackup ? 'sync' : 'download' }}
            </span>
            <span>{{ descargandoBackup ? 'Descargando...' : 'Descargar Backup' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../api/axiosConfig'

interface EscuelaInfo {
  id?: number
  nombre_escuela: string
  cct: string
  direccion: string
  telefono: string
  datos_contacto_reverso: string
}

const escuela = ref<EscuelaInfo>({
  nombre_escuela: '',
  cct: '',
  direccion: '',
  telefono: '',
  datos_contacto_reverso: '',
})

const loading = ref(false)
const saving = ref(false)
const descargandoBackup = ref(false)

async function cargarDatos() {
  try {
    loading.value = true
    const { data } = await apiClient.get<EscuelaInfo>('/escuela-info')
    escuela.value = {
      nombre_escuela: data.nombre_escuela || '',
      cct: data.cct || '',
      direccion: data.direccion || '',
      telefono: data.telefono || '',
      datos_contacto_reverso: data.datos_contacto_reverso || '',
    }
  } catch (err: any) {
    console.error('Error al cargar datos:', err)
    alert(err?.response?.data?.message || 'Error al cargar la información de la escuela')
  } finally {
    loading.value = false
  }
}

async function guardarCambios() {
  if (!escuela.value.nombre_escuela.trim() || !escuela.value.cct.trim()) {
    alert('El nombre de la escuela y el CCT son obligatorios')
    return
  }

  try {
    saving.value = true
    await apiClient.put('/escuela-info', escuela.value)
    alert('✅ Información de la escuela actualizada correctamente')
  } catch (err: any) {
    console.error('Error al guardar:', err)
    alert(err?.response?.data?.message || 'Error al guardar los cambios')
  } finally {
    saving.value = false
  }
}

async function descargarBackup() {
  try {
    descargandoBackup.value = true

    const response = await apiClient.get('/backup/db', {
      responseType: 'blob'
    })

    // Crear blob y enlace temporal para descarga
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    
    // Crear enlace temporal y hacer click programáticamente
    const link = document.createElement('a')
    link.href = url
    link.download = `backup-${new Date().toISOString().split('T')[0]}.sqlite`
    document.body.appendChild(link)
    link.click()
    
    // Limpiar
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    alert('✅ Backup descargado exitosamente')
  } catch (err: any) {
    console.error('Error al descargar backup:', err)
    alert(err?.response?.data?.message || 'Error al descargar el backup')
  } finally {
    descargandoBackup.value = false
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
