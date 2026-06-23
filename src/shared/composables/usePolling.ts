interface PollingOptions {
  intervalMs: number
  callback: () => void | Promise<void>
}

export function usePolling(options: PollingOptions) {
  let pollingTimer: number | null = null
  let isRunning = false
  let isExecuting = false

  function canRun(): boolean {
    if (!isRunning) return false
    if (isExecuting) return false
    if (document.visibilityState === 'hidden') return false

    return true
  }

  async function execute(): Promise<void> {
    if (!canRun()) return

    isExecuting = true

    try {
      await options.callback()
    } finally {
      isExecuting = false
    }
  }

  function start(): void {
    if (isRunning) return

    isRunning = true

    pollingTimer = window.setInterval(() => {
      void execute()
    }, options.intervalMs)

    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  function stop(): void {
    isRunning = false

    if (pollingTimer !== null) {
      window.clearInterval(pollingTimer)
      pollingTimer = null
    }

    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  function handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      void execute()
    }
  }

  return {
    start,
    stop,
    execute,
  }
}
