import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse, User } from '../interfaces';
import { isAxiosError } from 'axios';

interface CheckError {
  ok: false;
}

interface CheckSuccess {
  ok: true;
  user: User;
  token: string;
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const localToken = localStorage.getItem('token');
    if (localToken && localToken.length < 10) {
      return { ok: false };
    }

    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');

    return {
      ok: true,
      user: data.user,
      token: data.token, // data.token que es parte de la respuesta de peticion get a /api/auth/check-status, será un nuevo token que ya tendrá una nueva duración de vigencia
    };
  } catch (error) {
    // En caso de que la peticion a /api/auth/check-status falle (como error 401 que es Unathorized), se captura como error en este catch
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      };
    }

    // Error no controlado
    // console.log(error);
    throw new Error('No se pudo verificar la sesión');
  }
};
