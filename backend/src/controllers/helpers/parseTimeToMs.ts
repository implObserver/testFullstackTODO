const timeUnitToMs = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  
  export function parseTimeToMs(timeStr: string): number {
    const match = timeStr.match(/^(\d+)([mhd])$/);
    if (!match) return 0;
  
    const [, num, unit] = match;
    return parseInt(num) * (timeUnitToMs[unit as keyof typeof timeUnitToMs] || 0);
  }