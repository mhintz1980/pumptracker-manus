
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SupabaseAdapter } from '../src/adapters/supabase';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => {
  const from = vi.fn();
  const select = vi.fn();
  const mockSupabase = {
    from: from.mockReturnThis(),
    select,
  };
  return {
    createClient: vi.fn(() => mockSupabase),
  };
});

describe('SupabaseAdapter', () => {
  let supabase: any;

  beforeEach(() => {
    supabase = createClient();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should retry loading data on failure', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const error = new Error('Network error');
    supabase.from.mockReturnValue({
        select: vi.fn()
        .mockResolvedValueOnce({ data: null, error })
        .mockResolvedValueOnce({ data: null, error })
        .mockResolvedValueOnce({ data: [{ id: '1', name: 'Test Pump' }], error: null }),
    });

    const data = await SupabaseAdapter.load();

    expect(supabase.from).toHaveBeenCalledTimes(3);
    expect(supabase.from.mock.results[0].value.select).toHaveBeenCalledTimes(1);
    expect(supabase.from.mock.results[1].value.select).toHaveBeenCalledTimes(1);
    expect(supabase.from.mock.results[2].value.select).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenCalledWith('Retrying in 500ms...');
    expect(consoleLogSpy).toHaveBeenCalledWith('Retrying in 1000ms...');
    expect(data).toEqual([{ id: '1', name: 'Test Pump' }]);

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('should throw an error after max retries', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const error = new Error('Network error');
    supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error }),
    });

    await expect(SupabaseAdapter.load()).rejects.toThrow('Network error');

    expect(supabase.from).toHaveBeenCalledTimes(3);
    expect(supabase.from.mock.results[0].value.select).toHaveBeenCalledTimes(1);
    expect(supabase.from.mock.results[1].value.select).toHaveBeenCalledTimes(1);
    expect(supabase.from.mock.results[2].value.select).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    expect(consoleLogSpy).toHaveBeenCalledWith('Retrying in 500ms...');
    expect(consoleLogSpy).toHaveBeenCalledWith('Retrying in 1000ms...');
    expect(consoleLogSpy).toHaveBeenCalledWith('Retrying in 1500ms...');

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});
