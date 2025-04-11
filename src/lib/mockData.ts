
import { TranscriptSegment, VideoInfo, AIAnalysisResult, TranscriptChapter } from "./types";

export const mockVideoInfo: VideoInfo = {
  title: "The Future of AI: Opportunities and Challenges",
  creator: "TechInsights",
  thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  duration: "14:35",
  publishedDate: "May 15, 2023",
  viewCount: "1.2M views"
};

export const mockTranscript: TranscriptSegment[] = [
  {
    id: "1",
    text: "Welcome to this special presentation on the future of artificial intelligence.",
    startTime: 0,
    endTime: 5.2,
    speaker: "Host"
  },
  {
    id: "2",
    text: "Today we'll explore how AI is transforming industries and what challenges lie ahead.",
    startTime: 5.3,
    endTime: 10.5,
    speaker: "Host"
  },
  {
    id: "3",
    text: "Let's start with a brief overview of recent advancements in machine learning.",
    startTime: 10.6,
    endTime: 15.8,
    speaker: "Host"
  },
  {
    id: "4",
    text: "The development of large language models represents a significant breakthrough in AI capabilities.",
    startTime: 15.9,
    endTime: 21.2,
    speaker: "Expert 1"
  },
  {
    id: "5",
    text: "These models can process and generate human-like text, enabling new applications in content creation, customer service, and research.",
    startTime: 21.3,
    endTime: 28.5,
    speaker: "Expert 1"
  },
  {
    id: "6", 
    text: "However, these powerful tools also raise important ethical questions about bias, privacy, and the future of work.",
    startTime: 28.6,
    endTime: 35.0,
    speaker: "Expert 2"
  },
  {
    id: "7",
    text: "Organizations implementing AI systems must consider these implications carefully.",
    startTime: 35.1,
    endTime: 40.2,
    speaker: "Expert 2"
  },
  {
    id: "8",
    text: "Looking ahead, we expect to see continued innovation in multimodal AI, combining text, vision, and audio capabilities.",
    startTime: 40.3,
    endTime: 47.8,
    speaker: "Host"
  },
  {
    id: "9",
    text: "This will enable more natural human-computer interaction and unlock new possibilities across industries.",
    startTime: 47.9,
    endTime: 54.1,
    speaker: "Host"
  },
  {
    id: "10",
    text: "Thank you for joining us for this exploration of AI's future landscape.",
    startTime: 54.2,
    endTime: 60.0,
    speaker: "Host"
  }
];

export const mockChapters: TranscriptChapter[] = [
  {
    title: "Introduction",
    startTime: 0,
    endTime: 15.8,
    segments: mockTranscript.slice(0, 3)
  },
  {
    title: "Recent Advancements",
    startTime: 15.9,
    endTime: 28.5,
    segments: mockTranscript.slice(3, 5)
  },
  {
    title: "Ethical Considerations",
    startTime: 28.6,
    endTime: 40.2,
    segments: mockTranscript.slice(5, 7)
  },
  {
    title: "Future Outlook",
    startTime: 40.3,
    endTime: 60.0,
    segments: mockTranscript.slice(7, 10)
  }
];

export const mockAnalysis: AIAnalysisResult = {
  summary: "This video discusses recent advancements in AI, particularly large language models, and explores their transformative impact across industries. It addresses ethical considerations including bias, privacy, and workforce implications while projecting future innovations in multimodal AI systems that combine text, vision, and audio capabilities for enhanced human-computer interaction.",
  keyPoints: [
    "Large language models represent a significant breakthrough in AI capabilities",
    "AI applications are expanding in content creation, customer service, and research",
    "Ethical considerations include bias, privacy, and workforce implications",
    "Future development focuses on multimodal AI combining text, vision, and audio"
  ],
  topics: [
    { name: "Large Language Models", relevance: 0.85 },
    { name: "Ethical AI", relevance: 0.78 },
    { name: "Industry Transformation", relevance: 0.72 },
    { name: "Multimodal AI", relevance: 0.68 },
    { name: "Future of Work", relevance: 0.65 }
  ],
  sentimentScore: 0.65, // positive
  questions: [
    "What are the most promising applications of large language models in business?",
    "How can organizations address bias in AI systems?",
    "What industries will be most transformed by multimodal AI?",
    "What regulatory frameworks are being developed for AI governance?"
  ]
};
