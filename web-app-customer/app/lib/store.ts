"use client";

import type { CartItem, Order } from "./types";

interface RestaurantStore {
  tableNumber: string | null;
  cart: CartItem[];
  currentOrder: Order | null;
  favorites: string[];
  theme: "light" | "dark";
  token: string | null;
  sessionExpiresAt: number | null;
}

const STORAGE_KEY = "restaurant-store";
const TOKEN_KEY = "restaurant-token";
const SESSION_EXPIRY_KEY = "restaurant-session-expiry";

// Initialize store from localStorage
const getInitialState = (): RestaurantStore => {
  if (typeof window === "undefined") {
    return {
      tableNumber: null,
      cart: [],
      currentOrder: null,
      favorites: [],
      theme: "light",
      token: null,
      sessionExpiresAt: null,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (sessionExpiry && Number.parseInt(sessionExpiry) < Date.now()) {
      // Session expired, clear all session data
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      return {
        tableNumber: null,
        cart: [],
        currentOrder: null,
        favorites: [],
        theme: "light",
        token: null,
        sessionExpiresAt: null,
      };
    }

    const state = stored ? JSON.parse(stored) : null;
    return {
      ...(state || {
        tableNumber: null,
        cart: [],
        currentOrder: null,
        favorites: [],
        theme: "light",
      }),
      token: token || null,
      sessionExpiresAt: sessionExpiry ? Number.parseInt(sessionExpiry) : null,
    };
  } catch (error) {
    console.error("Failed to load store from localStorage:", error);
  }

  return {
    tableNumber: null,
    cart: [],
    currentOrder: null,
    favorites: [],
    theme: "light",
    token: null,
    sessionExpiresAt: null,
  };
};

const store = getInitialState();
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const persistStore = () => {
  if (typeof window !== "undefined") {
    try {
      const { token, sessionExpiresAt, ...storeData } = store;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }

      if (sessionExpiresAt) {
        localStorage.setItem(SESSION_EXPIRY_KEY, sessionExpiresAt.toString());
      } else {
        localStorage.removeItem(SESSION_EXPIRY_KEY);
      }
    } catch (error) {
      console.error("Failed to persist store:", error);
    }
  }
};

export const restaurantStore = {
  // Getters
  getState: () => store,
  getTableNumber: () => store.tableNumber,
  getCart: () => store.cart,
  getCurrentOrder: () => store.currentOrder,
  getFavorites: () => store.favorites,
  getTheme: () => store.theme,
  getToken: () => store.token,
  getSessionExpiresAt: () => store.sessionExpiresAt,
  isSessionValid: () => {
    if (!store.sessionExpiresAt) return false;
    return store.sessionExpiresAt > Date.now();
  },

  // Setters
  setTableNumber: (tableNumber: string) => {
    store.tableNumber = tableNumber;
    persistStore();
    notifyListeners();
  },

  addToCart: (item: CartItem) => {
    const existing = store.cart.find((ci) => ci.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      store.cart.push(item);
    }
    persistStore();
    notifyListeners();
  },

  toggleFavorite: (itemId: string) => {
    const index = store.favorites.indexOf(itemId);
    if (index > -1) {
      store.favorites.splice(index, 1);
    } else {
      store.favorites.push(itemId);
    }
    persistStore();
    notifyListeners();
  },

  isFavorite: (itemId: string) => {
    return store.favorites.includes(itemId);
  },

  removeFromCart: (itemId: string) => {
    store.cart = store.cart.filter((item) => item.id !== itemId);
    persistStore();
    notifyListeners();
  },

  updateCartItem: (itemId: string, quantity: number) => {
    const item = store.cart.find((ci) => ci.id === itemId);
    if (item) {
      item.quantity = quantity;
      persistStore();
      notifyListeners();
    }
  },

  clearCart: () => {
    store.cart = [];
    persistStore();
    notifyListeners();
  },

  getCartTotal: () => {
    return store.cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  },

  getCartItemCount: () => {
    return store.cart.reduce((count, item) => count + item.quantity, 0);
  },

  setCurrentOrder: (order: Order) => {
    store.currentOrder = order;
    persistStore();
    notifyListeners();
  },

  setTheme: (theme: "light" | "dark") => {
    store.theme = theme;
    persistStore();
    notifyListeners();
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  },

  setSession: (token: string, expiresAt: number) => {
    store.token = token;
    store.sessionExpiresAt = expiresAt;
    persistStore();
    notifyListeners();
  },

  clearSession: () => {
    store.token = null;
    store.sessionExpiresAt = null;
    store.tableNumber = null;
    store.cart = [];
    store.currentOrder = null;
    persistStore();
    notifyListeners();
  },

  resetSessionAfterPayment: () => {
    store.token = null;
    store.sessionExpiresAt = null;
    store.cart = [];
    store.currentOrder = null;
    // Keep table number and favorites
    persistStore();
    notifyListeners();
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// React hook wrapper
export function useRestaurantStore(selector: (state: RestaurantStore) => any) {
  const React = require("react");
  const [, setUpdate] = React.useState({});

  React.useEffect(() => {
    const unsubscribe = restaurantStore.subscribe(() => {
      setUpdate({});
    });
    return unsubscribe;
  }, []);

  return selector(restaurantStore.getState());
}
