import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FlipCard, ContentAccordion, ContentTabs, Callout } from './InteractiveContent';

interface EnhancedContentRendererProps {
  content: string;
}

export const EnhancedContentRenderer: React.FC<EnhancedContentRendererProps> = ({ content }) => {
  const parseContent = (markdown: string) => {
    const sections: JSX.Element[] = [];
    let currentIndex = 0;
    let keyCounter = 0;

    // Regex para detectar bloques especiales con sintaxis :::type ... :::
    const blockRegex = /:::(accordion|tabs|flipcard|callout)([^\n]*)\n([\s\S]*?):::/g;
    
    let match;
    const matches: RegExpExecArray[] = [];
    
    // Collect all matches first
    while ((match = blockRegex.exec(markdown)) !== null) {
      matches.push(match);
    }

    // Process matches
    matches.forEach((match) => {
      // Add normal markdown before this block
      if (match.index > currentIndex) {
        const normalContent = markdown.substring(currentIndex, match.index);
        if (normalContent.trim()) {
          sections.push(
            <div key={`md-${keyCounter++}`} className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{normalContent}</ReactMarkdown>
            </div>
          );
        }
      }

      const [, blockType, attributes, blockContent] = match;

      // Render component based on type
      try {
        switch (blockType) {
          case 'accordion':
            sections.push(renderAccordion(blockContent, keyCounter++));
            break;
          case 'tabs':
            sections.push(renderTabs(blockContent, keyCounter++));
            break;
          case 'flipcard':
            sections.push(renderFlipCard(blockContent, keyCounter++));
            break;
          case 'callout':
            sections.push(renderCallout(attributes, blockContent, keyCounter++));
            break;
        }
      } catch (error) {
        console.error(`Error rendering ${blockType}:`, error);
        // Fallback: render as normal markdown if parsing fails
        sections.push(
          <div key={`error-${keyCounter++}`} className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{match[0]}</ReactMarkdown>
          </div>
        );
      }

      currentIndex = match.index + match[0].length;
    });

    // Add remaining content
    if (currentIndex < markdown.length) {
      const remaining = markdown.substring(currentIndex);
      if (remaining.trim()) {
        sections.push(
          <div key={`md-${keyCounter++}`} className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{remaining}</ReactMarkdown>
          </div>
        );
      }
    }

    // If no special blocks found, render as normal markdown
    if (sections.length === 0) {
      return [
        <div key="md-default" className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      ];
    }

    return sections;
  };

  const renderAccordion = (content: string, key: number) => {
    // Parse headers (##) as accordion items
    const sections = content.split(/(?=^## )/gm).filter(Boolean);
    const items = sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].replace(/^##\s*/, '').trim();
      const rest = lines.slice(1).join('\n').trim();
      
      return {
        title,
        content: (
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{rest}</ReactMarkdown>
          </div>
        )
      };
    }).filter(item => item.title); // Filter out empty items

    if (items.length === 0) return null;

    return <ContentAccordion key={`accordion-${key}`} items={items} />;
  };

  const renderTabs = (content: string, key: number) => {
    // Parse [label="..."] as tabs
    const tabRegex = /\[label="([^"]+)"\]\s*([\s\S]*?)(?=\[label=|$)/g;
    const items: any[] = [];
    let tabMatch;
    
    while ((tabMatch = tabRegex.exec(content)) !== null) {
      items.push({
        label: tabMatch[1].trim(),
        content: (
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{tabMatch[2].trim()}</ReactMarkdown>
          </div>
        )
      });
    }

    if (items.length === 0) return null;

    return <ContentTabs key={`tabs-${key}`} items={items} />;
  };

  const renderFlipCard = (content: string, key: number) => {
    // Parse [front] and [back] sections
    const parts = content.split(/\[(front|back)\]/i);
    
    let frontContent = '';
    let backContent = '';
    
    for (let i = 1; i < parts.length; i += 2) {
      const section = parts[i].toLowerCase();
      const sectionContent = parts[i + 1]?.trim() || '';
      
      if (section === 'front') {
        frontContent = sectionContent;
      } else if (section === 'back') {
        backContent = sectionContent;
      }
    }

    if (!frontContent && !backContent) return null;

    return (
      <FlipCard
        key={`flipcard-${key}`}
        front={<ReactMarkdown>{frontContent || 'Click to flip'}</ReactMarkdown>}
        back={<ReactMarkdown>{backContent || 'Back side'}</ReactMarkdown>}
      />
    );
  };

  const renderCallout = (attributes: string, content: string, key: number) => {
    const typeMatch = attributes.match(/type="(\w+)"/);
    const type = (typeMatch?.[1] as 'info' | 'warning' | 'success' | 'danger') || 'info';

    return (
      <Callout key={`callout-${key}`} type={type}>
        <ReactMarkdown>{content.trim()}</ReactMarkdown>
      </Callout>
    );
  };

  return <div className="space-y-4">{parseContent(content)}</div>;
};
