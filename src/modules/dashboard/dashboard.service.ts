import { apiClient } from '@/shared/api/api-client'
import { isDashboardSummary } from '@/shared/types/type-guards'

import type { DashboardSummary } from './dashboard.types'

export interface DashboardServiceOptions {
  signal?: AbortSignal
}

export async function getDashboardSummary(
  options: DashboardServiceOptions = {},
): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>({
    path: '/dashboard/summary',
    signal: options.signal,
    validate: isDashboardSummary,
  })
}
