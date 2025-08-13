'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, 
  Heart, 
  Phone, 
  Calendar, 
  MapPin, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Donors', href: '/dashboard/donors', icon: Users },
  { name: 'Donations', href: '/dashboard/donations', icon: Heart },
  { name: 'Calls', href: '/dashboard/calls', icon: Phone },
  { name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
  { name: 'Locations', href: '/dashboard/locations', icon: MapPin },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Donor Management</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-gray-800 p-4">
        <button className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  )
}
