// components/UserDropdown.tsx
‘use client’

import React, { useState, useRef, useEffect } from ‘react’
import { useRouter } from ‘next/navigation’
import { createClient } from ‘@/lib/supabase/client’
import {
ChevronDown,
User,
Settings,
LogOut,
Crown,
Mail
} from ‘lucide-react’
import toast from ‘react-hot-toast’

interface UserDropdownProps {
userData?: {
email?: string
name?: string
isPremium?: boolean
user?: {
email?: string
user_metadata?: {
full_name?: string
}
}
} | any
className?: string
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userData, className = ‘’ }) => {
const [isOpen, setIsOpen] = useState(false)
const dropdownRef = useRef<HTMLDivElement>(null)
const router = useRouter()
const supabase = createClient()

// Extract user info with proper fallbacks
const userEmail = userData?.email ||
userData?.user?.email ||
userData?.user_metadata?.email ||
‘user@example.com’

const userName = userData?.name ||
userData?.full_name ||
userData?.user?.user_metadata?.full_name ||
userData?.user_metadata?.full_name ||
userEmail.split(’@’)[0] // Use email prefix as fallback

const isPremium = userData?.isPremium || userData?.is_premium || false

// Display text - prioritize email for clarity
const displayText = userName && userName !== userEmail.split(’@’)[0] ? userName : userEmail

// Close dropdown on outside click
useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
setIsOpen(false)
}
}

```
document.addEventListener('mousedown', handleClickOutside)
return () => document.removeEventListener('mousedown', handleClickOutside)
```

}, [])

// Close dropdown on escape key
useEffect(() => {
const handleEscape = (event: KeyboardEvent) => {
if (event.key === ‘Escape’) {
setIsOpen(false)
}
}

```
document.addEventListener('keydown', handleEscape)
return () => document.removeEventListener('keydown', handleEscape)
```

}, [])

const handleLogout = async () => {
try {
const { error } = await supabase.auth.signOut()
if (error) throw error

```
  toast.success('Logged out successfully')
  router.push('/login')
} catch (error) {
  console.error('Logout error:', error)
  toast.error('Failed to logout. Please try again.')
}
```

}

const navigateTo = (path: string) => {
setIsOpen(false)
router.push(path)
}

return (
<div ref={dropdownRef} className={`relative ${className}`}>
{/* Dropdown Trigger Button */}
<button
onClick={() => setIsOpen(!isOpen)}
className=“flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 border border-gray-600 hover:border-blue-500”
aria-haspopup=“true”
aria-expanded={isOpen}
>
<div className="flex items-center space-x-2">
<div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
<span className="text-sm font-semibold text-white">
{userEmail.charAt(0).toUpperCase()}
</span>
</div>
<div className="text-left">
<p className="text-sm font-medium text-white max-w-[150px] truncate">
{displayText}
</p>
{isPremium && (
<p className="text-xs text-amber-400 flex items-center gap-1">
<Crown className="w-3 h-3" />
Premium
</p>
)}
</div>
</div>
<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
</button>

```
  {/* Dropdown Menu */}
  {isOpen && (
    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-50">
      {/* User Info Header */}
      <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[180px]">
              {userName && userName !== userEmail.split('@')[0] ? userName : 'User'}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{userEmail}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => navigateTo('/profiles')}
          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors flex items-center space-x-3 group"
        >
          <User className="w-5 h-5 text-gray-400 group-hover:text-teal-400" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => navigateTo('/settings')}
          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors flex items-center space-x-3 group"
        >
          <Settings className="w-5 h-5 text-gray-400 group-hover:text-teal-400" />
          <span>Account Settings</span>
        </button>

        {!isPremium && (
          <>
            <div className="my-2 px-4">
              <div className="border-t border-gray-700"></div>
            </div>
            <button
              onClick={() => navigateTo('/pricing')}
              className="w-full px-4 py-3 text-left bg-gradient-to-r from-pink-600/10 to-amber-600/10 hover:from-pink-600/20 hover:to-amber-600/20 transition-colors flex items-center space-x-3 group"
            >
              <Crown className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-white font-medium">Upgrade to Premium</span>
                <p className="text-xs text-gray-400">Unlock all features</p>
              </div>
            </button>
          </>
        )}

        <div className="my-2 px-4">
          <div className="border-t border-gray-700"></div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center space-x-3 group"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )}
</div>
```

)
}

export default UserDropdown
