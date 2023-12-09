const axiosRetry = require('axios-retry').default;
const axios = require('axios');
const CircuitBreaker = require('opossum');
const Agent = require('agentkeepalive');

const { exponentialDelay } = axiosRetry;

const { HttpStatusCode } = axios;

const TIMEOUT_DEFAULT = 2000;
const RESET_TIMEOUT_CIRCUIT_BREAKER = 15000;
const ERROR_THRESHOLD_PERCENT_CIRCUIT_BREAKER = 25;
const MAX_SOCKETS = 100;
const MAX_FREE_SOCKET = 10;
const TIME_OUT_KEEP_ALIVE = 60000;
const FREE_SOCKET_TIMEOUT = 30000;

/**
 * HTTPClient wrapper to handle any request using axios, axios-retry, agentkeepalive and opossum
 * - Support retries
 * - Support circuit breaker mechanism
 * - Support keep alive connections for node env
 */
class HTTPClient {
  constructor({ retries = 0, ...config } = {}) {
    const axiosInstance = axios.create({
      timeout: TIMEOUT_DEFAULT,
      ...config,
    });

    if (this.isNodeEnvironment()) {
      axiosInstance.defaults.httpAgent = new Agent({
        maxSockets: MAX_SOCKETS,
        maxFreeSockets: MAX_FREE_SOCKET,
        timeout: TIME_OUT_KEEP_ALIVE,
        freeSocketTimeout: FREE_SOCKET_TIMEOUT,
      });

      axiosInstance.defaults.httpsAgent = new Agent.HttpsAgent({
        maxSockets: MAX_SOCKETS,
        maxFreeSockets: MAX_FREE_SOCKET,
        timeout: TIME_OUT_KEEP_ALIVE,
        freeSocketTimeout: FREE_SOCKET_TIMEOUT,
      });
    }

    axiosRetry(axiosInstance, {
      retries,
      retryDelay: exponentialDelay,
    });

    this.httpClient = axiosInstance;
  }

  /**
   * Create a circuit breaker to wrap any callback to handle
   * Example:
   * - Create the circuit breaker for the endpoint that you need to handle
   * - Use the 'fire' method to execute the call with the circuit
   * - Use the 'fallback' method to handle any fallback for the current endpoint
   * - More info in https://nodeshift.dev/opossum
   * @param {Function} callback
   * @param {Object} options
   * @returns CircuitBreaker
   */
  static createCircuitBreaker(callback, options = {}) {
    return new CircuitBreaker(callback, {
      resetTimeout: RESET_TIMEOUT_CIRCUIT_BREAKER,
      errorThresholdPercentage: ERROR_THRESHOLD_PERCENT_CIRCUIT_BREAKER,
      errorFilter: (err) =>
        err.status === HttpStatusCode.Forbidden ||
        err.status === HttpStatusCode.Unauthorized,
      ...options,
    });
  }

  /**
   * Create an AbortController to use to cancel a request
   * Example:
   *  - Create the abort controller
   *  - Pass the property signal to the current endpoint signal: controller
   *  - Abort the request with controller.abort()
   *  - More info in https://axios-http.com/docs/cancellation
   * @returns AbortController
   */
  static createAbortController() {
    return new AbortController();
  }

  /**
   * Helper to validate if the current code is running in Node.js
   * @returns boolean
   */
  static isNodeEnvironment() {
    return !(typeof window !== 'undefined' && typeof document !== 'undefined');
  }
}

module.exports = HTTPClient;
