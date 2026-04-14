import { NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/supabaseServer'

export async function GET(request) {
  try {
    const { supabase } = await authenticateAdmin()

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      { data: usersData, error: usersError },
      { data: ordersData, error: ordersError },
      { data: enquiriesData, error: enquiriesError },
      { data: recentUsersData, error: recentUsersError },
      { data: paidOrders, error: revenueError },
      { data: recentOrders, error: recentOrdersError }
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).neq('role', 'admin'),
      supabase.from('orders').select('id, created_at'),
      supabase.from('enquiries').select('id', { count: 'exact' }).eq('status', 'new'),
      supabase.from('profiles').select('id').neq('role', 'admin').gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('orders').select('amount, created_at').eq('payment_status', 'paid'),
      supabase.from('orders').select('*, profiles(name, email)').order('created_at', { ascending: false }).limit(5)
    ])

    if (usersError) throw usersError
    if (ordersError) throw ordersError
    if (enquiriesError) throw enquiriesError
    if (recentUsersError) throw recentUsersError
    if (revenueError) throw revenueError
    if (recentOrdersError) throw recentOrdersError

    const total_users = usersData.length
    const total_orders = ordersData.length
    const pending_enquiries = enquiriesData.length
    const recent_registrations = recentUsersData.length
    
    // Revenue
    const total_revenue = paidOrders.reduce((sum, order) => sum + (order.amount || 0), 0)

    // Weekly stats
    const ordersThisWeek = ordersData.filter(o => new Date(o.created_at) >= sevenDaysAgo).length
    const revenueThisWeek = paidOrders
      .filter(o => new Date(o.created_at) >= sevenDaysAgo)
      .reduce((sum, order) => sum + (order.amount || 0), 0)

    return NextResponse.json({
        total_users,
        total_orders,
        pending_enquiries,
        recent_registrations,
        total_revenue: Number(total_revenue.toFixed(2)),
        orders_this_week: ordersThisWeek,
        revenue_this_week: Number(revenueThisWeek.toFixed(2)),
        recent_orders: recentOrders,
    })
  } catch (error) {
    const status = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
