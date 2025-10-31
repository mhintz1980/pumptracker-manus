// src/lib/format.ts

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(isoString: string | undefined): string {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
}

export function round(value: number, decimals: number = 0): number {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

export function formatPriorityColor(priority: string, type: 'border' | 'text' | 'bg'): string {
  const colors = {
    Urgent: {
      border: "border-red-500",
      text: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/20",
    },
    Rush: {
      border: "border-orange-500",
      text: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    High: {
      border: "border-yellow-500",
      text: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    Normal: {
      border: "border-blue-500",
      text: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    Low: {
      border: "border-gray-500",
      text: "text-gray-500",
      bg: "bg-gray-50 dark:bg-gray-950/20",
    },
  };

  const priorityColors = colors[priority as keyof typeof colors] || colors.Low;

  if (type === 'bg') {
    return `${priorityColors.border} ${priorityColors.bg}`;
  }

  return priorityColors[type];
}

