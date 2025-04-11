
import { supabase } from "@/integrations/supabase/client";
import { 
  Lead, EnhancedLead, LeadCreate, LeadUpdate
} from './custom-types';
import { toEnhancedLead, toEnhancedLeads } from './adapters/lead-adapter';
import { 
  validateLead, validateLeadCreate, validateLeadUpdate,
  validateVideoAnalysisCreate 
} from './validators';
import { VideoAnalysisData } from '@/lib/types';
import { fromVideoAnalysisData, toVideoAnalysisData } from './adapters/video-analysis-adapter';

/**
 * Lead queries
 */

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
  // Use explicit typing to avoid excessive type instantiation depth
  let query = supabase.from('leads').select('*');
  
  // Apply filters if provided
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
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
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error || !data) return [];
  
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

/**
 * Video Analysis queries
 * 
 * Note: These are mock implementations since the video_analyses table
 * doesn't exist in the database yet. In a real application, these would
 * interact with an actual database table.
 */

// In-memory storage for demo purposes
const videoAnalysesStore: Record<string, {
  id: string;
  video_url: string;
  videoInfo: VideoAnalysisData['videoInfo'];
  transcript: VideoAnalysisData['transcript'];
  chapters?: VideoAnalysisData['chapters'];
  analysis?: VideoAnalysisData['analysis'];
}> = {};

/**
 * Get a video analysis by ID
 * @param id - The video analysis ID to fetch
 * @returns Promise with the video analysis data or null
 */
export async function getVideoAnalysis(id: string): Promise<VideoAnalysisData | null> {
  // Mock implementation
  const analysis = videoAnalysesStore[id];
  return analysis ? {
    videoInfo: analysis.videoInfo,
    transcript: analysis.transcript,
    chapters: analysis.chapters,
    analysis: analysis.analysis,
    isLoading: false
  } : null;
}

/**
 * Get video analysis by URL
 * @param videoUrl - The YouTube URL to search for
 * @returns Promise with the video analysis data or null
 */
export async function getVideoAnalysisByUrl(videoUrl: string): Promise<VideoAnalysisData | null> {
  // Mock implementation
  const analysis = Object.values(videoAnalysesStore).find(a => a.video_url === videoUrl);
  return analysis ? {
    videoInfo: analysis.videoInfo,
    transcript: analysis.transcript,
    chapters: analysis.chapters,
    analysis: analysis.analysis,
    isLoading: false
  } : null;
}

/**
 * Save video analysis to the database
 * @param analysisData - The video analysis data to save
 * @param videoUrl - The YouTube URL
 * @param userId - Optional user ID for authentication contexts
 * @returns Promise with the saved record ID or null
 */
export async function saveVideoAnalysis(
  analysisData: VideoAnalysisData,
  videoUrl: string,
  userId?: string
): Promise<string | null> {
  try {
    // Mock implementation
    const id = `analysis-${Date.now()}`;
    
    // Validate the data
    const createData = {
      video_url: videoUrl,
      video_info: analysisData.videoInfo,
      transcript: analysisData.transcript,
      chapters: analysisData.chapters,
      analysis: analysisData.analysis,
      user_id: userId
    };
    
    validateVideoAnalysisCreate(createData);
    
    // Store in our mock database
    videoAnalysesStore[id] = {
      id,
      video_url: videoUrl,
      videoInfo: analysisData.videoInfo,
      transcript: analysisData.transcript,
      chapters: analysisData.chapters,
      analysis: analysisData.analysis
    };
    
    console.log('Saved video analysis with ID:', id);
    return id;
  } catch (err) {
    console.error('Video analysis validation error:', err);
    return null;
  }
}
