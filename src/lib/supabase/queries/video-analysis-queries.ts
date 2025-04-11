
import { VideoAnalysisData } from '@/lib/types';
import { validateVideoAnalysisCreate } from '../validators';

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
  if (!analysis) return null;
  
  return {
    videoInfo: analysis.videoInfo,
    transcript: analysis.transcript,
    chapters: analysis.chapters,
    analysis: analysis.analysis,
    isLoading: false
  };
}

/**
 * Get video analysis by URL
 * @param videoUrl - The YouTube URL to search for
 * @returns Promise with the video analysis data or null
 */
export async function getVideoAnalysisByUrl(videoUrl: string): Promise<VideoAnalysisData | null> {
  // Mock implementation
  const analysis = Object.values(videoAnalysesStore).find(a => a.video_url === videoUrl);
  if (!analysis) return null;
  
  return {
    videoInfo: analysis.videoInfo,
    transcript: analysis.transcript,
    chapters: analysis.chapters,
    analysis: analysis.analysis,
    isLoading: false
  };
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
