/**
 * Format currency to Indian Rupee (INR) representation
 * Example: 2500000 -> ₹ 25,00,000
 */
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format standard area measurements
 */
export const formatArea = (sqm) => {
  if (!sqm) return '0 sq.m';
  const acres = (sqm / 4046.8564).toFixed(3);
  const gunthas = (sqm / 101.171).toFixed(1);
  return {
    sqm: `${new Intl.NumberFormat('en-IN').format(Math.round(sqm))} sq.m`,
    acres: `${acres} Acres`,
    gunthas: `${gunthas} Gunthas`,
    hectares: `${(sqm / 10000).toFixed(3)} Ha`,
  };
};

/**
 * Normalization helper: convert diverse local unit values to standard sqm
 */
export const convertLocalUnitToSqm = (value, unitType) => {
  if (!value || isNaN(value)) return 0;
  const num = parseFloat(value);
  switch (unitType?.toLowerCase()) {
    case 'bigha':
      return num * 2529.3;
    case 'biswa':
      return num * 126.46;
    case 'guntha':
      return num * 101.17;
    case 'are':
      return num * 100.0;
    case 'hectare':
      return num * 10000.0;
    case 'cent':
      return num * 40.4686;
    case 'ground':
      return num * 222.96;
    case 'sq_yard':
    case 'gaj':
      return num * 0.836127;
    case 'sq_ft':
      return num * 0.092903;
    default:
      return num;
  }
};

/**
 * Format Indian date string (YYYY-MM-DD -> DD MMM YYYY)
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Format 14-digit ULPIN for high visual legibility
 * Example: 27250010045001 -> 27-250-01004-5001
 */
export const formatULPIN = (ulpin) => {
  if (!ulpin) return '—';
  const str = String(ulpin).trim();
  if (str.length === 14) {
    return `${str.slice(0, 2)} ${str.slice(2, 6)} ${str.slice(6, 10)} ${str.slice(10)}`;
  }
  return str;
};

/**
 * Theme status color helpers
 */
export const getStatusBadgeColor = (status) => {
  const s = String(status || '').toLowerCase();
  if (s.includes('clear') || s.includes('approved') || s.includes('paid') || s.includes('certified')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (s.includes('due') || s.includes('notice') || s.includes('scrutiny') || s.includes('mutation') || s.includes('pending')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  if (s.includes('dispute') || s.includes('court') || s.includes('overdue') || s.includes('rejected') || s.includes('stay')) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  if (s.includes('mortgage') || s.includes('lien') || s.includes('charge')) {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
  if (s.includes('reserved') || s.includes('buffer') || s.includes('restricted')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

/**
 * Safely extracts human-readable string message from any error payload
 * (including Axios errors, Django REST Framework {code, message} objects,
 * validation objects, nested details, and standard Error instances).
 * Guarantees a string is returned, preventing React error #31 (Objects are not valid as a React child).
 */
export const extractErrorMessage = (err, fallback = 'An unexpected error occurred. Please try again.') => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;

  // 1. Direct message / error property
  if (typeof err.message === 'string' && err.message.trim()) {
    return err.message;
  }
  if (typeof err.error === 'string' && err.error.trim()) {
    return err.error;
  }
  if (typeof err.detail === 'string' && err.detail.trim()) {
    return err.detail;
  }

  // 2. Nested {code, message} pattern (DRF/API error structure)
  if (err.message && typeof err.message === 'object') {
    if (typeof err.message.message === 'string') return err.message.message;
    if (typeof err.message.detail === 'string') return err.message.detail;
  }
  if (err.error && typeof err.error === 'object') {
    if (typeof err.error.message === 'string') return err.error.message;
    if (typeof err.error.detail === 'string') return err.error.detail;
  }

  // 3. Axios response.data
  const data = err.response?.data || (typeof err.data === 'object' ? err.data : null);
  if (data) {
    if (typeof data === 'string') return data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.detail === 'string') return data.detail;
    if (data.code && typeof data.message === 'string') return data.message;
    // Django REST Framework field validation errors: { field: ['error1', 'error2'] }
    if (typeof data === 'object') {
      const messages = Object.entries(data)
        .map(([field, val]) => {
          if (Array.isArray(val)) return `${field}: ${val.join(', ')}`;
          if (typeof val === 'string') return `${field}: ${val}`;
          if (typeof val === 'object' && val !== null) return `${field}: ${JSON.stringify(val)}`;
          return null;
        })
        .filter(Boolean);
      if (messages.length > 0) return messages.join('; ');
    }
  }

  // 4. Array of errors
  if (Array.isArray(err)) {
    return err.map((item) => extractErrorMessage(item, '')).filter(Boolean).join('; ') || fallback;
  }

  // 5. General object with code
  if (err.code && typeof err.code === 'string') {
    return `Error [${err.code}]`;
  }

  return fallback;
};
