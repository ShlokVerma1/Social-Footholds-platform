import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { calculatePriceAmount } from '@/lib/pricingCalc'

export async function POST(request) {
  try {
    const { service_id, details } = await request.json()
    if (!service_id || !details) {
      return NextResponse.json({ error: 'Missing service_id or details' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single()

    if (error) throw error
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    const amount = calculatePriceAmount(service, details)

    return NextResponse.json({ amount, currency: "USD" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
