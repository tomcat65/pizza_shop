'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="philly-button-secondary inline-flex items-center gap-2 !bg-philly-green-600/80 hover:!bg-philly-green-600/90"
    >
      <ChevronLeft className="h-5 w-5" />
      <span>Back</span>
    </button>
  )
} 