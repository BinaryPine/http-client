# HTTPClient

HTTPClient is a wrapper utilizing `axios`, `axios-retry`, `agentkeepalive`, and `opossum` to facilitate handling requests in Node.js environments. This package offers:

- **Retry Mechanism:** Support for retries on failed requests using `axios-retry`.
- **Circuit Breaker:** Implementation of a circuit breaker pattern to handle endpoint failures gracefully using `opossum`.
- **Keep-Alive Connections:** Utilization of `agentkeepalive` for managing keep-alive connections in Node.js.

## Installation

To use the HTTPClient in your Node.js project, install it via npm:

```bash
npm i @binarypine/http-client
```

## Configuration Options

- retries: Number of retries for failed requests (default: 0)
- Additional axios configurations can be passed during initialization.

For more information on each library's functionalities and options, refer to their respective documentation:

- axios
- axios-retry
- opossum
- agentkeepalive

## Usage

### Initialization

```js
const HTTPClient = require('HTTPClient');

// Using a basic implementation
const client = new HTTPClient({
  retries: 1 /* ...additional configurations */,
});

// Extending the Class
class GifsAPI extends HttpClient {}
```

### Circuit Breaker

Create a circuit breaker to wrap endpoints and handle failures:

```js
const circuit = HTTPClient.createCircuitBreaker(() => {
  // Callback
});

circuit.fallback(() => {
  // Fallback logic when the circuit is open or the endpoint fails
});

// Execute the callback with the circuit
circuit.fire();
```

### Retry and Abort Controller

You can use the built-in retry mechanism and abort controller:

```js
const controller = HTTPClient.createAbortController();

// Use the controller.signal property to cancel requests
// To cancel the request: controller.abort()
```

## Contributors

Feel free to contribute, report issues, or suggest improvements by opening an issue or a pull request!
