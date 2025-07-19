'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Save,
  Download,
  Eye,
  ChevronDown,
  User,
  Settings,
  LogOut,
  FileText,
  Home,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UnifiedNavigationProps {
  resumeName?: string
  saveStatus?: 'saved' | 'saving' | 'unsaved'
  onPreview?: () => void
  onExportPDF?: () => void
  userData?: any
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  resumeName = 'Resume',
  saveStatus = 'saved',
  onPreview,
  onExportPDF,
  userData
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Get user email from userData or fallback
  const userEmail = userData?.email || userData?.user?.email || 'User'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false)
    router.push(path)
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'saving':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
      case 'unsaved':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Resume Name */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <img src="/horse-logo.png" alt="SmartATS" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white">SmartATS</span>
            </Link>
            
            <div className="hidden sm:flex items-center space-x-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{resumeName}</span>
              {getSaveStatusIcon()}
            </div>
          </div>

          {/* Center - Navigation Links (optional) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/templates" className="text-gray-300 hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/enterprise" className="text-gray-300 hover:text-white transition-colors">
              Enterprise
            </Link>
            <Link href="/ats-guide" className="text-gray-300 hover:text-white transition-colors">
              ATS Guide
            </Link>
          </div>

          {/* Right side - Actions and User Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Action Buttons */}
            {onPreview && (
              <button
                onClick={onPreview}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            )}

            {/* User Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{userEmail}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleNavigation('/profiles')}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-700 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default UnifiedNavigation

