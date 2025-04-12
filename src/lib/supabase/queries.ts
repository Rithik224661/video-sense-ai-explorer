
import { Client } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/custom-types';

// Import individual queries from queries folders
import {
  createLead,
  getLeadById,
  getLeads,
  updateLead,
  deleteLead
} from './queries/lead-queries';

import {
  saveVideoAnalysis,
  getVideoAnalysisByUrl
} from './queries/video-analysis-queries';

// Re-export all functions
export {
  // Lead queries
  createLead,
  getLeadById,
  getLeads,
  updateLead,
  deleteLead,
  
  // Video analysis queries
  saveVideoAnalysis,
  getVideoAnalysisByUrl
};
