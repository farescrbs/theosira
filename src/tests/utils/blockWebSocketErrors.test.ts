import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { blockAllWebSocketErrors } from '../../utils/blockWebSocketErrors';

/**
 * Tests for blockAllWebSocketErrors – a function that patches browser globals
 * to suppress WebSocket-related noise from the console / error handlers.
 *
 * Because the function directly mutates window globals, we capture the
 * originals before each test and restore them afterwards.
 */
describe('blockAllWebSocketErrors', () => {
  let originalConsoleError: typeof console.error;
  let originalConsoleWarn: typeof console.warn;
  let originalOnerror: typeof window.onerror;

  beforeEach(() => {
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    originalOnerror = window.onerror;
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    window.onerror = originalOnerror;
    vi.restoreAllMocks();
  });

  it('does not throw when called', () => {
    expect(() => blockAllWebSocketErrors()).not.toThrow();
  });

  // ─── console.error filtering ───────────────────────────────

  describe('console.error patching', () => {
    const wsMessages = [
      'WebSocket error occurred',
      'ws:// connection refused',
      'wss:// handshake failed',
      'connection failed',
      'ECONNREFUSED',
      'net::ERR_CONNECTION_REFUSED',
      'isTrusted: true',
    ];

    wsMessages.forEach((msg) => {
      it(`suppresses console.error for WebSocket message: "${msg}"`, () => {
        // Install a spy as console.error BEFORE patching so blockAll captures it as "original"
        const spy = vi.fn();
        console.error = spy;
        blockAllWebSocketErrors();
        // Now call the patched console.error with a WS message
        console.error(msg);
        // The spy (captured as originalConsoleError) should NOT have been called
        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('allows non-WebSocket errors through console.error', () => {
      const spy = vi.fn();
      console.error = spy;
      blockAllWebSocketErrors();
      console.error('React rendering error in component');
      // The spy should have been called (pass-through for non-WS errors)
      expect(spy).toHaveBeenCalledWith('React rendering error in component');
    });

    it('handles object arguments without throwing', () => {
      blockAllWebSocketErrors();
      expect(() => console.error({ type: 'websocket', msg: 'error' })).not.toThrow();
    });

    it('handles non-serialisable objects without throwing', () => {
      blockAllWebSocketErrors();
      const circular: any = {};
      circular.self = circular;
      expect(() => console.error(circular)).not.toThrow();
    });
  });

  // ─── console.warn filtering ────────────────────────────────

  describe('console.warn patching', () => {
    it('suppresses WebSocket-related warnings', () => {
      const spy = vi.fn();
      console.warn = spy;
      blockAllWebSocketErrors();
      console.warn('ws:// connection warning');
      expect(spy).not.toHaveBeenCalled();
    });

    it('suppresses wss:// warnings', () => {
      const spy = vi.fn();
      console.warn = spy;
      blockAllWebSocketErrors();
      console.warn('wss:// connection closed');
      expect(spy).not.toHaveBeenCalled();
    });

    it('allows non-WebSocket warnings through', () => {
      const spy = vi.fn();
      console.warn = spy;
      blockAllWebSocketErrors();
      console.warn('Deprecated API usage');
      expect(spy).toHaveBeenCalledWith('Deprecated API usage');
    });
  });

  // ─── window.onerror filtering ──────────────────────────────

  describe('window.onerror patching', () => {
    beforeEach(() => {
      blockAllWebSocketErrors();
    });

    it('blocks WebSocket-related global errors', () => {
      const result = window.onerror!('WebSocket connection error', '', 0, 0, undefined);
      expect(result).toBe(true); // returning true prevents default browser error handling
    });

    it('blocks ws:// errors via window.onerror', () => {
      const result = window.onerror!('Failed to connect to ws://localhost', '', 0, 0, undefined);
      expect(result).toBe(true);
    });

    it('blocks wss:// errors via window.onerror', () => {
      const result = window.onerror!('wss:// TLS error', '', 0, 0, undefined);
      expect(result).toBe(true);
    });

    it('blocks ECONNREFUSED errors via window.onerror', () => {
      const result = window.onerror!('ECONNREFUSED 127.0.0.1:8765', '', 0, 0, undefined);
      expect(result).toBe(true);
    });

    it('does not block unrelated errors via window.onerror', () => {
      // Without a prior handler, the patched version should return false for non-WS errors
      const result = window.onerror!('TypeError: Cannot read property of undefined', '', 0, 0, undefined);
      expect(result).toBeFalsy();
    });

    it('calls through to original onerror for non-WebSocket errors', () => {
      const originalHandler = vi.fn().mockReturnValue(false);
      window.onerror = originalHandler; // install "original" before patching
      blockAllWebSocketErrors(); // re-patch capturing our mock as original

      window.onerror!('regular js error', '', 0, 0, undefined);
      expect(originalHandler).toHaveBeenCalled();
    });
  });

  // ─── WebSocket constructor patching ───────────────────────

  describe('WebSocket constructor patching', () => {
    it('replaces the WebSocket constructor', () => {
      const OriginalWS = window.WebSocket;
      blockAllWebSocketErrors();
      // The constructor has been replaced
      expect(window.WebSocket).toBeDefined();
      // Static constants are preserved
      expect((window.WebSocket as any).CONNECTING).toBe(OriginalWS.CONNECTING);
      expect((window.WebSocket as any).OPEN).toBe(OriginalWS.OPEN);
      expect((window.WebSocket as any).CLOSING).toBe(OriginalWS.CLOSING);
      expect((window.WebSocket as any).CLOSED).toBe(OriginalWS.CLOSED);
    });
  });

  // ─── unhandledrejection filtering ─────────────────────────

  describe('unhandledrejection filtering', () => {
    it('registers unhandledrejection listener without throwing', () => {
      expect(() => blockAllWebSocketErrors()).not.toThrow();
    });

    it('prevents default on WebSocket unhandled rejection', () => {
      blockAllWebSocketErrors();
      const event = new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.reject('WebSocket failed'),
        reason: 'WebSocket connection refused',
        cancelable: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('does not prevent default for non-WebSocket unhandled rejection', () => {
      blockAllWebSocketErrors();
      const event = new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.reject('DB query failed'),
        reason: 'Database connection error',
        cancelable: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
