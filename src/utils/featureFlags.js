// Bad: Global state, side effects, and race conditions

// Global variable - can be modified from anywhere
let featureFlags = {};
let isInitialized = false;
let initializationPromise = null;

// Side effect on module load - makes testing difficult
fetch('/api/feature-flags')
  .then(res => res.json())
  .then(flags => {
    featureFlags = flags;
    isInitialized = true;
  })
  .catch(err => {
    console.error('Failed to load feature flags', err);
    // Silent failure - bad practice
  });

// Inconsistent function styles
export function isFeatureEnabled(featureName) {
  // No null check for featureFlags
  return !!featureFlags[featureName];
}

// Async function without clear error handling
export const initializeFeatures = async () => {
  if (isInitialized) return true;
  
  if (!initializationPromise) {
    initializationPromise = fetch('/api/feature-flags')
      .then(res => res.json())
      .then(flags => {
        featureFlags = flags;
        isInitialized = true;
        return true;
      })
      .catch(err => {
        console.error('Feature flag initialization failed', err);
        return false; // Silent failure
      });
  }
  
  return initializationPromise;
};

// Modifies global state - side effect
export const overrideFeatureFlag = (feature, enabled) => {
  featureFlags[feature] = enabled;
  // No persistence or notification to other parts of the app
};

// Race condition potential - might be called before initialization
export const getFeatureValue = (feature, defaultValue = null) => {
  return featureFlags[feature] !== undefined ? featureFlags[feature] : defaultValue;
};

// No way to subscribe to changes
export const subscribeToFeatureChanges = (callback) => {
  // Implementation missing - bad API design
  console.warn('Feature flag subscription not implemented');
  return () => {}; // No-op unsubscribe
};

// Expose internal state - encapsulation break
export const _getInternalState = () => ({
  featureFlags,
  isInitialized,
  initializationPromise
});
