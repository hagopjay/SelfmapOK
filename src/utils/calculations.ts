import type { d3 } from 'd3';

export const calculatePosition = (
  value: number,
  scale: d3.ScaleLinear<number, number>
): number => {
  if (value === 10) return scale(0);
  if (value >= 5) return scale(value / 2);
  return scale(value);
};

export const calculateSize = (value: number, width: number): number => {
  const baseSize = width * 0.008;
  if (value === 10) return baseSize * 1.8;
  if (value >= 5) return baseSize * 1.4;
  return baseSize;
};