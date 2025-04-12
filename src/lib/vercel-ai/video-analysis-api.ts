
import { useState } from 'react';
import { VideoAnalysisData } from '@/lib/types';

// Storage for caching results
const videoAnalysesStore: Record<string, VideoAnalysisData> = {};

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

/**
 * Custom hook for fetching video analysis
 */
export function useVideoAnalysis(videoUrl: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<VideoAnalysisData | null>(null);

  const fetchAnalysis = async (url: string) => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we already have this analysis cached
      if (videoAnalysesStore[url]) {
        setAnalysisData(videoAnalysesStore[url]);
        setIsLoading(false);
        return;
      }
      
      const videoId = extractYouTubeVideoId(url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL. Could not extract video ID.');
      }
      
      // Fetch video metadata using oEmbed API
      const oEmbedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (!oEmbedResponse.ok) {
        throw new Error('Failed to fetch video information. The video might be private or unavailable.');
      }
      
      const oEmbedData = await oEmbedResponse.json();
      
      // Use a direct fetch to the YouTube API (or a custom API) for transcript and analysis
      // For demonstration purposes, we're using a simulated approach
      
      // Simulate analyzing the video by using metadata from YouTube
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'dummy-key-for-demo'}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a video analysis AI that can generate detailed transcripts, chapters, and insights.' 
            },
            { 
              role: 'user', 
              content: `
                Analyze YouTube video:
                Title: ${oEmbedData.title}
                Author: ${oEmbedData.author_name}
                
                Generate:
                1. A transcript with at least 10 segments
                2. 3-5 logical chapters
                3. A summary
                4. 5 key points
                5. 3-5 main topics with relevance scores
                6. A sentiment score (0-1)
                7. 3 follow-up questions
              `
            }
          ]
        })
      });
      
      // Process the response
      const data = await response.json();
      const fullResponse = data?.choices?.[0]?.message?.content || "No analysis generated.";

      // Generate a structured transcript from the AI response
      const segments = generateStructuredTranscript(fullResponse);
      const chapters = generateChapters(segments);
      const analysis = generateAnalysis(fullResponse);
      
      // Create video info
      const videoInfo = {
        title: oEmbedData.title,
        creator: oEmbedData.author_name,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: 'AI Generated',
        publishedDate: new Date().toLocaleDateString(),
        viewCount: 'AI Analysis'
      };
      
      const analysisResult: VideoAnalysisData = {
        videoInfo,
        transcript: segments,
        chapters,
        analysis,
        isLoading: false
      };
      
      // Store for future use
      videoAnalysesStore[url] = analysisResult;
      
      setAnalysisData(analysisResult);
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze video');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analysisData,
    isLoading,
    error,
    fetchAnalysis
  };
}

/**
 * Generate structured transcript segments from AI response
 */
function generateStructuredTranscript(aiResponse: string) {
  // Extract transcript portion from AI response
  const lines = aiResponse.split('\n');
  const segments: any[] = [];
  
  // Find lines that look like transcript content
  let id = 0;
  let startTime = 0;
  
  for (const line of lines) {
    // Skip empty lines and headers
    if (!line.trim() || line.includes('#') || line.includes('Transcript') || line.includes('Chapter')) {
      continue;
    }
    
    // Create structured segment
    const segment = {
      id: (++id).toString(),
      text: line.trim(),
      startTime,
      endTime: startTime + 5, // Approximate 5 seconds per segment
      speaker: determineSpeaker(line)
    };
    
    segments.push(segment);
    startTime += 5; // Increment time for next segment
  }
  
  return segments;
}

/**
 * Try to determine speaker from line content
 */
function determineSpeaker(line: string) {
  // Basic attempt to identify a speaker pattern like "Name:"
  const speakerMatch = line.match(/^([A-Za-z\s]+):/);
  if (speakerMatch && speakerMatch[1].length < 20) {
    return speakerMatch[1].trim();
  }
  return 'Speaker';
}

/**
 * Generate chapters from transcript segments
 */
function generateChapters(segments: any[]) {
  if (segments.length === 0) return [];
  
  const chapterSize = Math.max(3, Math.floor(segments.length / 4)); // Create 4 chapters or minimum 3 segments per chapter
  const chapters = [];
  
  for (let i = 0; i < segments.length; i += chapterSize) {
    const chapterSegments = segments.slice(i, i + chapterSize);
    if (chapterSegments.length === 0) continue;
    
    chapters.push({
      title: `Chapter ${chapters.length + 1}`,
      startTime: chapterSegments[0].startTime,
      endTime: chapterSegments[chapterSegments.length - 1].endTime,
      segments: chapterSegments
    });
  }
  
  return chapters;
}

/**
 * Generate analysis from AI response
 */
