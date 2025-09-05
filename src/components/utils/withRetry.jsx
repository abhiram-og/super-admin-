// Enhanced global throttling and 429 handling
let __currentRunning = 0;
const __queue = [];

async function __acquireSlot(maxConcurrent = 1) {
  if (__currentRunning < maxConcurrent) {
    __currentRunning++;
    return;
  }
  await new Promise((resolve) => __queue.push(resolve));
  __currentRunning++;
}

function __releaseSlot() {
  __currentRunning = Math.max(0, __currentRunning - 1);
  const next = __queue.shift();
  if (next) next();
}

function __sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function withRetry(fn, options = {}) {
  const {
    retries = 4,
    baseDelay = 1000,   // increased base delay
    maxDelay = 15000,   // higher ceiling
    jitter = true,
    maxConcurrent = 1,  // default to strictly sequential globally
    initialStagger = true,
  } = options;

  let lastError;

  await __acquireSlot(maxConcurrent);
  if (initialStagger) {
    await __sleep(80 + Math.floor(Math.random() * 200)); // slightly larger initial jitter
  }

  try {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (e) {
        lastError = e;
        const status = e?.response?.status || e?.status || e?.code || null;
        const msg = String(e?.message || "");
        const retryAfterHeader = e?.response?.headers?.['retry-after'] || e?.response?.headers?.['Retry-After'];
        const retryAfterMs = retryAfterHeader
          ? (() => {
              const v = Number(retryAfterHeader);
              if (!Number.isNaN(v)) return v * 1000; // header often in seconds
              // Try to parse HTTP-date
              const t = Date.parse(retryAfterHeader);
              if (!Number.isNaN(t)) return Math.max(0, t - Date.now());
              return null;
            })()
          : null;

        const isRateLimited =
          status === 429 ||
          /429/.test(msg) ||
          /too many requests/i.test(msg);

        if (!isRateLimited || attempt === retries) {
          throw e;
        }

        // Respect server-provided Retry-After when present
        if (retryAfterMs && retryAfterMs > 0) {
          await __sleep(retryAfterMs);
          continue;
        }

        // Exponential backoff with jitter
        const backoff = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        const wait = jitter ? Math.round(backoff * (0.7 + Math.random() * 0.6)) : backoff;
        await __sleep(wait);
      }
    }
    throw lastError;
  } finally {
    __releaseSlot();
  }
}

export default withRetry;