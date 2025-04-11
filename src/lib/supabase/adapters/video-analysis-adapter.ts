
import { VideoAnalysisRecord, VideoAnalysisCreate } from '../custom-types';
import { VideoAnalysisData } from '@/lib/types';

/**
 * Transforms a VideoAnalysisRecord from the database into a VideoAnalysisData for the UI
 * @param record - The video analysis record from the database
 * @returns VideoAnalysisData structure for the UI
 */
export const toVideoAnalysisData = (record: VideoAnalysisRecord): VideoAnalysisData => {
  return {
    videoInfo: record.video_info,
    transcript: record.transcript,
    chapters: record.chapters,
    analysis: record.analysis,
    isLoading: false
  };
};

/**
 * Transforms VideoAnalysisData from the UI into a database-ready VideoAnalysisCreate object
 * @param data - The video analysis data from the UI
 * @param videoUrl - The original YouTube URL
 * @param userId - Optional user ID for authentication contexts
 * @returns Database-ready video analysis create object
 */
export const fromVideoAnalysisData = (
  data: VideoAnalysisData, 
  videoUrl: string,
  userId?: string
): VideoAnalysisCreate => {
  return {
    video_url: videoUrl,
    video_info: data.videoInfo,
    transcript: data.transcript,
    chapters: data.chapters,
    analysis: data.analysis,
    user_id: userId
  };
};
