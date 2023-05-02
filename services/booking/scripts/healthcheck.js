/**
 * Description: Healthcheck script for the booking service used by Docker
 * to determine if the service is healthy or not.
 *
 * Usage: node healthcheck.js <host> <port>
 * Example: node healthcheck.js localhost 3000
 *
 */

/**
 * The no-process-exit rule is disabled since the exit code is required by the
 * healthcheck command
 */

/* eslint-disable no-process-exit */

const http = require('http');
const options = {
  host: `${process.argv[2]}`,
  port: parseInt(process.argv[3]),
  timeout: 5000,
  path: '/health',
};

// Make the request
const healthCheck = http.request(options, res => {
  console.log(`HEALTHCHECK STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) process.exit(0);
  process.exit(1);
});

// Handle errors
healthCheck.on('error', err => {
  console.error(`HEALTHCHECK ERROR: ${err.message}`);
  process.exit(1);
});

// End the request
healthCheck.end();
