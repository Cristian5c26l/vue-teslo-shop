<template>
  <!-- Header Navbar -->
  <top-menu />

  <!--HomeView.vue -> Title, Tab Menu and Product List-->
  <router-view />

  <!-- Footer -->
  <custom-footer />
</template>

<script lang="ts" setup>
import CustomFooter from '../components/CustomFooter.vue';
import TopMenu from '../components/TopMenu.vue';
</script>
