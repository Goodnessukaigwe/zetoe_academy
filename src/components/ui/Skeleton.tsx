import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`bg-gray-200 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <Skeleton variant="rounded" height={200} className="mb-4" />
      <Skeleton variant="text" height={24} className="mb-2 w-3/4" />
      <Skeleton variant="text" height={20} className="mb-2 w-full" />
      <Skeleton variant="text" height={20} className="w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  )
}

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({
  columns = 4,
  className = '',
}) => {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton variant="text" height={20} />
        </td>
      ))}
    </tr>
  )
}

// List Item Skeleton
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 p-4 border-b border-gray-200 ${className}`}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="text" height={20} className="mb-2 w-1/3" />
        <Skeleton variant="text" height={16} className="w-2/3" />
      </div>
    </div>
  )
}

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({
  fields = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index}>
          <Skeleton variant="text" height={16} className="mb-2 w-24" />
          <Skeleton variant="rounded" height={40} className="w-full" />
        </div>
      ))}
      <div className="flex gap-4">
        <Skeleton variant="rounded" width={120} height={40} />
        <Skeleton variant="rounded" width={120} height={40} />
      </div>
    </div>
  )
}

// Page Header Skeleton
export const PageHeaderSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <Skeleton variant="text" height={32} className="mb-4 w-1/2" />
      <Skeleton variant="text" height={20} className="w-3/4" />
    </div>
  )
}

// Dashboard Stats Skeleton
export const StatsCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton variant="text" height={16} className="mb-2 w-24" />
          <Skeleton variant="text" height={32} className="w-20" />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
    </div>
  )
}

// Course Card Skeleton
export const CourseCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <Skeleton variant="rectangular" height={180} />
      <div className="p-6">
        <Skeleton variant="text" height={24} className="mb-3 w-4/5" />
        <Skeleton variant="text" height={16} className="mb-2 w-full" />
        <Skeleton variant="text" height={16} className="mb-4 w-full" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" height={16} className="flex-1" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton variant="text" height={20} className="w-24" />
          <Skeleton variant="rounded" width={100} height={36} />
        </div>
      </div>
    </div>
  )
}

// Exam Card Skeleton
export const ExamCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="text" height={24} className="mb-2 w-3/4" />
          <Skeleton variant="text" height={16} className="w-1/2" />
        </div>
        <Skeleton variant="rounded" width={80} height={24} />
      </div>
      <Skeleton variant="text" height={16} className="mb-2 w-full" />
      <Skeleton variant="text" height={16} className="mb-4 w-4/5" />
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" height={16} className="w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" height={16} className="w-20" />
        </div>
      </div>
      <Skeleton variant="rounded" height={40} className="w-full" />
    </div>
  )
}

export default Skeleton
