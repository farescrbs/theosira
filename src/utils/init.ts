/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THESORIA - PRÉ-INITIALISATION GLOBALE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce fichier est chargé EN PREMIER, AVANT tout le reste de l'application.
 * Il initialise les protections globales et les configurations critiques.
 */

// ═══════════════════════════════════════════════════════════════════════════
// BLOQUER TOUTES LES ERREURS WEBSOCKET AU NIVEAU NAVIGATEUR
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';
  
  console.log('🛡️ [THESORIA] Initialisation de la protection WebSocket globale...');
  
  // ─────────────────────────────────────────────────────────────────────────
  // NIVEAU 0 : Intercepter le constructeur WebSocket
  // ─────────────────────────────────────────────────────────────────────────
  
  if (typeof WebSocket !== 'undefined') {
    const OriginalWebSocket = WebSocket;
    
    (window as any).WebSocket = function(url: string, protocols?: string | string[]) {
      const ws = new OriginalWebSocket(url, protocols);
      
      // Empêcher toutes les erreurs par défaut
      ws.addEventListener('error', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        }
      }, { capture: true });
      
      return ws;
    };
    
    // Copier les propriétés statiques
    (window as any).WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    (window as any).WebSocket.OPEN = OriginalWebSocket.OPEN;
    (window as any).WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    (window as any).WebSocket.CLOSED = OriginalWebSocket.CLOSED;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // NIVEAU 1 : Bloquer window.onerror
  // ─────────────────────────────────────────────────────────────────────────
  
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    const msg = String(message).toLowerCase();
    if (
      msg.includes('websocket') ||
      msg.includes('ws://') ||
      msg.includes('wss://') ||
      msg.includes('econnrefused') ||
      msg.includes('net::err')
    ) {
      return true; // Bloquer
    }
    
    return originalOnError ? originalOnError.call(window, message, source, lineno, colno, error) : false;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // NIVEAU 2 : Intercepter addEventListener
  // ─────────────────────────────────────────────────────────────────────────
  
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  EventTarget.prototype.addEventListener = function(type: string, listener: any, options?: any) {
    if (type === 'error') {
      const wrappedListener = function(event: any) {
        // Bloquer les erreurs WebSocket
        if (event && event.target) {
          const target = event.target;
          const isWebSocket = 
            (target.constructor && target.constructor.name === 'WebSocket') ||
            (target.url && typeof target.url === 'string' && target.url.startsWith('ws'));
          
          if (isWebSocket) {
            if (event.preventDefault) event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
            return false;
          }
        }
        
        // Appeler le listener original pour les autres erreurs
        if (typeof listener === 'function') {
          return listener.call(this, event);
        } else if (listener && typeof listener.handleEvent === 'function') {
          return listener.handleEvent(event);
        }
      };
      
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // NIVEAU 3 : Filtrer console.error
  // ─────────────────────────────────────────────────────────────────────────
  
  const originalConsoleError = console.error;
  
  console.error = function(...args: any[]) {
    const argsStr = args.map(arg => {
      try {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      } catch {
        return '';
      }
    }).join(' ').toLowerCase();
    
    // Bloquer les erreurs WebSocket
    if (
      argsStr.includes('websocket') ||
      argsStr.includes('ws://') ||
      argsStr.includes('wss://') ||
      argsStr.includes('istrusted') ||
      argsStr.includes('econnrefused')
    ) {
      return; // Ne rien afficher
    }
    
    originalConsoleError.apply(console, args);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // NIVEAU 4 : Filtrer console.warn
  // ─────────────────────────────────────────────────────────────────────────
  
  const originalConsoleWarn = console.warn;
  
  console.warn = function(...args: any[]) {
    const argsStr = args.map(arg => String(arg)).join(' ').toLowerCase();
    
    if (argsStr.includes('websocket') || argsStr.includes('ws://')) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // NIVEAU 5 : Bloquer unhandledrejection
  // ─────────────────────────────────────────────────────────────────────────
  
  window.addEventListener('unhandledrejection', (event) => {
    const reason = String(event.reason || '').toLowerCase();
    
    if (
      reason.includes('websocket') ||
      reason.includes('ws://') ||
      reason.includes('econnrefused')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, { capture: true });
  
  console.log('✅ [THESORIA] Protection WebSocket activée - Erreurs bloquées au niveau navigateur');
  
})();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS (pour import dans d'autres modules)
// ═══════════════════════════════════════════════════════════════════════════

export const websocketProtectionEnabled = true;
