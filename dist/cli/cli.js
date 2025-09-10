#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const AnalyzeCommand_1 = require("./AnalyzeCommand");
const ScanCommand_1 = require("./ScanCommand");
const CacheCommand_1 = require("./CacheCommand");
const ConfigCommand_1 = require("./ConfigCommand");
const WithdrawnCommand_1 = require("./WithdrawnCommand");
const program = new commander_1.Command();
program
    .name('soft-awake')
    .description('Advanced NPM Package Security Analysis Tool with AI-Powered Intelligence')
    .version('1.0.0');
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
    const command = new AnalyzeCommand_1.AnalyzeCommand();
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
    const command = new ScanCommand_1.ScanCommand();
    const exitCode = await command.execute([packageJsonPath], {
        file: options.file,
        includeDev: options.includeDev,
        exclude: options.exclude,
        format: options.format,
        output: options.output,
    });
    process.exit(exitCode);
});
program
    .command('cache')
    .description('Manage analysis result cache')
    .argument('<subcommand>', 'Cache operation (clear|info|clean)')
    .option('-f, --force', 'Force operation without confirmation')
    .action(async (subcommand, options) => {
    const command = new CacheCommand_1.CacheCommand();
    const exitCode = await command.execute([subcommand], {
        force: options.force,
    });
    process.exit(exitCode);
});
program
    .command('config')
    .description('Manage tool configuration')
    .argument('<subcommand>', 'Config operation (set|get|list)')
    .argument('[key]', 'Configuration key')
    .argument('[value]', 'Configuration value')
    .action(async (subcommand, key, value) => {
    const command = new ConfigCommand_1.ConfigCommand();
    const args = [subcommand];
    if (key)
        args.push(key);
    if (value)
        args.push(value);
    const exitCode = await command.execute(args);
    process.exit(exitCode);
});
program
    .command('withdrawn')
    .description('Analyze potentially withdrawn/removed package versions')
    .argument('<package>', 'NPM package name to analyze')
    .option('-f, --format <format>', 'Output format (text|json)', 'text')
    .option('-o, --output <file>', 'Output file path (default: stdout)')
    .option('-v, --verbose', 'Show detailed analysis information')
    .action(async (packageName, options) => {
    const command = new WithdrawnCommand_1.WithdrawnCommand();
    const exitCode = await command.execute([packageName], {
        format: options.format,
        output: options.output,
        verbose: options.verbose,
    });
    process.exit(exitCode);
});
process.on('uncaughtException', (error) => {
    console.error('Unexpected error:', error.message);
    process.exit(7);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
    process.exit(7);
});
program.parse();
//# sourceMappingURL=cli.js.map