export function useDebounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
): (...args: TArgs) => void {
  let timer: number | null = null

  return (...args: TArgs): void => {
    if (timer !== null) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      callback(...args)
      timer = null
    }, delayMs)
  }
}
