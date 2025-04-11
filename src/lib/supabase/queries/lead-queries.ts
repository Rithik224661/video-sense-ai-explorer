
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

/**
 * Get all leads with optional filtering and sorting
 * @param options - Query options for filtering and sorting
 * @returns Promise with an array of enhanced leads
 */
export async function getLeads(options?: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}): Promise<EnhancedLead[]> {
  let query = supabase.from('leads').select('*');
  
  // Apply filters explicitly without chaining
  if (options?.filters) {
    const filters = options.filters;
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null) {
        // Apply each filter individually to avoid deep type instantiation
        query = query.eq(key, value);
      }
    });
  }
  
  // Apply sorting without complex chains
  if (options?.sortBy) {
    const order = options?.sortOrder === 'desc' ? false : true;
    query = query.order(options.sortBy, { ascending: order });
  }
  
  // Apply pagination directly
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
    const validatedLeads = data.map(lead => validateLead(lead));
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
