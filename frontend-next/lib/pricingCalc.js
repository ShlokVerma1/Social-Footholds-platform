export function calculatePriceAmount(service, details) {
  let amount = 0.0

  if (service.pricing_type === 'per_view') {
    // Video promotion: base_price per 1000 views
    const views = details.views || 0
    amount = (views / 1000) * service.base_price
  } else if (service.pricing_type === 'subscription') {
    // Channel SEO: base_price per month
    const duration = details.duration || 1
    amount = service.base_price * duration
  } else if (service.pricing_type === 'per_project' || service.pricing_type === 'package') {
    // Fixed price services
    const quantity = details.quantity || 1
    amount = service.base_price * quantity
  } else {
    // Default fallback
    amount = service.base_price
  }

  return Number(amount.toFixed(2))
}
