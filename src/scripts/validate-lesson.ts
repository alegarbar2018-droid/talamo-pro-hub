#!/usr/bin/env node

/**
 * Tálamo Lesson Validator CLI
 * Validates extended markdown syntax in lesson files
 * 
 * Usage:
 *   npm run validate-lesson path/to/lesson.md
 *   npm run validate-lessons  # validate all lessons
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseExtendedMarkdown } from '../lib/extended-markdown-parser';
import { validateAllBlocks } from '../lib/extended-markdown-validator';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function validateFile(filePath: string): boolean {
  console.log(`\n${colors.cyan}Validating:${colors.reset} ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}✗${colors.reset} File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const parseResult = parseExtendedMarkdown(content);
  const validationResult = validateAllBlocks(content);

  const allErrors = [...parseResult.errors, ...validationResult.errors];
  const allWarnings = validationResult.warnings;

  // Display meta info
  if (parseResult.meta) {
    console.log(`${colors.dim}Meta:${colors.reset}`);
    console.log(`  Level: ${parseResult.meta.level || 'N/A'}`);
    console.log(`  Duration: ${parseResult.meta.duration || 'N/A'}`);
    console.log(`  Tags: ${parseResult.meta.tags?.join(', ') || 'N/A'}`);
  }

  // Display blocks
  console.log(`${colors.dim}Blocks found: ${parseResult.blocks.length}${colors.reset}`);
  parseResult.blocks.forEach(block => {
    const icon = getBlockIcon(block.type);
    console.log(`  ${icon} ${block.type} (line ${block.line})`);
  });

  // Display errors
  if (allErrors.length > 0) {
    console.log(`\n${colors.red}✗ ${allErrors.length} Error(s):${colors.reset}`);
    allErrors.forEach(error => {
      console.log(`  Line ${error.line}: ${error.message}`);
      if (error.field) {
        console.log(`    Field: ${error.field}`);
      }
      if (error.suggestion) {
        console.log(`    ${colors.dim}Suggestion: ${error.suggestion}${colors.reset}`);
      }
    });
  }

  // Display warnings
  if (allWarnings.length > 0) {
    console.log(`\n${colors.yellow}⚠ ${allWarnings.length} Warning(s):${colors.reset}`);
    allWarnings.forEach(warning => {
      console.log(`  Line ${warning.line}: ${warning.message}`);
    });
  }

  // Summary
  if (allErrors.length === 0) {
    console.log(`\n${colors.green}✓ Validation passed${colors.reset}`);
    if (allWarnings.length > 0) {
      console.log(`  ${colors.yellow}(with ${allWarnings.length} warning(s))${colors.reset}`);
    }
    return true;
  } else {
    console.log(`\n${colors.red}✗ Validation failed${colors.reset}`);
    return false;
  }
}

function getBlockIcon(type: string): string {
  const icons: Record<string, string> = {
    'meta': '📋',
    'accordion': '📁',
    'tabs': '📑',
    'flipcard': '🃏',
    'callout': '💡',
    'trading-sim': '📊'
  };
  return icons[type] || '•';
}

function validateDirectory(dirPath: string): { passed: number; failed: number } {
  const results = { passed: 0, failed: 0 };
  
  if (!fs.existsSync(dirPath)) {
    console.error(`${colors.red}✗${colors.reset} Directory not found: ${dirPath}`);
    return results;
  }

  const files = (fs.readdirSync(dirPath, { recursive: true }) as string[])
    .filter(file => file.endsWith('.md'));

  console.log(`${colors.cyan}Validating ${files.length} lesson file(s)...${colors.reset}`);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const success = validateFile(fullPath);
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }
  });

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed: ${results.passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${results.failed}${colors.reset}`);
  console.log(`${'='.repeat(60)}`);

  return results;
}

// Main
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`${colors.cyan}Tálamo Lesson Validator${colors.reset}\n`);
    console.log('Usage:');
    console.log('  npm run validate-lesson <file.md>');
    console.log('  npm run validate-lessons  # validate all in src/lessons/');
    process.exit(0);
  }

  const target = args[0];
  const stats = fs.statSync(target);

  if (stats.isFile()) {
    const success = validateFile(target);
    process.exit(success ? 0 : 1);
  } else if (stats.isDirectory()) {
    const results = validateDirectory(target);
    process.exit(results.failed > 0 ? 1 : 0);
  } else {
    console.error(`${colors.red}✗${colors.reset} Invalid target: ${target}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { validateFile, validateDirectory };
