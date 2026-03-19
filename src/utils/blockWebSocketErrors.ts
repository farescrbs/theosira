/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOQUEUR TOTAL D'ERREURS WEBSOCKET
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Empêche TOUTE erreur WebSocket d'apparaître dans la console, peu importe
 * comment elle est déclenchée.
 */

export function blockAllWebSocketErrors() {
  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU 0 : Intercepter WebSocket au niveau constructeur
  // ═══════════════════════════════════════════════════════════════════════════
  
  const OriginalWebSocket = window.WebSocket;
  
  (window as any).WebSocket = function(url: string, protocols?: string | string[]) {
    const ws = new OriginalWebSocket(url, protocols);
    
    // Supprimer tous les event listeners d'erreur par défaut
    ws.addEventListener('error', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      // Ne rien faire - erreur silencieuse
    }, true);
    
    return ws;
  };
  
  // Copier les propriétés statiques
  (window as any).WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
  (window as any).WebSocket.OPEN = OriginalWebSocket.OPEN;
  (window as any).WebSocket.CLOSING = OriginalWebSocket.CLOSING;
  (window as any).WebSocket.CLOSED = OriginalWebSocket.CLOSED;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU 1 : Bloquer window.onerror global
  // ═══════════════════════════════════════════════════════════════════════════
  
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    // Bloquer toutes les erreurs liées à WebSocket
    const messageStr = String(message).toLowerCase();
    if (
      messageStr.includes('websocket') ||
      messageStr.includes('ws://') ||
      messageStr.includes('wss://') ||
      (messageStr.includes('connection') && messageStr.includes('failed')) ||
      messageStr.includes('econnrefused') ||
      messageStr.includes('net::err')
    ) {
      return true; // Empêcher l'erreur de se propager
    }
    
    // Laisser passer les autres erreurs
    if (originalOnError) {
      return originalOnError.call(window, message, source, lineno, colno, error);
    }
    return false;
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU 2 : Bloquer addEventListener('error') global
  // ═══════════════════════════════════════════════════════════════════════════
  
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  EventTarget.prototype.addEventListener = function(type: string, listener: any, options?: any) {
    if (type === 'error') {
      // Wrapper qui filtre les erreurs WebSocket
      const wrappedListener = function(event: any) {
        if (event && event.target) {
          const target = event.target;
          // Vérifier si c'est un WebSocket
          if (
            target instanceof OriginalWebSocket ||
            (target.constructor && target.constructor.name === 'WebSocket') ||
            (target.url && target.url.startsWith('ws'))
          ) {
            // Bloquer complètement l'événement
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
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU 3 : Bloquer console.error pour WebSocket
  // ═══════════════════════════════════════════════════════════════════════════
  
  const originalConsoleError = console.error.bind(console);
  
  console.error = function(...args: any[]) {
    // Vérifier si c'est une erreur WebSocket
    const argsStr = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ').toLowerCase();
    
    if (
      argsStr.includes('websocket') ||
      argsStr.includes('ws://') ||
      argsStr.includes('wss://') ||
      argsStr.includes('connection failed') ||
      argsStr.includes('connection error') ||
      argsStr.includes('econnrefused') ||
      argsStr.includes('net::err') ||
      argsStr.includes('istrusted')
    ) {
      return; // Ne rien afficher
    }
    
    // Afficher les autres erreurs normalement
    originalConsoleError.apply(console, args);
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU 4 : Bloquer console.warn pour WebSocket
  // ═══════════════════════════════════════════════════════════════════════════
  
  const originalConsoleWarn = console.warn.bind(console);
  
  console.warn = function(...args: any[]) {
    const argsStr = args.map(arg => String(arg)).join(' ').toLowerCase();
    
    if (
      argsStr.includes('websocket') ||
      argsStr.includes('ws://') ||
      argsStr.includes('wss://')
    ) {
      return; // Ne rien afficher
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU 5 : Bloquer unhandledrejection pour WebSocket
  // ═══════════════════════════════════════════════════════════════════════════
  
  window.addEventListener('unhandledrejection', (event) => {
    const reason = String(event.reason).toLowerCase();
    if (
      reason.includes('websocket') ||
      reason.includes('ws://') ||
      reason.includes('wss://') ||
      reason.includes('econnrefused')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  
  console.log('🛡️ Protection WebSocket MAXIMALE activée - Aucune erreur ne sera affichée');
}