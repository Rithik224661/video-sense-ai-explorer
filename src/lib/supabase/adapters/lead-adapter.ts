
import { Lead, EnhancedLead } from '../custom-types';

/**
 * Transforms a Lead into an EnhancedLead with derived properties
 * @param lead - The lead object from the database
 * @returns An enhanced lead with additional properties
 */
export const toEnhancedLead = (lead: Lead): EnhancedLead => {
  // Calculate derived properties
  const displayName = lead.name;
  
  // Determine validation status based on validation issues
  let validationStatus: 'valid' | 'warning' | 'error' = 'valid';
  if (lead.validation_issues) {
    const issues = typeof lead.validation_issues === 'string' 
      ? JSON.parse(lead.validation_issues) 
      : lead.validation_issues;
      
    if (Array.isArray(issues) && issues.length > 0) {
      validationStatus = issues.some(issue => issue.severity === 'error') 
        ? 'error' 
        : 'warning';
    }
  }
  
  // Map priority string to numeric level
  let priorityLevel = 0;
  switch (lead.priority?.toLowerCase()) {
    case 'high':
      priorityLevel = 3;
      break;
    case 'medium':
      priorityLevel = 2;
      break;
    case 'low':
      priorityLevel = 1;
      break;
  }
  
  return {
    ...lead,
    displayName,
    validationStatus,
    priorityLevel
  };
};

/**
 * Transforms an array of Leads into EnhancedLeads
 * @param leads - Array of lead objects from the database
 * @returns Array of enhanced leads with additional properties
 */
export const toEnhancedLeads = (leads: Lead[]): EnhancedLead[] => {
  return leads.map(toEnhancedLead);
};
