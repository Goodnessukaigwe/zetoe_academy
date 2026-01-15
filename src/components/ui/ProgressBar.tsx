import React from 'react'

interface ProgressBarProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
  className?: string
  animated?: boolean
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const colorClasses = {
  primary: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className = '',
  animated = true,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-gray-600">{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  className?: string
}

const circularColorClasses = {
  primary: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showLabel = true,
  className = '',
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clampedProgress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ${circularColorClasses[color]}`}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-gray-700">{clampedProgress}%</span>
        </div>
      )}
    </div>
  )
}

interface IndeterminateProgressProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

export const IndeterminateProgress: React.FC<IndeterminateProgressProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-indeterminate`}
        style={{
          width: '30%',
          animation: 'indeterminate 1.5s ease-in-out infinite',
        }}
      />
    </div>
  )
}

interface FileUploadProgressProps {
  fileName: string
  progress: number
  size?: string
  status?: 'uploading' | 'success' | 'error'
  onCancel?: () => void
  className?: string
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  fileName,
  progress,
  size,
  status = 'uploading',
  onCancel,
  className = '',
}) => {
  const statusColors = {
    uploading: 'primary' as const,
    success: 'success' as const,
    error: 'danger' as const,
  }

  const statusIcons = {
    uploading: (
      <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          {statusIcons[status]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
            {size && <p className="text-xs text-gray-500">{size}</p>}
          </div>
        </div>
        {onCancel && status === 'uploading' && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cancel upload"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <ProgressBar
        progress={progress}
        color={statusColors[status]}
        size="sm"
        showLabel={status === 'uploading'}
      />
      {status === 'error' && (
        <p className="text-xs text-red-600 mt-2">Upload failed. Please try again.</p>
      )}
      {status === 'success' && (
        <p className="text-xs text-green-600 mt-2">Upload complete!</p>
      )}
    </div>
  )
}

export default ProgressBar
