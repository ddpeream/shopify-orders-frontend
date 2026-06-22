import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardView from '@/modules/dashboard/DashboardView.vue'
import InventoryView from '@/modules/inventory/InventoryView.vue'
import OrderDetailView from '@/modules/orders/OrderDetailView.vue'
import OrdersView from '@/modules/orders/OrdersView.vue'
import NotFoundView from '@/shared/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersView,
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: OrderDetailView,
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: InventoryView,
        },
        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: NotFoundView,
        },
      ],
    },
  ],
})

export default router
