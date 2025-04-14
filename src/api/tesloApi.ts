import axios from 'axios';

const tesloApi = axios.create({
  baseURL: import.meta.env.VITE_TESLO_API_URL, // import.meta.env es generico o tipo any. VITE_TESLO_API_URL es una variable de entorno que está en el archivo .env.
});

// console.log(import.meta.env);

// TODO: Interceptors

export { tesloApi };
