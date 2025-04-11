
import { Lead, EnhancedLead, Settings, AuditLog, VideoAnalysisRecord } from './custom-types';

/**
 * Type guard for Lead objects
 * @param lead - The lead object to check
 * @returns Boolean indicating if the lead has all required properties
 */
export function isCompleteLead(lead: Partial<Lead>): lead is Lead {
  return (
    !!lead.id && 
    !!lead.name && 
    !!lead.created_at &&
    !!lead.updated_at
  );
}

/**
 * Type guard for Settings objects
 * @param settings - The settings object to check
 * @returns Boolean indicating if the settings has all required properties
 */
export function isCompleteSettings(settings: Partial<Settings>): settings is Settings {
  return (
    !!settings.id && 
    !!settings.created_at &&
    !!settings.updated_at
  );
}

/**
 * Type guard for AuditLog objects
 * @param log - The audit log object to check
 * @returns Boolean indicating if the log has all required properties
 */
export function isCompleteAuditLog(log: Partial<AuditLog>): log is AuditLog {
  return (
    !!log.id && 
    !!log.action && 
    !!log.created_at &&
    !!log.timestamp
  );
}

/**
 * Type guard for VideoAnalysisRecord objects
 * @param record - The video analysis record to check
 * @returns Boolean indicating if the record has all required properties
 */
export function isCompleteVideoAnalysisRecord(record: Partial<VideoAnalysisRecord>): record is VideoAnalysisRecord {
  return (
    !!record.id && 
    !!record.video_url && 
    !!record.video_info &&
    !!record.transcript &&
    !!record.created_at &&
    !!record.updated_at
  );
}
