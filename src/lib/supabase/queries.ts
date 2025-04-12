
import { supabase } from '@/integrations/supabase/client';

// Import individual queries from queries folders
import {
  createLead,
  getLead as getLeadById,
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
