/**
 * Exness Partner Configuration
 * 
 * DEPRECATED: These constants are now read from environment variables.
 * This file maintains backwards compatibility but will be removed in future versions.
 * 
 * Migration: Use import.meta.env.VITE_* variables instead of these constants.
 */

// Exness Partner Configuration - now reads from env with fallbacks
export const PARTNER_ID = import.meta.env.VITE_PARTNER_ID || "1141465940423171000";
export const PARTNER_LINK = import.meta.env.VITE_PARTNER_LINK || "https://one.exnesstrack.org/boarding/sign-up/303589/a/nvle22j1te?lng=es";

// API Endpoints - now reads from env with fallbacks  
export const EXNESS_AUTH_URL = import.meta.env.VITE_EXNESS_AUTH_URL || "https://my.exnessaffiliates.com/api/v2/auth/";
export const EXNESS_AFFILIATION_URL = import.meta.env.VITE_EXNESS_AFFILIATION_URL || "https://my.exnessaffiliates.com/api/partner/affiliation/";