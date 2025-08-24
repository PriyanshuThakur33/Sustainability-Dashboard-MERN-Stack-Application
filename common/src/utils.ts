import { MetricType, TrendDirection, QualityFlag } from './types';

// Date utilities
export const getDateRange = (range: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
  const now = new Date();
  const start = new Date(now);
  
  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return { start, end: now };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// KPI calculations
export const calculateDelta = (current: number, previous: number): number => {
  return current - previous;
};

export const calculateDeltaPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const determineTrend = (delta: number, threshold: number = 0.05): TrendDirection => {
  if (Math.abs(delta) < threshold) return TrendDirection.STABLE;
  return delta > 0 ? TrendDirection.UP : TrendDirection.DOWN;
};

export const generateSparkline = (data: number[], points: number = 7): number[] => {
  if (data.length <= points) return data;
  
  const step = Math.floor(data.length / points);
  const sparkline: number[] = [];
  
  for (let i = 0; i < points; i++) {
    const index = i * step;
    sparkline.push(data[index] || 0);
  }
  
  return sparkline;
};

// Metric utilities
export const getMetricUnit = (metric: MetricType): string => {
  switch (metric) {
    case MetricType.ENERGY:
      return 'kWh';
    case MetricType.WATER:
      return 'm³';
    case MetricType.WASTE:
      return 'kg';
    case MetricType.EMISSIONS:
      return 'tCO₂e';
    default:
      return '';
  }
};

export const getMetricColor = (metric: MetricType): string => {
  switch (metric) {
    case MetricType.ENERGY:
      return '#FF6B6B';
    case MetricType.WATER:
      return '#4ECDC4';
    case MetricType.WASTE:
      return '#45B7D1';
    case MetricType.EMISSIONS:
      return '#96CEB4';
    default:
      return '#95A5A6';
  }
};

export const getMetricIcon = (metric: MetricType): string => {
  switch (metric) {
    case MetricType.ENERGY:
      return '⚡';
    case MetricType.WATER:
      return '💧';
    case MetricType.WASTE:
      return '🗑️';
    case MetricType.EMISSIONS:
      return '🌱';
    default:
      return '📊';
  }
};

// Quality assessment
export const assessDataQuality = (value: number, expectedRange: [number, number]): QualityFlag => {
  const [min, max] = expectedRange;
  if (value >= min && value <= max) return QualityFlag.GOOD;
  if (value >= min * 0.8 && value <= max * 1.2) return QualityFlag.SUSPICIOUS;
  return QualityFlag.BAD;
};

// Anomaly detection
export const detectAnomaly = (values: number[], currentValue: number, threshold: number = 2): boolean => {
  if (values.length < 3) return false;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const zScore = Math.abs((currentValue - mean) / stdDev);
  return zScore > threshold;
};

// Cost calculations
export const calculateCostImpact = (
  metric: MetricType,
  value: number,
  baseline: number,
  costPerUnit: number
): number => {
  const difference = value - baseline;
  return difference * costPerUnit;
};

// Data aggregation
export const aggregateByTime = (
  data: Array<{ timestamp: Date; value: number }>,
  interval: 'hour' | 'day' | 'week' | 'month'
): Array<{ timestamp: Date; value: number }> => {
  const grouped = new Map<string, { sum: number; count: number }>();
  
  data.forEach(item => {
    let key: string;
    const date = new Date(item.timestamp);
    
    switch (interval) {
      case 'hour':
        key = date.toISOString().slice(0, 13);
        break;
      case 'day':
        key = date.toISOString().slice(0, 10);
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
        break;
      case 'month':
        key = date.toISOString().slice(0, 7);
        break;
      default:
        key = date.toISOString().slice(0, 10);
    }
    
    if (!grouped.has(key)) {
      grouped.set(key, { sum: 0, count: 0 });
    }
    
    const group = grouped.get(key)!;
    group.sum += item.value;
    group.count += 1;
  });
  
  return Array.from(grouped.entries()).map(([key, group]) => ({
    timestamp: new Date(key),
    value: group.sum / group.count
  })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Local storage utilities
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return defaultValue;
  }
};

// Error handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Number formatting
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
