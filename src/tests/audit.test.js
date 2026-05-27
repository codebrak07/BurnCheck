import { describe, test, expect } from 'vitest';
import { runAuditBenchmark, encodeAuditId, decodeAuditId } from '../App';

describe('BurnCheck Audit Logic & Stateless State Serialization', () => {
  // Test 1: Cursor downgrade for small teams
  test('Cursor Business with <= 5 seats recommendation', () => {
    const input = {
      teamSize: 3,
      useCase: 'Coding',
      tools: [
        { toolName: 'Cursor', plan: 'Business', spend: 80, seats: 2 }
      ]
    };
    const result = runAuditBenchmark(input);
    expect(result.totalMonthlySavings).toBe(40); // 80 - (20 * 2) = 40 savings
    expect(result.tools[0].status).toBe('overspending');
    expect(result.tools[0].recommendation).toContain('Downgrade to Pro');
  });

  // Test 2: Claude Team seat minimum violation
  test('Claude Team with under 5 seats minimum rule', () => {
    const input = {
      teamSize: 2,
      useCase: 'Mixed',
      tools: [
        { toolName: 'Claude', plan: 'Team', spend: 150, seats: 3 }
      ]
    };
    const result = runAuditBenchmark(input);
    expect(result.totalMonthlySavings).toBe(90); // 150 - (20 * 3) = 90 savings
    expect(result.tools[0].status).toBe('overspending');
    expect(result.tools[0].recommendation).toContain('Claude Team has a 5-seat minimum');
  });

  // Test 3: Optimal tool configuration returns $0 savings
  test('Optimal tool configuration', () => {
    const input = {
      teamSize: 10,
      useCase: 'Research',
      tools: [
        { toolName: 'Cursor', plan: 'Pro', spend: 20, seats: 1 }
      ]
    };
    const result = runAuditBenchmark(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.tools[0].status).toBe('optimal');
  });

  // Test 4: Base64 encoding and decoding round-trip integrity
  test('Base64 encoding/decoding round-trip', () => {
    const originalData = {
      teamSize: 5,
      useCase: 'Coding',
      tools: [
        { toolName: 'Cursor', plan: 'Pro', spend: 100, seats: 5 },
        { toolName: 'ChatGPT', plan: 'Team', spend: 90, seats: 3 }
      ]
    };

    const encoded = encodeAuditId(originalData);
    expect(typeof encoded).toBe('string');
    
    const decoded = decodeAuditId(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded.teamSize).toBe(5);
    expect(decoded.useCase).toBe('Coding');
    expect(decoded.tools).toHaveLength(2);
    expect(decoded.tools[0].toolName).toBe('Cursor');
    expect(decoded.tools[0].spend).toBe(100);
    expect(decoded.tools[0].seats).toBe(5);
  });

  // Test 5: Invalid/Malformed base64 handling
  test('Invalid base64 decoding returns null', () => {
    const result = decodeAuditId('invalid-base64-string-!!!');
    expect(result).toBeNull();
  });
});
