// src/utils/storage.js
export const setToken = (name,token) => localStorage.setItem(name, token);
export const getToken = (name) => localStorage.getItem(name);
export const removeToken = (name) => localStorage.removeItem(name);
