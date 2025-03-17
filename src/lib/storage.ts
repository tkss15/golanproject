// A simple wrapper for localStorage with type safety and error handling

/**
 * Set an item in localStorage with error handling
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error setting localStorage item '${key}':`, error);
    return false;
  }
};

/**
 * Get an item from localStorage with error handling and type casting
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage item '${key}':`, error);
    return defaultValue;
  }
};

/**
 * Remove an item from localStorage with error handling
 */
export const removeStorageItem = (key: string): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error removing localStorage item '${key}':`, error);
    return false;
  }
};