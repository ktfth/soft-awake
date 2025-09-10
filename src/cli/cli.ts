#!/usr/bin/env node

import { Command } from 'commander';
import { AnalyzeCommand } from './AnalyzeCommand';
import { ScanCommand } from './ScanCommand';
import { CacheCommand } from './CacheCommand';
import { ConfigCommand } from './ConfigCommand';

const program = new Command();

program
  .name('npm-sec-analyzer')
  .description('NPM Package Malware Analysis CLI Tool using LLM for security vulnerability detection')
  .version('1.0.0');

// Analyze command
program
  .command('analyze')
  .description('Analyze one or more NPM packages for security vulnerabilities')
  .argument('<packages...>', 'NPM package names to analyze')
  .option('-v, --version <version>', 'Specific package version to analyze (default: latest)')
  .option('-f, --format <format>', 'Output format (json|text|html)', 'text')
  .option('-o, --output <file>', 'Output file path (default: stdout)')
  .option('-d, --depth <number>', 'Maximum dependency tree depth (1-15)', '5')
  .option('--no-cache', 'Disable caching')
  .option('-s, --severity <level>', 'Minimum severity level (low|medium|high|critical)', 'medium')
  .option('-t, --timeout <seconds>', 'Analysis timeout per package (5-300)', '30')
  .action(async (packages, options) => {
    const command = new AnalyzeCommand();
    const exitCode = await command.execute(packages, {
      version: options.version,
      format: options.format,
      output: options.output,
      depth: parseInt(options.depth),
      cache: options.cache,
      severity: options.severity,
      timeout: parseInt(options.timeout),
    });
    process.exit(exitCode);
  });

// Scan command
program
  .command('scan')
  .description('Scan package.json file for all dependencies')
  .argument('[package-json-path]', 'Path to package.json file', './package.json')
  .option('-f, --file <path>', 'Path to package.json file', './package.json')
  .option('--include-dev', 'Include devDependencies in analysis')
  .option('-e, --exclude <patterns...>', 'Package names to exclude')
  .option('-o, --format <format>', 'Output format (json|text|html)', 'text')
  .option('--output <file>', 'Output file path (default: stdout)')
  .action(async (packageJsonPath, options) => {
    const command = new ScanCommand();
    const exitCode = await command.execute([packageJsonPath], {
      file: options.file,
      includeDev: options.includeDev,
      exclude: options.exclude,
      format: options.format,
      output: options.output,
    });
    process.exit(exitCode);
  });

// Cache command
program
  .command('cache')
  .description('Manage analysis result cache')
  .argument('<subcommand>', 'Cache operation (clear|info|clean)')
  .option('-f, --force', 'Force operation without confirmation')
  .action(async (subcommand, options) => {
    const command = new CacheCommand();
    const exitCode = await command.execute([subcommand], {
      force: options.force,
    });
    process.exit(exitCode);
  });

// Config command
program
  .command('config')
  .description('Manage tool configuration')
  .argument('<subcommand>', 'Config operation (set|get|list)')
  .argument('[key]', 'Configuration key')
  .argument('[value]', 'Configuration value')
  .action(async (subcommand, key, value) => {
    const command = new ConfigCommand();
    const args = [subcommand];
    if (key) args.push(key);
    if (value) args.push(value);
    
    const exitCode = await command.execute(args);
    process.exit(exitCode);
  });

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Unexpected error:', error.message);
  process.exit(7);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(7);
});

// Parse command line arguments
program.parse();