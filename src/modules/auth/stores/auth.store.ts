import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginAction, registerAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', '')); // La variable reactiva token será el valor del item llamado "token" que esta en el local storage. En caso de que no se encuentre, se inicializa dicha variable reactiva como un string vacío y ademas se crea el item "token" en el local storage con el mismo valor de string vacio. Cuando a esa variable reactiva token se le asigne otro valor, el item llamado token en el local storage también tendrá ese otro valor.

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);

      if (!loginResp.ok) {
        logout();
        return false;
      }

      authStatus.value = AuthStatus.Authenticated;
      user.value = loginResp.user;
      token.value = loginResp.token; // Asignacion de valor a la variable reactiva token.

      return true;
    } catch (error) {
      // Error no controlado arrojado desde throw new Error de loginAction
      // console.log(error);
      return logout();
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    // Cuando ya son mas de 3 argumentos, podemos mejor recibir todo mediante un objeto. Eso es lo que nos establece las buenas practicas de clean code.
    try {
      const registerResp = await registerAction(fullName, email, password);

      if (!registerResp.ok) {
        logout();
        return { ok: false, messsage: registerResp.message }; // Esto se hace para poder tener como respuesta el mensaje de error de la accion de registro
      }

      authStatus.value = AuthStatus.Authenticated; // Authenticated porque el registro autentica al usuario regresandonos nuestro token de acceso
      user.value = registerResp.user;
      token.value = registerResp.token; // Asignacion de valor a la variable reactiva token.
      return { ok: true, message: '' };
    } catch (error) {
      return { ok: false, message: 'Error al registrar el usuario' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();

      // Token del usuario no existe o no pasó la validación
      if (!statusResp.ok) {
        logout();
        return false;
      }

      // Token del usuario existe y pasó la validación
      authStatus.value = AuthStatus.Authenticated;
      user.value = statusResp.user;
      token.value = statusResp.token;
      return true;
    } catch (error) {
      // Este error puede ocurrir por ejemplo porque la persona no tiene conexion a Internet lo que haria que deslogearia al usuario. Queda mucho a mi discreción como manejar este error.
      logout();
      return false;
    }
  };

  // Lo del return se comparte al mundo exteerior
  return {
    user,
    token,
    authStatus,

    // Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    isAdmin: computed(() => user.value?.roles.includes('admin') ?? false),

    username: computed(() => user.value?.fullName),

    // Actions
    login,
    register,
    checkAuthStatus,
    logout,
  };
});
