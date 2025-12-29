/**
 * Client-side caching configuration using SWR
 * Install: npm install swr
 */

export const swrConfig = {
  // Revalidation options
  revalidateOnFocus: false, // Don't revalidate when window gets focus
  revalidateOnReconnect: true, // Revalidate when reconnecting
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  
  // Cache configurations for different data types
  courses: {
    refreshInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    revalidateOnMount: true,
    dedupingInterval: 5000,
  },
  
  studentDashboard: {
    refreshInterval: 1 * 60 * 1000, // Refresh every 1 minute
    revalidateOnMount: true,
    dedupingInterval: 2000,
  },
  
  examResults: {
    refreshInterval: 0, // Never auto-refresh (permanent data)
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Dedupe for 1 minute
  },
  
  payments: {
    refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    revalidateOnMount: true,
  },
}

/**
 * Custom fetcher for SWR
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'An error occurred while fetching the data.')
  }
  
  return res.json()
}

/**
 * Fetcher with authentication token
 */
export async function authenticatedFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include', // Include cookies
  })
  
  if (!res.ok) {
    if (res.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    const error = await res.json()
    throw new Error(error.error || 'An error occurred while fetching the data.')
  }
  
  return res.json()
}
