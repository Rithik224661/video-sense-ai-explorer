
/**
 * Supabase Type-Safe Library
 * 
 * This module provides a type-safe interface for working with Supabase data.
 * It includes custom types, type guards, adapters, validators, and query functions.
 */

// Export custom types
export * from './custom-types';

// Export type guards
export * from './type-guards';

// Export adapters
export { toEnhancedLead, toEnhancedLeads } from './adapters/lead-adapter';
export { toVideoAnalysisData, fromVideoAnalysisData } from './adapters/video-analysis-adapter';

// Export validators
export * from './validators';

// Export queries
export * from './queries';
