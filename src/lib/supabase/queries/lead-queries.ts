
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
 * Using a simplified approach to avoid excessive type instantiation
 */
export async function getLeads(options?: LeadsQueryOptions): Promise<EnhancedLead[]> {
  // Build query parameters to avoid chaining method calls
  const queryParams: {
    table: string;
    select: string;
    filters: Array<{column: string; value: any}>;
    orderBy?: {column: string; ascending: boolean};
    pagination?: {limit?: number; offset?: number};
  } = {
    table: 'leads',
    select: '*',
    filters: []
  };
  
  // Add filters if provided
  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null) {
        queryParams.filters.push({column: key, value});
      }
    }
  }
  
  // Add sorting if provided
  if (options?.sortBy) {
    queryParams.orderBy = {
      column: options.sortBy,
      ascending: options.sortOrder !== 'desc'
    };
  }
  
  // Add pagination if provided
  if (options?.limit || options?.offset) {
    queryParams.pagination = {
      limit: options?.limit,
      offset: options?.offset
    };
  }
  
  // Execute the query using the query parameters
  // This approach avoids deep method chaining that causes type recursion
  let query = supabase.from(queryParams.table).select(queryParams.select);
  
  // Apply filters
  for (const filter of queryParams.filters) {
    query = query.eq(filter.column, filter.value);
  }
  
  // Apply sorting
  if (queryParams.orderBy) {
    query = query.order(queryParams.orderBy.column, {
      ascending: queryParams.orderBy.ascending
    });
  }
  
  // Apply pagination
  if (queryParams.pagination?.limit) {
    query = query.limit(queryParams.pagination.limit);
  }
  
  if (queryParams.pagination?.offset) {
    const start = queryParams.pagination.offset;
    const end = start + (queryParams.pagination.limit || 10) - 1;
    query = query.range(start, end);
  }
  
  // Execute the final query
  const { data, error } = await query;
  
  if (error || !data) {
    console.error('Error fetching leads:', error);
    return [];
  }
  
  try {
    // Use a type assertion and avoid complex type inference
    const typedData = data as unknown as Lead[];
    // Process each lead separately to avoid chained type inference
    const validatedLeads: Lead[] = [];
    for (const lead of typedData) {
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
