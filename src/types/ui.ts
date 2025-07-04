import { ReactNode } from "react"
import { TimeRange, TopTrack, TopArtist, RecentlyPlayed, ListeningStats } from "./spotify"
import { FormattedTrack } from "@/lib/spotify-api"

// Base component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error?: string | null
  data?: any
}

// Generic API response state
export interface ApiState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  lastFetched?: Date
}

// List control components
export interface ListControlsProps {
  onTimeRangeChange: (timeRange: 'short_term' | 'medium_term' | 'long_term') => void;
  onLimitChange: (limit: number) => void;
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  limit: number;
  isLoading?: boolean;
}

export interface TimeRangeOption {
  value: 'short_term' | 'medium_term' | 'long_term';
  label: string;
  description: string;
}

export interface LimitOption {
  value: number;
  label: string;
}

// Music item components
export interface TrackListItemProps {
  track: FormattedTrack;
  showRank?: boolean;
}

export interface ArtistListItemProps {
  artist: TopArtist
  rank: number
  showRank?: boolean
  showGenres?: boolean
  showPlayCount?: boolean
  compact?: boolean
  className?: string
  onClick?: (artist: TopArtist) => void
}

export interface RecentlyPlayedItemProps {
  item: RecentlyPlayed['items'][0]
  showTimestamp?: boolean
  showContext?: boolean
  compact?: boolean
  className?: string
  onClick?: (item: RecentlyPlayed['items'][0]) => void
}

// Navigation components
export interface NavigationProps {
  currentPath: string
  user?: {
    name?: string
    image?: string
  }
  className?: string
}

export interface NavigationItem {
  path: string
  label: string
  icon?: ReactNode
  description?: string
  active?: boolean
}

// Statistics components
export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  className?: string
}

export interface ChartProps {
  data: any[]
  title?: string
  height?: number
  className?: string
}

export interface ListeningTimeChartProps extends ChartProps {
  data: {
    date: string
    minutes: number
    tracks: number
  }[]
}

export interface GenreChartProps extends ChartProps {
  data: {
    genre: string
    count: number
    percentage: number
  }[]
  type?: "bar" | "pie" | "doughnut"
}

export interface AudioFeaturesChartProps extends ChartProps {
  data: {
    feature: string
    value: number
    description: string
  }[]
}

// Page props
export interface PageProps {
  params?: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export interface MusicPageProps extends PageProps {
  initialTimeRange?: TimeRange
  initialLimit?: number
}

// Form and input components
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
}

export interface SelectProps<T = string> {
  options: SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  maxDate?: Date
  minDate?: Date
  disabled?: boolean
  className?: string
}

// Modal and dialog components
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

// Toast and notification types
export interface ToastOptions {
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

export interface NotificationState {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration: number
  timestamp: Date
}

// Theme and styling
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

// Layout components
export interface LayoutProps {
  children: ReactNode
  navigation?: boolean
  footer?: boolean
  className?: string
}

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  width?: "sm" | "md" | "lg"
}

export interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

// Search and filter components
export interface SearchState {
  query: string
  filters: Record<string, any>
  sortBy: string
  sortOrder: "asc" | "desc"
}

export interface FilterOption {
  key: string
  label: string
  type: "select" | "multiselect" | "range" | "boolean"
  options?: SelectOption[]
  min?: number
  max?: number
}

export interface SearchAndFilterProps {
  searchState: SearchState
  onSearchChange: (state: SearchState) => void
  filters: FilterOption[]
  placeholder?: string
  className?: string
}

// Error boundary and error handling
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

// Utility types for component variants
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl"
export type ComponentVariant = "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost"
export type LoadingVariant = "spinner" | "skeleton" | "pulse" | "dots"

// Hook return types
export interface UseSpotifyDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  mutate: (newData: T) => void
}

export interface UsePaginationReturn {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
}

// Navigation component types
export interface NavigationItem {
  name: string
  href: string
  iconComponent: any // LucideIcon component
  description?: string
  isActive?: boolean
}

export interface NavigationProps {
  items?: NavigationItem[]
  showUserInfo?: boolean
  onLogout?: () => void
}

// API Response types
export interface TopTracksApiResponse {
  success: boolean;
  data: {
    tracks: FormattedTrack[];
    total: number;
    limit: number;
    offset: number;
    time_range: string;
  };
  timestamp: string;
}

export interface ApiError {
  error: string;
  code?: string;
}
