import { createRouter, createWebHistory } from 'vue-router';
import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue';
import { authRoutes } from '@/modules/auth/routes';
import { adminRoutes } from '@/modules/admin/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/modules/shop/views/HomeView.vue'), //  Se debe de cargar de manera obligatoria, sin importar si es de manera perezosa o no porque de todas maneras siempre se va a cargar el componente HomeView.
        },
      ],
    },
    // Auth Routes
    authRoutes,

    // Admin Routes
    adminRoutes,
  ],
});

export default router;
