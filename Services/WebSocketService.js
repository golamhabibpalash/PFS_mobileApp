import {AppState} from 'react-native';

const DEFAULT_RECONNECT_BASE_MS = 1000;
const DEFAULT_RECONNECT_MAX_MS = 30000;
const MAX_RECONNECT_ATTEMPTS = 10;

class WebSocketManager {
  constructor() {
    this.ws = null;
    this.pollTimer = null;
    this.reconnectTimer = null;
    this.appStateSubscription = null;
    this.config = null;
    this.attempts = 0;
    this.isDestroyed = false;
    this.isBackground = false;
    this.isFallbackActive = false;
  }

  connect(config) {
    this.config = config;
    this.isDestroyed = false;
    this._startAppStateListener();
    this._tryWebSocket();
  }

  _tryWebSocket() {
    if (!this.config?.wsUrl || this.isDestroyed || this.isBackground) {
      if (!this.isFallbackActive) {
        this._startFallbackPolling();
      }
      return;
    }

    try {
      this.ws = new WebSocket(this.config.wsUrl);
      this.ws.onopen = () => this._onOpen();
      this.ws.onmessage = e => this._onMessage(e);
      this.ws.onerror = () => this._onClose();
      this.ws.onclose = () => this._onClose();
    } catch {
      this._onClose();
    }
  }

  _onOpen() {
    this.attempts = 0;
    this._stopFallbackPolling();
    this.config?.onStatusChange?.('connected');
  }

  _onMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.config?.onMessage?.(data);
    } catch {
      this.config?.onMessage?.({raw: event.data});
    }
  }

  _onClose() {
    this.ws = null;
    if (this.isDestroyed || this.isBackground) {
      return;
    }

    if (this.attempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(
        DEFAULT_RECONNECT_BASE_MS * Math.pow(2, this.attempts),
        DEFAULT_RECONNECT_MAX_MS,
      );
      this.attempts++;
      this.config?.onStatusChange?.('reconnecting');
      this.reconnectTimer = setTimeout(() => this._tryWebSocket(), delay);
    } else {
      this._startFallbackPolling();
    }
  }

  _startFallbackPolling() {
    if (this.isFallbackActive || !this.config?.fallbackPollingFn) {
      return;
    }
    this.isFallbackActive = true;
    this.config.onStatusChange?.('fallback');
    this.config.fallbackPollingFn();
    this.pollTimer = setInterval(
      this.config.fallbackPollingFn,
      this.config.fallbackIntervalMs || 15000,
    );
  }

  _stopFallbackPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.isFallbackActive = false;
  }

  _startAppStateListener() {
    if (this.appStateSubscription) {
      return;
    }
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextState => {
        if (nextState === 'active') {
          this.isBackground = false;
          this._tryWebSocket();
        } else if (nextState === 'background') {
          this.isBackground = true;
          this.disconnect();
        }
      },
    );
  }

  disconnect() {
    this.isDestroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this._stopFallbackPolling();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  destroy() {
    this.disconnect();
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    this.config = null;
  }
}

export default new WebSocketManager();
