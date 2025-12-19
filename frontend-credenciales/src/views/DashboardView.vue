<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <h1 class="text-4xl font-black tracking-[-0.033em] text-text-dark">
        ¡Bienvenida, {{ displayName }}!
      </h1>
      <router-link
        to="/alumnos/nuevo"
        class="flex min-w-40 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
      >
        <span class="material-symbols-outlined">add</span>
        <span class="truncate">Add New Student</span>
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        class="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 bg-[#1e1e1e] border border-gray-800"
      >
        <div class="flex justify-between items-center">
          <p class="text-base font-medium text-text-dark">Total de Alumnos</p>
          <span class="material-symbols-outlined text-primary text-2xl"
            >school</span
          >
        </div>
        <p class="text-3xl font-bold tracking-tight text-text-dark">{{ stats.totalAlumnos }}</p>
      </div>

      <div
        class="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 bg-[#1e1e1e] border border-gray-800"
      >
        <div class="flex justify-between items-center">
          <p class="text-base font-medium text-text-dark">Grupos Activos</p>
          <span class="material-symbols-outlined text-primary text-2xl"
            >groups</span
          >
        </div>
        <p class="text-3xl font-bold tracking-tight text-text-dark">{{ stats.gruposActivos }}</p>
      </div>

      <div
        class="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 bg-[#1e1e1e] border border-accent"
      >
        <div class="flex justify-between items-center">
          <p class="text-base font-medium text-text-dark">Alumnos sin Foto</p>
          <span class="material-symbols-outlined text-accent text-2xl"
            >no_photography</span
          >
        </div>
        <p class="text-3xl font-bold tracking-tight text-accent">{{ stats.alumnosSinFoto }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 flex flex-col gap-4">
        <h2 class="text-xl font-bold tracking-[-0.015em] text-text-dark">
          Anuncios Importantes
        </h2>
        <div
          class="flex flex-col gap-4 rounded-xl p-6 bg-[#1e1e1e] border border-gray-800"
        >
          <div class="flex flex-col gap-4 divide-y divide-gray-800">
            <div class="flex items-start gap-4 pt-4 first:pt-0">
              <div
                class="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary"
              >
                <span class="material-symbols-outlined">campaign</span>
              </div>
              <div class="flex flex-col">
                <p class="font-medium text-text-dark">
                  Actualización del sistema programada
                </p>
                <p class="text-sm text-gray-400">
                  El sistema estará en mantenimiento el Sábado a las 10 PM. El
                  servicio se reanudará a las 11 PM.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 pt-4 first:pt-0">
              <div
                class="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary"
              >
                <span class="material-symbols-outlined">event</span>
              </div>
              <div class="flex flex-col">
                <p class="font-medium text-text-dark">
                  Reunión de Consejo Técnico Escolar
                </p>
                <p class="text-sm text-gray-400">
                  Recordatorio: La próxima reunión de CTE será este Viernes a
                  las 8:00 AM en la sala de juntas.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 pt-4 first:pt-0">
              <div
                class="flex size-10 items-center justify-center rounded-full bg-accent/20 text-accent"
              >
                <span class="material-symbols-outlined"
                  >notification_important</span
                >
              </div>
              <div class="flex flex-col">
                <p class="font-medium text-text-dark">
                  Fecha límite para subir calificaciones
                </p>
                <p class="text-sm text-gray-400">
                  La fecha límite para el registro de calificaciones del segundo
                  parcial es el próximo Lunes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-bold tracking-[-0.015em] text-text-dark">
          Acciones Rápidas
        </h2>
        <div
          class="flex flex-col gap-3 rounded-xl p-6 bg-[#1e1e1e] border border-gray-800"
        >
          <router-link class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90" to="/grupos"
          >
            <span class="material-symbols-outlined">group_add</span>
            <span>Crear Grupo</span>
          </router-link>

          <router-link
            to="/cambiar-grupo"
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20"
          >
            <span class="material-symbols-outlined">swap_horiz</span>
            <span>Cambiar Grupo</span>
          </router-link>
          <router-link
            to="/credenciales"
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-text-dark hover:bg-gray-800"
          >
            <span class="material-symbols-outlined">badge</span>
            <span>Generar Credenciales</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import apiClient from "../api/axiosConfig";

const auth = useAuthStore();
const displayName = computed(
  () => auth.user?.name || auth.user?.username || "........"
);

const stats = reactive({
  totalAlumnos: 0,
  gruposActivos: 0,
  alumnosSinFoto: 0
});

async function cargarEstadisticas() {
  try {
    const [alumnosRes, gruposRes] = await Promise.all([
      apiClient.get('/alumnos'),
      apiClient.get('/grupos')
    ]);

    stats.totalAlumnos = alumnosRes.data.length;
    stats.gruposActivos = gruposRes.data.length;

    // Contar alumnos sin foto (inscripciones sin path_foto)
    const alumnosConInscripciones = alumnosRes.data.filter((a: any) => 
      a.inscripciones && a.inscripciones.length > 0
    );
    stats.alumnosSinFoto = alumnosConInscripciones.filter((a: any) => 
      !a.inscripciones[0]?.path_foto
    ).length;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

onMounted(cargarEstadisticas);
</script>
