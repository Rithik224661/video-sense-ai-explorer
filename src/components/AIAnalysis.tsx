
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAnalysisResult } from "@/lib/types";
import { Brain, ListChecks, Hash, Lightbulb, HelpCircle, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIAnalysisProps {
  analysis: AIAnalysisResult;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  return (
    <Card className="w-full shadow-md border-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary" className="flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="keyPoints" className="flex items-center">
              <ListChecks className="mr-2 h-4 w-4" />
              Key Points
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center">
              <Hash className="mr-2 h-4 w-4" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              Questions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-0">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sentiment Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={analysis.sentimentScore * 100} className="w-24 h-2" />
                <span className="text-sm font-medium">
                  {analysis.sentimentScore >= 0.6 
                    ? "Positive" 
                    : analysis.sentimentScore >= 0.4 
                      ? "Neutral" 
                      : "Negative"}
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="keyPoints" className="mt-0">
            <ul className="space-y-2">
              {analysis.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-sm">{point}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="topics" className="mt-0">
            <div className="space-y-3">
              {analysis.topics.map((topic, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{topic.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(topic.relevance * 100)}%
                    </span>
                  </div>
                  <Progress value={topic.relevance * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="mt-0">
            <div className="space-y-3">
              {analysis.questions.map((question, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">{question}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;
