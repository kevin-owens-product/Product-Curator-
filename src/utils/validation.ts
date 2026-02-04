/**
 * Input validation utilities.
 */

import { ValidationError } from './errors';

export function requireField(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

export function requireFields(fields: Record<string, unknown>): void {
  for (const [name, value] of Object.entries(fields)) {
    requireField(value, name);
  }
}

export function validateDateRange(start: string, end: string, fieldNames: [string, string]): void {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime())) {
    throw new ValidationError(`${fieldNames[0]} is not a valid date`);
  }
  if (isNaN(endDate.getTime())) {
    throw new ValidationError(`${fieldNames[1]} is not a valid date`);
  }
  if (startDate >= endDate) {
    throw new ValidationError(`${fieldNames[0]} must be before ${fieldNames[1]}`);
  }
}

export function validateScoreRange(score: number, min: number, max: number, fieldName: string): void {
  if (score < min || score > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
  }
}

export function validateEnum<T extends string>(value: string, enumValues: T[], fieldName: string): void {
  if (!enumValues.includes(value as T)) {
    throw new ValidationError(`${fieldName} must be one of: ${enumValues.join(', ')}`);
  }
}

export function validatePositiveNumber(value: number, fieldName: string): void {
  if (typeof value !== 'number' || value < 0) {
    throw new ValidationError(`${fieldName} must be a positive number`);
  }
}

export function isBeforeDeadline(deadline: string): boolean {
  return new Date() < new Date(deadline);
}
