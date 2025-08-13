'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Heart, Phone, Calendar, TrendingUp } from 'lucide-react'
import { useGetDonorsQuery, useGetDonationsQuery, useGetCallsQuery, useGetReservationsQuery } from '@/store/api'

export default function DashboardPage() {
  const { data: donors, isLoading: donorsLoading } = useGetDonorsQuery()
  const { data: donations, isLoading: donationsLoading } = useGetDonationsQuery()
  const { data: calls, isLoading: callsLoading } = useGetCallsQuery()
  const { data: reservations, isLoading: reservationsLoading } = useGetReservationsQuery()

  const stats = [
    {
      title: 'Total Donors',
      value: donors?.length || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Donations',
      value: donations?.length || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Calls',
      value: calls?.length || 0,
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Reservations',
      value: reservations?.filter(r => r.status === 'ACTIVE').length || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your donor management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {donationsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : donations && donations.length > 0 ? (
              <div className="space-y-4">
                {donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{donation.donor?.name || 'Unknown Donor'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No donations found</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {callsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : calls && calls.length > 0 ? (
              <div className="space-y-4">
                {calls.slice(0, 5).map((call) => (
                  <div key={call.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{call.donor?.name || 'Unknown Donor'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(call.call_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">{call.outcome}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No calls found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
