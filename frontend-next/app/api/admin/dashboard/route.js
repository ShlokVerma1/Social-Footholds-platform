import { NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/supabaseServer'

export async function GET(request) {
  try {
    const { supabase } = await authenticateAdmin()

    // Get stats
    const { data: usersData, error: usersError } = await supabase.from('profiles').select('id', { count: 'exact' }).neq('role', 'admin')
    if (usersError) throw usersError
    const total_users = usersData.length

    const { data: ordersData, error: ordersError } = await supabase.from('orders').select('id, created_at')
    if (ordersError) throw ordersError
    const total_orders = ordersData.length

    const { data: enquiriesData, error: enquiriesError } = await supabase.from('enquiries').select('id', { count: 'exact' }).eq('status', 'new')
    if (enquiriesError) throw enquiriesError
    const pending_enquiries = enquiriesData.length

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: recentUsersData, error: recentUsersError } = await supabase.from('profiles')
      .select('id')
      .neq('role', 'admin')
      .gte('created_at', sevenDaysAgo.toISOString())
    if (recentUsersError) throw recentUsersError
    const recent_registrations = recentUsersData.length

    // Revenue
    const { data: paidOrders, error: revenueError } = await supabase.from('orders').select('amount, created_at').eq('payment_status', 'paid')
    if (revenueError) throw revenueError
    const total_revenue = paidOrders.reduce((sum, order) => sum + (order.amount || 0), 0)

    // Weekly stats
    const ordersThisWeek = ordersData.filter(o => new Date(o.created_at) >= sevenDaysAgo).length
    const revenueThisWeek = paidOrders
      .filter(o => new Date(o.created_at) >= sevenDaysAgo)
      .reduce((sum, order) => sum + (order.amount || 0), 0)

    // Recent orders (last 5, with profiles for naming)
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false })
      .limit(5)
    if (recentOrdersError) throw recentOrdersError

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
