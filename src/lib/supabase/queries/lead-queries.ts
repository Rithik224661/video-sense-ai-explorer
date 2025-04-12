
import { supabase } from "@/integrations/supabase/client";
import { Lead, EnhancedLead, LeadCreate, LeadUpdate } from '../custom-types';
import { toEnhancedLead, toEnhancedLeads } from '../adapters/lead-adapter';
import { validateLead, validateLeadCreate, validateLeadUpdate } from '../validators';

/**
 * Get a lead by ID
 * @param id - The lead ID to fetch
 * @returns Promise with the enhanced lead or null
 */
export async function getLead(id: string): Promise<EnhancedLead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !data) return null;
  
  try {
    const validatedLead = validateLead(data);
    return toEnhancedLead(validatedLead);
  } catch (err) {
    console.error('Lead validation error:', err);
    return null;
  }
}

// Define a specific type for the filter options to avoid deep type nesting
type LeadsQueryOptions = {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
};

/**
 * Get all leads with optional filtering and sorting
 * Completely refactored to avoid type instantiation depth issues
 */
export async function getLeads(options?: LeadsQueryOptions): Promise<EnhancedLead[]> {
  try {
    // Execute a simple query and handle filters manually
    const { data, error } = await supabase
      .from('leads')
      .select('*');
    
    if (error) throw error;
    if (!data || !Array.isArray(data)) return [];
    
    // Cast data to Lead[] to avoid type inference issues
    const allLeads = data as any[] as Lead[];
    
    // Apply filters in memory
    let filteredLeads = [...allLeads];
    
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== null) {
          filteredLeads = filteredLeads.filter(lead => lead[key as keyof Lead] === value);
        }
      }
    }
    
    // Apply sorting in memory
    if (options?.sortBy) {
      const sortKey = options.sortBy as keyof Lead;
      const sortDir = options.sortOrder === 'desc' ? -1 : 1;
      
      filteredLeads.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return sortDir;
        if (valB === null || valB === undefined) return -sortDir;
        
        return valA < valB ? -sortDir : sortDir;
      });
    }
    
    // Apply pagination in memory
    if (options?.limit || options?.offset) {
      const offset = options.offset || 0;
      const limit = options.limit || 10;
      filteredLeads = filteredLeads.slice(offset, offset + limit);
    }
    
    // Validate each lead separately
    const validatedLeads: Lead[] = [];
    for (const lead of filteredLeads) {
      try {
        validatedLeads.push(validateLead(lead));
      } catch (err) {
        console.error('Individual lead validation error:', err);
      }
    }
    
    return toEnhancedLeads(validatedLeads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    return [];
  }
}

/**
 * Create a new lead
 * @param lead - The lead data to create
 * @returns Promise with the created lead ID or null on error
 */
export async function createLead(lead: LeadCreate): Promise<string | null> {
  try {
    const validatedData = validateLeadCreate(lead);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(validatedData)
      .select('id')
      .single();
      
    if (error || !data) {
      console.error('Create lead error:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Lead create validation error:', err);
    return null;
  }
}

/**
 * Update an existing lead
 * @param lead - The lead data to update (must include id)
 * @returns Promise with success boolean
 */
export async function updateLead(lead: LeadUpdate): Promise<boolean> {
  try {
    const validatedData = validateLeadUpdate(lead);
    const { id, ...updateData } = validatedData;
    
    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id);
      
    return !error;
  } catch (err) {
    console.error('Lead update validation error:', err);
    return false;
  }
}

/**
 * Delete a lead by ID
 * @param id - The lead ID to delete
 * @returns Promise with success boolean
 */
export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
    
  return !error;
}
