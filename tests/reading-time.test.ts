import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../src/utils/reading-time';

describe('getReadingTime', () => {
  it('returns 1 for undefined body', () => {
    expect(getReadingTime(undefined)).toBe(1);
  });

  it('returns 1 for an empty string', () => {
    expect(getReadingTime('')).toBe(1);
  });

  it('returns 1 for very short content', () => {
    expect(getReadingTime('Just a few words')).toBe(1);
  });

  it('calculates 1 minute for exactly 200 words', () => {
    const body = Array(200).fill('word').join(' ');
    expect(getReadingTime(body)).toBe(1);
  });

  it('calculates 2 minutes for exactly 400 words', () => {
    const body = Array(400).fill('word').join(' ');
    expect(getReadingTime(body)).toBe(2);
  });

  it('rounds up — 201 words is 2 minutes', () => {
    const body = Array(201).fill('word').join(' ');
    expect(getReadingTime(body)).toBe(2);
  });

  it('handles a realistic blog post body (~600 words)', () => {
    const body = Array(600).fill('word').join(' ');
    expect(getReadingTime(body)).toBe(3);
  });

  it('minimum is always 1, never 0', () => {
    expect(getReadingTime('x')).toBe(1);
  });
});
