
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
 * Using a simplified approach without excessive method chaining
 */
export async function getLeads(options?: LeadsQueryOptions): Promise<EnhancedLead[]> {
  // Start with the base query
  let query = supabase.from('leads').select('*');
  
  // Apply filters if provided
  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }
  
  // Apply sorting if provided
  if (options?.sortBy) {
    query = query.order(options.sortBy, { 
      ascending: options.sortOrder !== 'desc' 
    });
  }
  
  // Apply pagination if provided
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    const start = options.offset;
    const end = start + (options.limit || 10) - 1;
    query = query.range(start, end);
  }
  
  // Execute the query
  const { data, error } = await query;
  
  if (error || !data) {
    console.error('Error fetching leads:', error);
    return [];
  }
  
  try {
    // Process each lead separately to avoid chained type inference
    const validatedLeads: Lead[] = [];
    
    // Use type assertion to help TypeScript understand the data structure
    const leadsData = data as Lead[];
    
    for (const lead of leadsData) {
      try {
        validatedLeads.push(validateLead(lead));
      } catch (err) {
        console.error('Individual lead validation error:', err);
      }
    }
    
    return toEnhancedLeads(validatedLeads);
  } catch (err) {
    console.error('Leads validation error:', err);
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
