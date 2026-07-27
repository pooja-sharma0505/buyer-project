export function useFormatPrice() {
  return {
    formatPrice(value) {
      const num = Number(value || 0)
      const isWhole = num % 1 === 0
      return '₹' + num.toLocaleString('en-IN', {
        minimumFractionDigits: isWhole ? 0 : 2,
        maximumFractionDigits: 2
      })
    }
  }
}
