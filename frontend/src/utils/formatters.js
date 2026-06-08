// Helper functions for formatting data consistently across the app

/**
 * Format a number as Indian Rupee currency
 * Example: 125000 → "₹1,25,000.00"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Format an ISO date string to readable date
 * Example: "2024-06-15T10:30:00Z" → "Jun 15, 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format an ISO date string to readable date + time
 * Example: "2024-06-15T10:30:00Z" → "Jun 15, 2024, 4:00 PM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate long text with ellipsis
 * Example: truncate("Hello World", 8) → "Hello Wo..."
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '—';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};