<template>
  <div class="flex flex-col gap-6">
    <!-- Encabezado -->
    <div class="flex items-center gap-4">
      <button
        class="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-text-dark hover:bg-gray-800"
        @click="$router.push('/alumnos')"
      >
        <span class="material-symbols-outlined text-base">arrow_back</span>
        <span>Regresar a Alumnos</span>
      </button>
      <h1 class="text-3xl font-bold text-text-dark">Nuevo Alumno</h1>
    </div>

    <!-- Formulario -->
    <div class="rounded-xl border border-gray-800 bg-[#1e1e1e] p-6">
      <form @submit.prevent="crearAlumno" class="flex flex-col gap-6">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Matrícula -->
          <div>
            <label
              for="matricula"
              class="mb-2 block text-sm font-medium text-gray-300"
            >
              Matrícula
            </label>
            <input
              id="matricula"
              v-model="form.matricula"
              type="text"
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: 2024001"
            />
          </div>

          <!-- CURP -->
          <div>
            <label
              for="curp"
              class="mb-2 block text-sm font-medium text-gray-300"
            >
              CURP <span class="text-red-400">*</span>
            </label>
            <input
              id="curp"
              v-model="form.curp"
              type="text"
              required
              maxlength="18"
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 font-mono text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              placeholder="AAAA000000HDFRRR00"
            />
          </div>

          <!-- Nombres -->
          <div>
            <label
              for="nombres"
              class="mb-2 block text-sm font-medium text-gray-300"
            >
              Nombre(s) <span class="text-red-400">*</span>
            </label>
            <input
              id="nombres"
              v-model="form.nombres"
              type="text"
              required
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <!-- Apellido Paterno -->
          <div>
            <label
              for="apellido_paterno"
              class="mb-2 block text-sm font-medium text-gray-300"
            >
              Apellido Paterno <span class="text-red-400">*</span>
            </label>
            <input
              id="apellido_paterno"
              v-model="form.apellido_paterno"
              type="text"
              required
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: García"
            />
          </div>

          <!-- Apellido Materno -->
          <div>
            <label
              for="apellido_materno"
              class="mb-2 block text-sm font-medium text-gray-300"
            >
              Apellido Materno
            </label>
            <input
              id="apellido_materno"
              v-model="form.apellido_materno"
              type="text"
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: López"
            />
          </div>

          <!-- Fecha de Nacimiento -->
          <div>
            <label
              for="fecha_nacimiento"
              class="mb-2 block text-sm font-medium text-gray-300"
            >
              Fecha de Nacimiento <span class="text-red-400">*</span>
            </label>
            <input
              id="fecha_nacimiento"
              v-model="form.fecha_nacimiento"
              type="date"
              required
              class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Datos de Emergencia -->
        <div class="border-t border-gray-700 pt-6">
          <h3 class="mb-4 text-lg font-semibold text-text-dark">
            Datos de Emergencia
          </h3>
          <p class="mb-4 text-sm text-gray-400">
            Información que aparecerá en el reverso de la credencial
          </p>

          <div class="grid gap-6 md:grid-cols-2">
            <!-- Tutor -->
            <div>
              <label
                for="tutor"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Nombre del Tutor
              </label>
              <input
                id="tutor"
                v-model="form.tutor"
                type="text"
                class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: María López García"
              />
            </div>

            <!-- Tipo de Sangre -->
            <div>
              <label
                for="tipo_sangre"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Tipo de Sangre
              </label>
              <select
                id="tipo_sangre"
                v-model="form.tipo_sangre"
                class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Selecciona tipo</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <!-- Teléfono 1 -->
            <div>
              <label
                for="telefono1"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Teléfono 1
              </label>
              <input
                id="telefono1"
                v-model="form.telefono1"
                type="tel"
                class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: 771-123-4567"
              />
            </div>

            <!-- Teléfono 2 -->
            <div>
              <label
                for="telefono2"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Teléfono 2
              </label>
              <input
                id="telefono2"
                v-model="form.telefono2"
                type="tel"
                class="form-input h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: 771-987-6543"
              />
            </div>

            <!-- Domicilio -->
            <div class="md:col-span-2">
              <label
                for="domicilio"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Domicilio
              </label>
              <textarea
                id="domicilio"
                v-model="form.domicilio"
                rows="2"
                class="form-input w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 py-3 text-base text-gray-100 placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: Calle Principal #123, Col. Centro, Cd. Sahagún"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Inscripción Inicial (Opcional) -->
        <div class="border-t border-gray-700 pt-6">
          <h3 class="mb-4 text-lg font-semibold text-text-dark">
            Inscripción Inicial (Opcional)
          </h3>
          <p class="mb-4 text-sm text-gray-400">
            Si deseas inscribir al alumno inmediatamente, selecciona el ciclo, grado y grupo.
            También puedes inscribirlo después desde "Cambiar Grupo".
          </p>

          <div class="grid gap-6 md:grid-cols-3">
            <!-- Ciclo Escolar -->
            <div>
              <label
                for="ciclo"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Ciclo Escolar
              </label>
              <select
                id="ciclo"
                v-model="inscripcion.ciclo_id"
                class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
              >
                <option :value="0">No inscribir ahora</option>
                <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
                  {{ ciclo.nombre }} {{ ciclo.estatus === 'activo' ? '(Activo)' : '' }}
                </option>
              </select>
            </div>

            <!-- Grado -->
            <div>
              <label
                for="grado"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Grado
              </label>
              <select
                id="grado"
                v-model="inscripcion.grado_id"
                @change="cargarGrupos"
                :disabled="!inscripcion.ciclo_id || inscripcion.ciclo_id === 0"
                class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option :value="0">Selecciona un grado</option>
                <option v-for="grado in grados" :key="grado.id" :value="grado.id">
                  {{ grado.nombre }}
                </option>
              </select>
            </div>

            <!-- Grupo -->
            <div>
              <label
                for="grupo"
                class="mb-2 block text-sm font-medium text-gray-300"
              >
                Grupo
              </label>
              <select
                id="grupo"
                v-model="inscripcion.grupo_id"
                :disabled="!inscripcion.grado_id || inscripcion.grado_id === 0"
                class="form-select h-12 w-full rounded-lg border border-gray-700 bg-[#2b2b2b] px-4 text-base text-gray-100 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option :value="0">Selecciona un grupo</option>
                <option v-for="grupo in gruposFiltrados" :key="grupo.id" :value="grupo.id">
                  {{ grupo.letra }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div
          v-if="error"
          class="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {{ error }}
        </div>

        <!-- Botones -->
        <div class="flex gap-4 pt-2">
          <button
            type="submit"
            class="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:bg-gray-700 disabled:text-gray-500"
            :disabled="submitting"
          >
            <span class="material-symbols-outlined">{{
              submitting ? "sync" : "save"
            }}</span>
            <span>{{ submitting ? "Guardando..." : "Guardar Alumno" }}</span>
          </button>
          <button
            type="button"
            class="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 text-sm font-medium text-text-dark hover:bg-gray-800"
            @click="$router.push('/alumnos')"
            :disabled="submitting"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../api/axiosConfig";

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

const router = useRouter();

const form = ref({
  matricula: "",
  nombres: "",
  apellido_paterno: "",
  apellido_materno: "",
  curp: "",
  fecha_nacimiento: "",
  tutor: "",
  telefono1: "",
  telefono2: "",
  tipo_sangre: "",
  domicilio: "",
});

const inscripcion = ref({
  ciclo_id: 0,
  grado_id: 0,
  grupo_id: 0
});

const ciclos = ref<Ciclo[]>([])
const grados = ref<Grado[]>([])
const grupos = ref<Grupo[]>([])

const gruposFiltrados = computed(() => {
  if (inscripcion.value.grado_id === 0) return []
  return grupos.value.filter(g => g.grado_id === inscripcion.value.grado_id)
})

const error = ref("");
const submitting = ref(false);

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
      inscripcion.value.ciclo_id = cicloActivo.id
    }
  } catch (err) {
    console.error('Error al cargar catálogos:', err)
  }
}

