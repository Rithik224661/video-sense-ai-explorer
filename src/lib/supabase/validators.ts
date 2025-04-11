
import { z } from 'zod';
import { Lead, LeadCreate, LeadUpdate, VideoAnalysisCreate } from './custom-types';

/**
 * Zod schema for validating Lead objects
 */
export const leadSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  job_title: z.string().nullable(),
  company: z.string().nullable(),
  priority: z.string().nullable(),
  source: z.string().nullable(),
  ai_score: z.number().int().nullable(),
  validation_issues: z.any().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

/**
 * Zod schema for validating Lead creation
 */
export const leadCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  job_title: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  ai_score: z.number().int().nullable().optional(),
  validation_issues: z.any().nullable().optional()
});

/**
 * Zod schema for validating Lead updates
 */
export const leadUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  job_title: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  ai_score: z.number().int().nullable().optional(),
  validation_issues: z.any().nullable().optional()
});

/**
 * Zod schema for video information
 */
export const videoInfoSchema = z.object({
  title: z.string(),
  creator: z.string(),
  thumbnailUrl: z.string().url(),
  duration: z.string(),
  publishedDate: z.string(),
  viewCount: z.string()
});

/**
 * Zod schema for transcript segments
 */
export const transcriptSegmentSchema = z.object({
  id: z.string(),
  text: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  speaker: z.string().optional()
});

/**
 * Zod schema for video analysis creation
 */
export const videoAnalysisCreateSchema = z.object({
  video_url: z.string().url(),
  video_info: videoInfoSchema,
  transcript: z.array(transcriptSegmentSchema),
  chapters: z.array(
    z.object({
      title: z.string(),
      startTime: z.number(),
      endTime: z.number(),
      segments: z.array(transcriptSegmentSchema)
    })
  ).optional(),
  analysis: z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
    topics: z.array(z.object({
      name: z.string(),
      relevance: z.number()
    })),
    sentimentScore: z.number(),
    questions: z.array(z.string())
  }).optional(),
  user_id: z.string().uuid().optional()
});

/**
 * Type validation function for leads
 * @param data - The data to validate
 * @returns Validated data or throws an error
 */
export function validateLead(data: unknown): Lead {
  return leadSchema.parse(data) as Lead;
}

/**
 * Type validation function for lead creation
 * @param data - The data to validate
 * @returns Validated data or throws an error
 */
export function validateLeadCreate(data: unknown): LeadCreate {
  return leadCreateSchema.parse(data) as LeadCreate;
}

/**
 * Type validation function for lead updates
 * @param data - The data to validate
 * @returns Validated data or throws an error
 */
export function validateLeadUpdate(data: unknown): LeadUpdate {
  return leadUpdateSchema.parse(data) as LeadUpdate;
}

/**
 * Type validation function for video analysis creation
 * @param data - The data to validate
 * @returns Validated data or throws an error
 */
export function validateVideoAnalysisCreate(data: unknown): VideoAnalysisCreate {
  return videoAnalysisCreateSchema.parse(data) as VideoAnalysisCreate;
}
