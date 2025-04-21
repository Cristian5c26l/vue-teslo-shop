import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isNotAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  // console.log(to); // Muestra la ruta a la que se quiere acceder

  const authStore = useAuthStore();

  await authStore.checkAuthStatus(); // Cambia el authStatus a AuthStatus.Authenticated o AuthStatus.Unauthenticated dependiendo de la respuesta de la peticion a /api/auth/check-status la cual valida el token que se encuentra en el local storage

  if (authStore.authStatus === AuthStatus.Authenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
};

export default isNotAuthenticatedGuard;