function cargarGrupos() {
  inscripcion.value.grupo_id = 0
}

async function crearAlumno() {
  error.value = "";

  if (!form.value.nombres || !form.value.apellido_paterno || !form.value.curp || !form.value.fecha_nacimiento) {
    error.value = "Nombre, apellido paterno, CURP y fecha de nacimiento son requeridos";
    return;
  }

  // Validar inscripción si está parcialmente llena
  if (inscripcion.value.ciclo_id !== 0 || inscripcion.value.grado_id !== 0 || inscripcion.value.grupo_id !== 0) {
    if (!inscripcion.value.ciclo_id || !inscripcion.value.grupo_id) {
      error.value = "Para inscribir al alumno, debes seleccionar ciclo, grado y grupo";
      return;
    }
  }

  try {
    submitting.value = true;

    const payload = {
      matricula: form.value.matricula.trim() || undefined,
      nombres: form.value.nombres.trim(),
      apellido_paterno: form.value.apellido_paterno.trim(),
      apellido_materno: form.value.apellido_materno.trim() || undefined,
      curp: form.value.curp.trim().toUpperCase(),
      fecha_nacimiento: form.value.fecha_nacimiento,
      tutor: form.value.tutor.trim() || undefined,
      telefono1: form.value.telefono1.trim() || undefined,
      telefono2: form.value.telefono2.trim() || undefined,
      tipo_sangre: form.value.tipo_sangre || undefined,
      domicilio: form.value.domicilio.trim() || undefined,
    };

    const { data } = await apiClient.post("/alumnos", payload);

    // Si se seleccionó inscripción, crearla
    if (inscripcion.value.ciclo_id && inscripcion.value.grupo_id) {
      await apiClient.post('/inscripciones', {
        alumno_id: data.id,
        ciclo_escolar_id: inscripcion.value.ciclo_id,
        grupo_id: inscripcion.value.grupo_id
      });
    }

    // Navegar al detalle del alumno recién creado
    router.push(`/alumnos/${data.id}`);
  } catch (err: any) {
    console.error("Error al crear alumno:", err);
    error.value = err?.response?.data?.message || "Error al crear el alumno";
  } finally {
    submitting.value = false;
  }
}

onMounted(cargarCatalogos)
</script>

<style scoped>
.form-input, .form-select {
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
