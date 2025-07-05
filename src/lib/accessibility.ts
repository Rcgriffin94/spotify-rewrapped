// Accessibility utilities for the Spotify Rewrapped app

// ARIA attributes for interactive elements
export const accessibilityProps = {
  button: (label: string, expanded?: boolean, disabled?: boolean) => ({
    'aria-label': label,
    'aria-expanded': expanded,
    'aria-disabled': disabled,
    role: 'button',
    tabIndex: disabled ? -1 : 0,
  }),
  
  link: (label: string, current?: boolean) => ({
    'aria-label': label,
    'aria-current': current ? 'page' : undefined,
    role: 'link',
  }),
  
  list: (label: string, itemCount?: number) => ({
    'aria-label': label,
    'aria-live': 'polite',
    role: 'list',
    ...(itemCount && { 'aria-setsize': itemCount }),
  }),
  
  listItem: (position?: number, total?: number) => ({
    role: 'listitem',
    ...(position && { 'aria-posinset': position }),
    ...(total && { 'aria-setsize': total }),
  }),
  
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6, label?: string) => ({
    role: 'heading',
    'aria-level': level,
    ...(label && { 'aria-label': label }),
  }),
  
  region: (label: string, live?: 'polite' | 'assertive' | 'off') => ({
    role: 'region',
    'aria-label': label,
    'aria-live': live || 'polite',
  }),
  
  dialog: (label: string, modal: boolean = true) => ({
    role: 'dialog',
    'aria-label': label,
    'aria-modal': modal,
    tabIndex: -1,
  }),
  
  alert: (label?: string) => ({
    role: 'alert',
    'aria-live': 'assertive',
    ...(label && { 'aria-label': label }),
  }),
  
  status: (label?: string) => ({
    role: 'status',
    'aria-live': 'polite',
    ...(label && { 'aria-label': label }),
  }),
  
  progressbar: (value: number, max: number = 100, label?: string) => ({
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuetext': `${value} of ${max}`,
    ...(label && { 'aria-label': label }),
  }),
  
  tab: (selected: boolean, controls: string, label?: string) => ({
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1,
    ...(label && { 'aria-label': label }),
  }),
  
  tabPanel: (labelledBy: string, hidden: boolean = false) => ({
    role: 'tabpanel',
    'aria-labelledby': labelledBy,
    'aria-hidden': hidden,
    tabIndex: hidden ? -1 : 0,
  }),
  
  combobox: (expanded: boolean, owns?: string, label?: string) => ({
    role: 'combobox',
    'aria-expanded': expanded,
    'aria-haspopup': 'listbox',
    'aria-autocomplete': 'list',
    ...(owns && { 'aria-owns': owns }),
    ...(label && { 'aria-label': label }),
  }),
};

// Screen reader utilities
export const srOnlyClass = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = srOnlyClass;
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management
export const focusManagement = {
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },
  
  focusElement: (element: HTMLElement | null, options?: FocusOptions) => {
    if (element) {
      element.focus(options);
    }
  },
  
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  },
};

// Keyboard navigation helpers
export const keyboardHandlers = {
  arrowNavigation: (
    event: React.KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void,
    horizontal: boolean = false
  ) => {
    const { key } = event;
    let newIndex = currentIndex;
    
    if (horizontal) {
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % items.length;
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
    } else {
      if (key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % items.length;
      } else if (key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
    }
    
    if (newIndex !== currentIndex) {
      event.preventDefault();
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    }
  },
  
  homeEndNavigation: (
    event: React.KeyboardEvent,
    items: HTMLElement[],
    setCurrentIndex: (index: number) => void
  ) => {
    const { key } = event;
    
    if (key === 'Home') {
      event.preventDefault();
      setCurrentIndex(0);
      items[0]?.focus();
    } else if (key === 'End') {
      event.preventDefault();
      setCurrentIndex(items.length - 1);
      items[items.length - 1]?.focus();
    }
  },
  
  enterSpaceHandler: (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  },
};

// Color contrast utilities
export const colorContrast = {
  // Check if color combination meets WCAG AA standards
  meetsWCAG: (background: string, foreground: string): boolean => {
    // This is a simplified check - in production, use a proper color contrast library
    const bgLuminance = getLuminance(background);
    const fgLuminance = getLuminance(foreground);
    const contrast = (Math.max(bgLuminance, fgLuminance) + 0.05) / (Math.min(bgLuminance, fgLuminance) + 0.05);
    return contrast >= 4.5; // WCAG AA standard
  },
};

// Simplified luminance calculation (for basic contrast checking)
function getLuminance(color: string): number {
  // This is a very basic implementation - use a proper color library in production
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast detection
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};
