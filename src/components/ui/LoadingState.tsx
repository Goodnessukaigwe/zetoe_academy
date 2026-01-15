import React from 'react'
import { Spinner } from './Spinner'
import { PageHeaderSkeleton, StatsCardSkeleton, CourseCardSkeleton } from './Skeleton'

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'card' | 'stats' | 'list' | 'table' | 'custom'
  count?: number
  message?: string
  fullScreen?: boolean
  className?: string
  children?: React.ReactNode
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  count = 3,
  message = 'Loading...',
  fullScreen = false,
  className = '',
  children,
}) => {
  // Full screen loading with spinner
  if (fullScreen && type === 'spinner') {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    )
  }

  // Spinner with message
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    )
  }

  // Page header skeleton
  if (type === 'skeleton') {
    return (
      <div className={className}>
        <PageHeaderSkeleton />
      </div>
    )
  }

  // Stats cards skeleton
  if (type === 'stats') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Course/Content cards skeleton
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // List skeleton
  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  // Table skeleton
  if (type === 'table') {
    return (
      <div className={`overflow-hidden ${className}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: 4 }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: count }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Custom children
  if (type === 'custom' && children) {
    return <div className={className}>{children}</div>
  }

  // Default fallback
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Spinner size="lg" />
    </div>
  )
}

export default LoadingState
