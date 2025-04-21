import axios from 'axios';

const tesloApi = axios.create({
  baseURL: import.meta.env.VITE_TESLO_API_URL, // import.meta.env es generico o tipo any. VITE_TESLO_API_URL es una variable de entorno que está en el archivo .env.
});

// console.log(import.meta.env);

// Cualquier peticion que se haga a http://localhost:3000/api/...., se le va a agregar el header Authorization con el token que se tenga en el local storage. Esto es para que el backend pueda validar que el usuario está autenticado y tiene acceso a esa ruta. En caso de que no haya un token, no se le agrega el header Authorization y la peticion se hace sin el token.
tesloApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Esto es como agregar un header a la peticion. En este caso se agrega el header "Authorization" en el que se le pasa un bearer token
  }

  return config;
});

export { tesloApi };
