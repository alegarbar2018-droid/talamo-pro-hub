import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle, RotateCcw } from 'lucide-react';
import { EnhancedContentRenderer } from './EnhancedContentRenderer';
import { StepContent } from '@/types/extended-markdown';
import { cn } from '@/lib/utils';

interface SteppedContentRendererProps {
  content: string;
  lessonId: string;
  onStepComplete?: (stepIndex: number) => void;
  onLessonComplete?: () => void;
  onProgressChange?: (current: number, total: number) => void;
  onStepsChange?: (steps: StepContent[]) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function SteppedContentRenderer({
  content,
  lessonId,
  onStepComplete,
  onLessonComplete,
  onProgressChange,
  onStepsChange,
  onNextLesson,
  hasNextLesson
}: SteppedContentRendererProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StepContent[]>([]);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Parse content into steps
  useEffect(() => {
    const parsedSteps = parseContentIntoSteps(content);
    setSteps(parsedSteps);
    onStepsChange?.(parsedSteps);

    // Load progress from localStorage
    const savedStep = localStorage.getItem(`lesson-${lessonId}-current-step`);
    if (savedStep) {
      const stepIndex = parseInt(savedStep, 10);
      if (stepIndex >= 0 && stepIndex < parsedSteps.length) {
        setCurrentStep(stepIndex);
        // Mark all steps up to saved step as visited
        const visited = new Set<number>();
        for (let i = 0; i <= stepIndex; i++) {
          visited.add(i);
        }
        setVisitedSteps(visited);
      }
    }
  }, [content, lessonId]);

  // Save progress to localStorage and notify parent
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(`lesson-${lessonId}-current-step`, currentStep.toString());
      onProgressChange?.(currentStep + 1, steps.length);
    }
  }, [currentStep, lessonId, steps.length, onProgressChange]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));
      onStepComplete?.(currentStep);
    } else {
      // Last step completed
      setLessonCompleted(true);
      onLessonComplete?.();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetLesson = () => {
    setCurrentStep(0);
    setVisitedSteps(new Set([0]));
    setLessonCompleted(false);
    localStorage.removeItem(`lesson-${lessonId}-current-step`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
        goToNextStep();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        goToPreviousStep();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, steps.length]);

  if (steps.length === 0) {
    return <EnhancedContentRenderer content={content} />;
  }

  const currentStepContent = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Step Content */}
      <div className="animate-fade-in">
        {currentStepContent.title && (
          <h2 className="text-2xl font-bold text-foreground mb-6 bg-gradient-to-r from-teal to-teal-ink bg-clip-text text-transparent">
            {currentStepContent.title}
          </h2>
        )}
        <EnhancedContentRenderer content={currentStepContent.content} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-line/30 gap-4">
        {!lessonCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
            className={cn(
              "group relative overflow-hidden transition-all duration-300",
              isFirstStep 
                ? "opacity-40 cursor-not-allowed" 
                : "hover:border-teal/50 hover:shadow-lg hover:shadow-teal/10"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ChevronLeft className="h-4 w-4 mr-1.5 relative z-10 group-hover:-translate-x-1 transition-transform" />
            <span className="relative z-10 font-medium">Anterior</span>
          </Button>
        )}

        {lessonCompleted ? (
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={resetLesson}
              className="group relative overflow-hidden transition-all duration-300 hover:border-teal/50"
            >
              <RotateCcw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Reiniciar</span>
            </Button>
            {hasNextLesson && onNextLesson && (
              <Button
                onClick={onNextLesson}
                size="sm"
                className="bg-gradient-primary hover:shadow-glow-intense group relative overflow-hidden px-6 flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="relative z-10 font-semibold">Siguiente Lección</span>
                <ChevronRight className="h-4 w-4 ml-1.5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        ) : isLastStep ? (
          <Button
            onClick={goToNextStep}
            size="sm"
            className="bg-gradient-primary hover:shadow-glow-intense group relative overflow-hidden px-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 font-semibold">Completar Lección</span>
            <CheckCircle className="h-4 w-4 ml-1.5 relative z-10 group-hover:scale-110 transition-transform" />
          </Button>
        ) : (
          <Button
            onClick={goToNextStep}
            size="sm"
            className="bg-gradient-to-r from-teal to-teal-dark hover:shadow-glow text-teal-ink group relative overflow-hidden px-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10 font-semibold">Siguiente</span>
            <ChevronRight className="h-4 w-4 ml-1.5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Helper function to parse content into steps
function parseContentIntoSteps(content: string): StepContent[] {
  const steps: StepContent[] = [];
  const lines = content.split('\n');
  let i = 0;
  let stepIndex = 0;
  let preambleContent = '';

  // First, collect any content BEFORE the first :::step block
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith(':::step')) {
      break;
    }
    preambleContent += lines[i] + '\n';
    i++;
  }

  // If there's preamble content, add it as the first step
  if (preambleContent.trim()) {
    steps.push({
      id: `step-${stepIndex}`,
      title: 'Introducción',
      content: preambleContent.trim(),
      index: stepIndex
    });
    stepIndex++;
  }

  // Now process :::step blocks
  while (i < lines.length) {
    const line = lines[i].trim();

    // Check for :::step block
    if (line.startsWith(':::step')) {
      // Extract title from attributes
      const titleMatch = line.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : `Paso ${stepIndex + 1}`;

      // Collect step content until we find another :::step or end of content
      let stepContent = '';
      i++;
      
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        
        // If we hit another :::step, stop here
        if (currentLine.startsWith(':::step')) {
          break;
        }
        
        stepContent += lines[i] + '\n';
        i++;
      }

      steps.push({
        id: `step-${stepIndex}`,
        title,
        content: stepContent.trim(),
        index: stepIndex
      });
      stepIndex++;
      
      // Don't increment i here since we need to process the next :::step
      continue;
    }

    i++;
  }

  // If no steps found, treat entire content as single step
  if (steps.length === 0) {
    steps.push({
      id: 'step-0',
      title: '',
      content: content,
      index: 0
    });
  }

  return steps;
}
