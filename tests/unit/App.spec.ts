import { createPinia } from 'pinia'
import { render, screen } from '@testing-library/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import DashboardView from '@/modules/dashboard/DashboardView.vue'

describe('App', () => {
  it('renders the configured frontend shell', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: DashboardView }],
    })
    await router.push('/')
    await router.isReady()

    render(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(screen.getByRole('heading', { name: 'Dashboard operativo' })).toBeVisible()
  })
})
