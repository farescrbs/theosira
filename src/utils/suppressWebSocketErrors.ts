/**
 * Utilitaire pour supprimer les erreurs WebSocket de la console
 * 
 * Les erreurs WebSocket sont normales quand le backend Python n'est pas lancé.
 * Cet utilitaire les supprime pour éviter la pollution de la console.
 */

let isSuppressionActive = false;
let originalConsoleError: any = null;

export function suppressWebSocketErrors() {
  if (isSuppressionActive) return;
  
  // Sauvegarder console.error original
  originalConsoleError = console.error;
  
  // Remplacer console.error
  console.error = function(...args: any[]) {
    // Convertir tous les arguments en string pour analyse
    const errorString = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return String(arg);
    }).join(' ').toLowerCase();
    
    // Liste complète de patterns à filtrer
    const wsPatterns = [
      'websocket',
      'ws://',
      'wss://',
      'connection failed',
      'econnrefused',
      'net::err_connection_refused',
      'failed to construct',
      'connection closed',
      'connection error',
      'localhost:8765',
      ':8765'
    ];
    
    // Vérifier si l'erreur correspond à un pattern WebSocket
    const isWebSocketError = wsPatterns.some(pattern => 
      errorString.includes(pattern.toLowerCase())
    );
    
    // Si c'est une erreur WebSocket, ne rien afficher
    if (isWebSocketError) {
      return;
    }
    
    // Appeler console.error original pour les autres erreurs
    if (originalConsoleError) {
      originalConsoleError.apply(console, args);
    }
  };
  
  // Aussi intercepter les erreurs globales non capturées
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const errorStr = String(message).toLowerCase();
    const wsPatterns = ['websocket', 'ws://', 'localhost:8765', ':8765'];
    
    if (wsPatterns.some(pattern => errorStr.includes(pattern))) {
      return true; // Supprime l'erreur
    }
    
    // Appeler le handler original
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }
    return false;
  };
  
  isSuppressionActive = true;
}

export function restoreConsoleError() {
  if (originalConsoleError) {
    console.error = originalConsoleError;
    originalConsoleError = null;
  }
  isSuppressionActive = false;
}