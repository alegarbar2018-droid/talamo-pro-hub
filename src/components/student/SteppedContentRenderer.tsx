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
}

export function SteppedContentRenderer({
  content,
  lessonId,
  onStepComplete,
  onLessonComplete
}: SteppedContentRendererProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StepContent[]>([]);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

  // Parse content into steps
  useEffect(() => {
    const parsedSteps = parseContentIntoSteps(content);
    setSteps(parsedSteps);

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

  // Save progress to localStorage
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(`lesson-${lessonId}-current-step`, currentStep.toString());
    }
  }, [currentStep, lessonId, steps.length]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));
      onStepComplete?.(currentStep);
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last step completed
      onLessonComplete?.();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetLesson = () => {
    setCurrentStep(0);
    setVisitedSteps(new Set([0]));
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
      {/* Progress Bar */}
      <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-line/20 p-4 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetLesson}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStep(index);
                  setVisitedSteps(prev => new Set([...prev, index]));
                }}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  index === currentStep
                    ? "bg-teal text-teal-ink"
                    : visitedSteps.has(index)
                    ? "bg-teal/20 text-teal hover:bg-teal/30"
                    : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80"
                )}
              >
                {visitedSteps.has(index) && index !== currentStep && (
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                )}
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

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
      <div className="flex items-center justify-between pt-8 border-t border-line/30">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className="group"
        >
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Anterior
        </Button>

        {isLastStep ? (
          <Button
            onClick={goToNextStep}
            className="bg-gradient-primary hover:opacity-90 group"
          >
            Completar Lección
            <CheckCircle className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        ) : (
          <Button
            onClick={goToNextStep}
            className="bg-teal hover:bg-teal/90 text-teal-ink group"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        Usa las flechas ← → del teclado para navegar
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

  while (i < lines.length) {
    const line = lines[i].trim();

    // Check for :::step block
    if (line.startsWith(':::step')) {
      // Extract title from attributes
      const titleMatch = line.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : `Paso ${stepIndex + 1}`;

      // Collect step content until closing :::
      let stepContent = '';
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
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
