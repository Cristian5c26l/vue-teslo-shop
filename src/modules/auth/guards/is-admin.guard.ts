import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  // console.log(to); // Muestra la ruta a la que se quiere acceder

  const authStore = useAuthStore();

  await authStore.checkAuthStatus(); // Cambia el authStatus a AuthStatus.Authenticated o AuthStatus.Unauthenticated dependiendo de la respuesta de la peticion a /api/auth/check-status la cual valida el token que se encuentra en el local storage

  if (authStore.isAdmin) {
    next();
  } else {
    next({ name: 'home' });
  }
};

export default isAdminGuard;
