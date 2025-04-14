<template>
  <section class="py-10 bg-gray-100">
    <div
      class="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <!-- Pasar con v-bind todas las propiedades o atributos de objeto "product" al componente ProductCard, el cual se limitará a usar las que necesite.  -->
      <!-- <ProductCard v-for="product in products" :key="product.id" v-bind="product" /> -->
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Product } from '../interfaces/product.interface';
import ProductCard from './ProductCard.vue';

interface Props {
  products: Product[];
}

defineProps<Props>();
</script>
