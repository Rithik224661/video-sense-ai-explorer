import type { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Type definitions for database tables
 */

// Leads table type
export type Lead = Database['public']['Tables']['leads']['Row'];

// Settings table type
export type Settings = Database['public']['Tables']['settings']['Row'];

// Audit logs table type
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

/**
 * Enhanced types with additional properties
 */

/**
 * Enhanced Lead type with derived properties
 * @property displayName - Formatted name for display
 * @property validationStatus - Status based on validation issues
 * @property priorityLevel - Numeric representation of priority
 */
export type EnhancedLead = Lead & {
  displayName?: string;
  validationStatus?: 'valid' | 'warning' | 'error';
  priorityLevel?: number;
};

/**
 * Type for creating a new lead
 * Omits auto-generated fields
 */
export type LeadCreate = {
  name: string;
  email?: string | null;
  phone?: string | null;
  job_title?: string | null;
  company?: string | null;
  priority?: string | null;
  source?: string | null;
  ai_score?: number | null;
  validation_issues?: Json | null;
};

/**
 * Type for updating an existing lead
 * Makes all fields optional except id
 */
export type LeadUpdate = {
  id: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  job_title?: string | null;
  company?: string | null;
  priority?: string | null;
  source?: string | null;
  ai_score?: number | null;
  validation_issues?: Json | null;
};

/**
 * Video-related types for YouTube Sense AI feature
 */

// We're keeping the existing VideoAnalysisData type from src/lib/types.ts
// but we'll reference it here for completeness
import { 
  VideoInfo, 
  TranscriptSegment, 
  TranscriptChapter, 
  AIAnalysisResult, 
  VideoAnalysisData 
} from '@/lib/types';

/**
 * Type for creating a new video analysis record
 */
export type VideoAnalysisCreate = {
  video_url: string;
  video_info: VideoInfo;
  transcript: TranscriptSegment[];
  chapters?: TranscriptChapter[];
  analysis?: AIAnalysisResult;
  user_id?: string;
};

/**
 * Type for video analysis record in the database
 * Note: This table doesn't exist yet in the database,
 * so we're using this for our mock implementation
 */
export type VideoAnalysisRecord = VideoAnalysisCreate & {
  id: string;
  created_at: string;
  updated_at: string;
};
