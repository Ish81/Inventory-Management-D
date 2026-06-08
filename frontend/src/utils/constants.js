// Order status definitions — single source of truth for the entire frontend
// If a status changes, update it here only

export const PO_STATUSES = {
  draft: { label: 'Draft', color: '#185FA5', bg: '#E6F1FB' },
  pending: { label: 'Pending', color: '#854F0B', bg: '#FAEEDA' },
  approved: { label: 'Approved', color: '#0F6E56', bg: '#E1F5EE' },
  received: { label: 'Received', color: '#3B6D11', bg: '#EAF3DE' },
  cancelled: { label: 'Cancelled', color: '#A32D2D', bg: '#FCEBEB' },
};

export const SO_STATUSES = {
  draft: { label: 'Draft', color: '#185FA5', bg: '#E6F1FB' },
  confirmed: { label: 'Confirmed', color: '#534AB7', bg: '#EEEDFE' },
  processing: { label: 'Processing', color: '#854F0B', bg: '#FAEEDA' },
  dispatched: { label: 'Dispatched', color: '#0F6E56', bg: '#E1F5EE' },
  completed: { label: 'Completed', color: '#3B6D11', bg: '#EAF3DE' },
  cancelled: { label: 'Cancelled', color: '#A32D2D', bg: '#FCEBEB' },
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';