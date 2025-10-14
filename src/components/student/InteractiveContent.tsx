import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export const FlipCard: React.FC<FlipCardProps> = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flip-card h-48 cursor-pointer perspective-1000 my-4"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="flip-card-front bg-primary/10 border-2 border-primary rounded-lg">
          <div className="prose prose-sm dark:prose-invert">{front}</div>
        </div>
        <div className="flip-card-back bg-accent/10 border-2 border-accent rounded-lg">
          <div className="prose prose-sm dark:prose-invert">{back}</div>
        </div>
      </div>
    </div>
  );
};

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface ContentAccordionProps {
  items: AccordionItem[];
}

export const ContentAccordion: React.FC<ContentAccordionProps> = ({ items }) => {
  return (
    <Accordion type="single" collapsible className="my-4">
      {items.map((item, idx) => (
        <AccordionItem key={idx} value={`item-${idx}`}>
          <AccordionTrigger className="text-left hover:text-primary">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface ContentTabsProps {
  items: TabItem[];
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <Tabs defaultValue="tab-0" className="my-4">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item, idx) => (
          <TabsTrigger key={idx} value={`tab-${idx}`}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item, idx) => (
        <TabsContent key={idx} value={`tab-${idx}`}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'danger';
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500 text-blue-400',
    warning: 'bg-amber-500/10 border-amber-500 text-amber-400',
    success: 'bg-green-500/10 border-green-500 text-green-400',
    danger: 'bg-red-500/10 border-red-500 text-red-400',
  };

  return (
    <Alert className={`my-4 border-2 ${styles[type]}`}>
      <AlertDescription className="prose prose-sm dark:prose-invert">
        {children}
      </AlertDescription>
    </Alert>
  );
};
