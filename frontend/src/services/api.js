/**
 * api.js — Backward-compatible re-export barrel.
 *
 * The actual logic has been split into domain-specific service files:
 *   - apiCore.js         → Axios instance + interceptors
 *   - authService.js     → Auth endpoints
 *   - homeService.js     → Home page endpoints
 *   - aboutService.js    → About page endpoints
 *   - productsService.js → Products page endpoints
 *   - partnersService.js → Partners page endpoints
 *   - ecoPhysicsService.js → ECO Physics brand endpoints
 *   - brandServices.js   → All other brand endpoints (AGC, AKAY, AVEVA, Bartec, Eaton, Emerson, Hach, Hitachi, Hyosung, Michell)
 *   - contactService.js  → Contact page endpoints
 *   - settingsService.js → Site settings endpoints
 *   - uploadService.js   → File upload endpoints
 *
 * New code should import directly from the relevant service file.
 * This barrel ensures existing imports from '../../services/api' keep working.
 */

export * from './authService';
export * from './footerService';
export * from './homeService';
export * from './aboutService';
export * from './productsService';
export * from './partnersService';
export * from './ecoPhysicsService';
export * from './brandServices';
export * from './contactService';
export * from './settingsService';
export * from './uploadService';

import API from './apiCore';
export default API;