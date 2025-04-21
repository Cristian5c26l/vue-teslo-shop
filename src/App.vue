<template>
  <FullScreenLoader v-if="authStore.isChecking" />
  <RouterView v-else />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { AuthStatus } from './modules/auth/interfaces';
import { useRoute, useRouter } from 'vue-router';
import FullScreenLoader from './modules/common/components/FullScreenLoader.vue';

// Subscribirnos al store
const authStore = useAuthStore();

const router = useRouter(); // router es el enrutador de la app. Permite hacer navegacion, historial y todo lo demás
const route = useRoute(); // route es Informacion de la ruta actual

authStore.$subscribe(
  (_, state) => {
    // "_" es la mutacion (mutation)
    //console.log({ mutation, state }); // Este console log se imprime cuando se produce un cambio en el state del store cuyo id es "auth" (el cual es useAuthStore). mutation contiene el id del store y state contiene el nuevo state del store

    // console.log({ authStatus: state.authStatus });
    // Checamos que estemos en el punto inicial de la app, que es que "authStatus" del state del store "useAuthStore" sea "Checking" para después validar el token (localizado en el local storage y cargado en "token" del state del store "auth") de autenticacion mediante checkAuthStatus (accion del store "auth"). En caso de que sea valido, evidentemente authStatus cambiará a ser "Authenticated":
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus(); // Llamamos a la funcion checkAuthStatus del store para que verifique el estado de autenticacion
      return;
    }

    // Si la persona está en una ruta referente a la autenticacion (auth) como login o register y su estado de autenticacion es Authenticated, redireccionarlo a la ruta llamada "home" (que esta en el router principal src/router/index.ts) sin que tenga la posibilidad de regresar (replace) a la ruta anterior que en este caso sería /auth/login o /auth/register
    if (route.path.includes('auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'home' });
      return;
    }
  },
  { immediate: true },
); // immediate: true para que se ejecute inmediatamente al cargar la app
</script>
