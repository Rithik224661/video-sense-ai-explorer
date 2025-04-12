
import { VideoAnalysisData } from "@/lib/types";
import { 
  getVideoAnalysisByUrl as getVideoAnalysisFromStore, 
  saveVideoAnalysis as saveVideoAnalysisToStore 
} from "@/lib/vercel-ai/video-analysis-api";

/**
 * Save video analysis
 */
export const saveVideoAnalysis = async (
  analysisData: VideoAnalysisData,
  videoUrl: string
): Promise<boolean> => {
  try {
    return await saveVideoAnalysisToStore(analysisData, videoUrl);
  } catch (error) {
    console.error("Error saving video analysis:", error);
    return false;
  }
};

/**
 * Get video analysis by URL
 */
export const getVideoAnalysisByUrl = async (
  videoUrl: string
): Promise<VideoAnalysisData | null> => {
  try {
    return getVideoAnalysisFromStore(videoUrl);
  } catch (error) {
    console.error("Error getting video analysis:", error);
    return null;
  }
};