function generateAnalysis(aiResponse: string) {
  // Extract key sections from the AI response
  let summary = '';
  const keyPoints: string[] = [];
  const topics: { name: string; relevance: number }[] = [];
  let sentimentScore = 0.5; // Default neutral
  const questions: string[] = [];
  
  const lines = aiResponse.split('\n');
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Identify sections based on headers or keywords
    if (line.includes('Summary') || line.includes('summary')) {
      currentSection = 'summary';
      continue;
    } else if (line.includes('Key Points') || line.includes('key points')) {
      currentSection = 'keyPoints';
      continue;
    } else if (line.includes('Topics') || line.includes('topics')) {
      currentSection = 'topics';
      continue;
    } else if (line.includes('Sentiment') || line.includes('sentiment')) {
      currentSection = 'sentiment';
      continue;
    } else if (line.includes('Questions') || line.includes('questions')) {
      currentSection = 'questions';
      continue;
    }
    
    // Skip empty lines
    if (!line) continue;
    
    // Process content based on current section
    switch (currentSection) {
      case 'summary':
        if (!summary) summary = line;
        break;
      case 'keyPoints':
        if (line.startsWith('-') || line.startsWith('*')) {
          keyPoints.push(line.replace(/^[-*]\s*/, ''));
        }
        break;
      case 'topics':
        if (line.startsWith('-') || line.startsWith('*')) {
          const topicText = line.replace(/^[-*]\s*/, '');
          // Try to extract relevance if present, otherwise assign random relevant score
          const relevanceMatch = topicText.match(/\((\d+(?:\.\d+)?)\)/);
          const relevance = relevanceMatch ? parseFloat(relevanceMatch[1]) / 10 : Math.random() * 0.5 + 0.5;
          const name = topicText.replace(/\s*\(\d+(?:\.\d+)?\)/, '');
          topics.push({ name, relevance });
        }
        break;
      case 'sentiment':
        // Extract sentiment value if present
        const sentimentMatch = line.match(/(\d+(?:\.\d+)?)/);
        if (sentimentMatch) {
          sentimentScore = parseFloat(sentimentMatch[1]);
          // Normalize to 0-1 range if not already
          if (sentimentScore > 1) sentimentScore /= 10;
        } else if (line.toLowerCase().includes('positive')) {
          sentimentScore = 0.75;
        } else if (line.toLowerCase().includes('negative')) {
          sentimentScore = 0.25;
        } else if (line.toLowerCase().includes('neutral')) {
          sentimentScore = 0.5;
        }
        break;
      case 'questions':
        if (line.startsWith('-') || line.startsWith('*') || line.startsWith('?')) {
          questions.push(line.replace(/^[-*?]\s*/, ''));
        }
        break;
    }
  }
  
  // If no key points were found, extract some from the summary
  if (keyPoints.length === 0 && summary) {
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
    for (let i = 0; i < Math.min(4, sentences.length); i++) {
      keyPoints.push(sentences[i].trim());
    }
  }
  
  // If no topics were found, generate some based on key points
  if (topics.length === 0 && keyPoints.length > 0) {
    for (const point of keyPoints) {
      const words = point.split(' ');
      if (words.length > 2) {
        const topicWords = words.slice(0, 2).join(' ');
        topics.push({
          name: topicWords,
          relevance: Math.random() * 0.3 + 0.6 // Random relevance between 0.6 and 0.9
        });
      }
    }
  }
  
  // Ensure we have at least some questions
  if (questions.length === 0 && summary) {
    questions.push(`What are the main implications of ${summary.substring(0, 30)}...?`);
    questions.push(`How does this compare to other content in this field?`);
    questions.push(`What further research could expand on these ideas?`);
  }
  
  return {
    summary: summary || 'No summary available',
    keyPoints: keyPoints.length > 0 ? keyPoints : ['No key points identified'],
    topics: topics.length > 0 ? topics : [{ name: 'General Content', relevance: 0.8 }],
    sentimentScore,
    questions: questions.length > 0 ? questions : ['What did you find most interesting about this content?']
  };
}

/**
 * Get a video analysis by URL
 */
export function getVideoAnalysisByUrl(videoUrl: string): VideoAnalysisData | null {
  if (videoAnalysesStore[videoUrl]) {
    return videoAnalysesStore[videoUrl];
  }
  return null;
}

/**
 * Save video analysis to our storage
 */
export function saveVideoAnalysis(
  analysisData: VideoAnalysisData,
  videoUrl: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      videoAnalysesStore[videoUrl] = {
        ...analysisData,
        isLoading: false
      };
      resolve(true);
    } catch (err) {
      console.error('Error saving video analysis:', err);
      resolve(false);
    }
  });
}
