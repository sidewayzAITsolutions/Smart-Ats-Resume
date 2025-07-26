‘use client’

import React from ‘react’
import { useRouter } from ‘next/navigation’
import { createClient } from ‘@/lib/supabase/client’
import { LogOut, User } from ‘lucide-react’

interface UserDropdownProps {
userData?: any;
className?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userData, className = ‘’ }) => {
const router = useRouter()
const supabase = createClient()

const userEmail = userData?.email || userData?.user?.email || ‘User’

const handleLogout = async () => {
await supabase.auth.signOut()
router.push(’/auth/signin’)
}

return (
<div className={`flex items-center gap-2 ${className}`}>
<div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-white">
<User className="w-4 h-4" />
<span className="text-sm">{userEmail.split(’@’)[0]}</span>
</div>
<button
onClick={handleLogout}
className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm flex items-center gap-1"
>
<LogOut className="w-4 h-4" />
Logout
</button>
</div>
)
}

export default UserDropdown
