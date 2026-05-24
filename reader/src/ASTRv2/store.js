// In-memory store with best-effort sessionStorage persistence.
// Memory is the source of truth; a failed write (e.g. iOS Safari quota) is ignored.

const memory = {};

export default {
  set(key, value) {
    memory[key] = value;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // persistence is best-effort; value still lives in memory
    }
  },

  get(key, fallback = null) {
    if (key in memory) {
      return memory[key];
    }
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        memory[key] = parsed;
        return parsed;
      }
    } catch (e) {
      // ignore access/parse errors
    }
    return fallback;
  },
};
