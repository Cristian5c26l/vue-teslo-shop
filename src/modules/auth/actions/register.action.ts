import { tesloApi } from '@/api/tesloApi';
import type { RegisterResponse, User } from '../interfaces';

interface RegisterError {
  ok: false;
  message: string;
}

interface RegisterSuccess {
  ok: true;
  user: User;
  token: string;
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data } = await tesloApi.post<RegisterResponse>('/auth/register', {
      fullName,
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    // El error puede ser que el usuario ya existe o no puede usar ese email
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo crear el usuario',
    };
  }
};
