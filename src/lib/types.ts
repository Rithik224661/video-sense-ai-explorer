
export interface VideoInfo {
  title: string;
  creator: string;
  thumbnailUrl: string;
  duration: string;
  publishedDate: string;
  viewCount: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
}

export interface TranscriptChapter {
  title: string;
  startTime: number;
  endTime: number;
  segments: TranscriptSegment[];
}

export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  topics: {
    name: string;
    relevance: number;
  }[];
  sentimentScore: number;
  questions: string[];
}

export interface VideoAnalysisData {
  videoInfo: VideoInfo;
  transcript: TranscriptSegment[];
  chapters?: TranscriptChapter[];
  analysis?: AIAnalysisResult;
  isLoading: boolean;
  error?: string;
}
