/**
 * Tálamo Extended Markdown Parser v1.1
 * Parses interactive blocks with validation and error reporting
 */

import {
  ParsedBlock,
  ParseError,
  ParseResult,
  BlockType,
  LessonMeta,
  TradingSimulatorPropsV1,
  TradingSimulatorPropsV2
} from '@/types/extended-markdown';
import { validateLessonMeta, validateTradingSim, validateJSON } from './extended-markdown-validator';

// ============================================================================
// PARSER
// ============================================================================

export function parseExtendedMarkdown(content: string): ParseResult {
  const blocks: ParsedBlock[] = [];
  const errors: ParseError[] = [];
  let meta: LessonMeta | undefined;

  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect block start
    if (line.startsWith(':::')) {
      const blockMatch = line.match(/^:::(\S+)(.*)$/);
      if (blockMatch) {
        const blockType = blockMatch[1] as BlockType;
        const attributesString = blockMatch[2].trim();
        const attributes = parseAttributes(attributesString);
        const startLine = i;

        // Find block end
        let blockContent = '';
        i++;
        while (i < lines.length && !lines[i].trim().startsWith(':::')) {
          blockContent += lines[i] + '\n';
          i++;
        }

        // Parse block
        const parsed = parseBlock(blockType, blockContent, attributes, startLine);
        
        if (parsed.type === 'meta' && parsed.props) {
          meta = parsed.props as LessonMeta;
          
          // Validate meta
          const validation = validateLessonMeta(parsed.props);
          errors.push(...validation.errors);
        } else {
          blocks.push(parsed);
        }

        // Collect any parsing errors
        if (parsed.raw) {
          const blockErrors = validateBlock(parsed, startLine);
          errors.push(...blockErrors);
        }
      }
    }

    i++;
  }

  return { blocks, errors, meta };
}

// ============================================================================
// ATTRIBUTE PARSER
// ============================================================================

function parseAttributes(attributesString: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  // Match attribute="value" or attribute='value' or attribute=value
  const regex = /(\w+)=["']?([^"'\s]+)["']?/g;
  let match;

  while ((match = regex.exec(attributesString)) !== null) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

// ============================================================================
// BLOCK PARSER
// ============================================================================

function parseBlock(
  type: BlockType,
  content: string,
  attributes: Record<string, string>,
  line: number
): ParsedBlock {
  switch (type) {
    case 'meta':
      return parseMeta(content, line);
    
    case 'step':
      return parseStep(content, attributes, line);
    
    case 'accordion':
      return parseAccordion(content, attributes, line);
    
    case 'tabs':
      return parseTabs(content, attributes, line);
    
    case 'flipcard':
      return parseFlipCard(content, attributes, line);
    
    case 'callout':
    case 'tip':
    case 'warning':
    case 'danger':
    case 'success':
      return parseCallout(type, content, attributes, line);
    
    case 'trading-sim':
      return parseTradingSim(content, attributes, line);
    
    default:
      return {
        type,
        content,
        attributes,
        raw: content,
        line
      };
  }
}

// ============================================================================
// SPECIFIC PARSERS
// ============================================================================

function parseMeta(content: string, line: number): ParsedBlock {
  const meta: LessonMeta = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const [key, ...valueParts] = trimmed.split(':');
    const value = valueParts.join(':').trim();

    if (key === 'level') {
      meta.level = value as any;
    } else if (key === 'duration') {
      meta.duration = value;
    } else if (key === 'tags') {
      meta.tags = value.split(',').map(t => t.trim());
    } else if (key === 'id') {
      meta.id = value;
    }
  });

  return {
    type: 'meta',
    content,
    props: meta,
    line
  };
}

function parseStep(content: string, attributes: Record<string, string>, line: number): ParsedBlock {
  return {
    type: 'step',
    content: content.trim(),
    attributes,
    props: {
      title: attributes.title || '',
      content: content.trim()
    },
    line
  };
}

function parseAccordion(content: string, attributes: Record<string, string>, line: number): ParsedBlock {
  const items: Array<{ title: string; content: string }> = [];
  const sections = content.split(/^## /m).filter(Boolean);

  sections.forEach(section => {
    const [title, ...contentLines] = section.split('\n');
    items.push({
      title: title.trim(),
      content: contentLines.join('\n').trim()
    });
  });

  return {
    type: 'accordion',
    content,
    attributes,
    props: { items },
    line
  };
}

function parseTabs(content: string, attributes: Record<string, string>, line: number): ParsedBlock {
  const items: Array<{ label: string; content: string }> = [];
  const sections = content.split(/\[label="([^"]+)"\]/);

  for (let i = 1; i < sections.length; i += 2) {
    const label = sections[i];
    const content = sections[i + 1]?.trim() || '';
    items.push({ label, content });
  }

  return {
    type: 'tabs',
    content,
    attributes,
    props: { items },
    line
  };
}

function parseFlipCard(content: string, attributes: Record<string, string>, line: number): ParsedBlock {
  const frontMatch = content.match(/\[front\]([\s\S]*?)(?=\[back\])/);
  const backMatch = content.match(/\[back\]([\s\S]*)/);

  const front = frontMatch ? frontMatch[1].trim() : '';
  const back = backMatch ? backMatch[1].trim() : '';

  return {
    type: 'flipcard',
    content,
    attributes,
    props: { front, back },
    line
  };
}

function parseCallout(
  type: BlockType,
  content: string,
  attributes: Record<string, string>,
  line: number
): ParsedBlock {
  // Map block type to callout type
  const calloutType = attributes.type || (
    type === 'callout' ? 'info' :
    type === 'tip' ? 'success' :
    type
  );

  return {
    type: 'callout',
    content: content.trim(),
    attributes: { ...attributes, type: calloutType },
    props: { type: calloutType, content: content.trim() },
    line
  };
}

function parseTradingSim(
  content: string,
  attributes: Record<string, string>,
  line: number
): ParsedBlock {
  const sections = extractSections(content);
  const isV2 = attributes.v === '2';

  // Build props object
  const props: any = { ...attributes };

  // Parse JSON sections
  Object.entries(sections).forEach(([key, value]) => {
    if (shouldParseAsJSON(key)) {
      try {
        props[key] = JSON.parse(value);
      } catch (e) {
        // Error will be caught in validation
        props[key] = value; // Keep raw string for error reporting
      }
    } else {
      props[key] = value.trim();
    }
  });

  // Normalize aliases for v2
  if (isV2) {
    if (props.context) props.educationalContext = props.context;
    if (props.data) props.scenarioData = props.data;
    if (props.marks) props.annotations = props.marks;
  }

  return {
    type: 'trading-sim',
    content,
    attributes,
    props,
    raw: content,
    line
  };
}

// ============================================================================
// SECTION EXTRACTOR
// ============================================================================

function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionRegex = /\[(\w+)\]\s*\n([\s\S]*?)(?=\n\[|$)/g;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    const sectionName = match[1];
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  return sections;
}

function shouldParseAsJSON(sectionName: string): boolean {
  const jsonSections = [
    'market',
    'risk',
    'dataset',
    'data',
    'annotations',
    'marks',
    'context',
    'educational_context',
    'scenario_data',
    'scenarioData',
    'rubric',
    'steps',
    'hints',
    'actions'
  ];
  return jsonSections.includes(sectionName);
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateBlock(block: ParsedBlock, line: number): ParseError[] {
  if (block.type === 'trading-sim' && block.props) {
    const validation = validateTradingSim(block.props, line);
    return validation.errors;
  }

  return [];
}

// ============================================================================
// EXPORTS
// ============================================================================

export { parseAttributes, extractSections };
