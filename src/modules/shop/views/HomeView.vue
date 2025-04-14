<template>
  <!-- Title -->
  <div class="pt-32 bg-white">
    <h1 class="text-center text-2xl font-bold text-gray-800">All Products</h1>
  </div>

  <!-- Tab Menu -->
  <div
    class="flex flex-wrap items-center overflow-x-auto overflow-y-hidden py-10 justify-center bg-white text-gray-800"
  >
    <a
      rel="noopener noreferrer"
      href="#"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2text-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4 h-4"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Architecto</span>
    </a>
    <a
      rel="noopener noreferrer"
      href="#"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2 rounded-t-lg text-gray-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4 h-4"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
      <span>Corrupti</span>
    </a>
    <a
      rel="noopener noreferrer"
      href="#"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2 text-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4 h-4"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        ></polygon>
      </svg>
      <span>Excepturi</span>
    </a>
    <a
      rel="noopener noreferrer"
      href="#"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2 text-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4 h-4"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
      <span>Consectetur</span>
    </a>
  </div>

  <!-- Product List -->
  <div v-if="!products" class="text-center h-[500px]">
    <h1 class="text-xl">Cargando productos</h1>
    <p>Espere por favor</p>
  </div>
  <ProductList v-else :products="products" />

  <ButtonPagination :has-more-data="!!products && products.length < 10" :page="page" />
</template>

<script lang="ts" setup>
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
import { getProductsAction } from '@/modules/products/actions';
import ProductList from '@/modules/products/components/ProductList.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // Tomamos toda la ruta actual (que puede ser /?page=1)
const page = ref(Number(route.query.page || 1)); // En caso de que la ruta actual sea /, page tendrá el valor de 1. Si es /?page=2, page tendró el valor de 2
const queryClient = useQueryClient(); // queryClient contiene el historial o store de las peticiones, asi como sus respuestas, que se han realizado (literalmente es lo que se ve en las DevTools (playa))

// console.log({ page });

const { data: products = [] } = useQuery({
  // products y isLoading son variables reactivas
  queryKey: ['products', { page: page }], // la petición que se hace a localhost:3000/api/products mediante getProductsActions, se identifica como ['products', { page: 1 }]. Con useQuery se puede identificar la petición y el estado de la misma. isLoading es proveido por useQuery con el proposito de indicar si la petición se esta realizando o no. data sería la respuesta de la petición.
  queryFn: () => getProductsAction(page.value),
  // staleTime: 1000 * 60,// durante 60 segundos o durante todo ese minuto, cualquier petición que se vuelva a hacer al queryKey "products" {page: 1}, va a regresar la misma información de caché sin tener que llegar a la web porque se puede entender que la información es muy nueva o fresca
});

watch(
  () => route.query.page,
  (newPage) => {
    //Cuando se tiene /?page=1 por ejemplo y luego se cambia a /?page=2 mediante por ejemplo $router.push(query: {page: ...}) en ButtonNavigation, cambiará el valor de route.query.page, lo cual será detectado por el watch para que después actualice el valor de la variable reactiva "page" por ese nuevo valor de route.query.page. Lo que sucede después será que useQuery detectará variable reactiva page cambió su valor y lo detecta porque internamente la usa la funcion getProductsAction donde esta ultima se va a volver a ejecutar debido a que dicha variable reactiva page cambió su valor. Sabemos que tras ejecutar getProductsAction, la variable reactiva products se va a actualizar, provocando así la renderización del componente.
    page.value = Number(newPage || 1);

    // Scroll to top when query page changes
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuando se usa smooth como behaivor, el scroll se va a hacer de forma lenta, no de golpe.
  },
);

watchEffect(() => {
  // Clave: Cuando page cambia, se ejecuta todo este callback o funcion de flecha.
  // Este watchEffect se encarga de detectar si la variable reactiva page cambia. En este caso, cuando "page" cambia, se va a hacer un prefetch de la siguiente página que se va a cargar, de modo que se agregue al store de peticiones una nueva petición identificada como ['products', { page: page.value + 1 }]. Esto es útil para que cuando el usuario haga click en el botón de siguiente, la información ya esté en caché y no tenga que esperar a que se cargue la información simulando así una carga más rápida.
  queryClient.prefetchQuery({
    queryKey: ['products', { page: page.value + 1 }],
    queryFn: () => getProductsAction(page.value + 1),
  });
});
</script>
