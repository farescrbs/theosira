/**
 * Patch global du WebSocket pour supprimer TOUTES les erreurs de la console
 * 
 * Cette fonction remplace le constructeur WebSocket natif pour intercepter
 * et supprimer les erreurs avant qu'elles n'atteignent la console.
 */

export function patchWebSocket() {
  // Sauvegarder le constructeur WebSocket original
  const OriginalWebSocket = window.WebSocket;
  
  // Créer un nouveau constructeur WebSocket
  (window as any).WebSocket = function(url: string, protocols?: string | string[]) {
    // Créer instance WebSocket avec constructeur original
    const ws = new OriginalWebSocket(url, protocols);
    
    // Intercepter TOUTES les erreurs
    const originalAddEventListener = ws.addEventListener.bind(ws);
    ws.addEventListener = function(type: string, listener: any, options?: any) {
      if (type === 'error') {
        // Remplacer le listener d'erreur par un listener silencieux
        const silentListener = (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          // Ne pas appeler le listener original pour les erreurs WebSocket
          return false;
        };
        return originalAddEventListener('error', silentListener, options);
      }
      return originalAddEventListener(type, listener, options);
    };
    
    // Intercepter onerror
    Object.defineProperty(ws, 'onerror', {
      set: function(handler) {
        // Ne rien faire - ignorer complètement
      },
      get: function() {
        return null;
      }
    });
    
    return ws;
  };
  
  // Copier les propriétés statiques
  (window as any).WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
  (window as any).WebSocket.OPEN = OriginalWebSocket.OPEN;
  (window as any).WebSocket.CLOSING = OriginalWebSocket.CLOSING;
  (window as any).WebSocket.CLOSED = OriginalWebSocket.CLOSED;
  
  // Copier le prototype
  (window as any).WebSocket.prototype = OriginalWebSocket.prototype;
}
