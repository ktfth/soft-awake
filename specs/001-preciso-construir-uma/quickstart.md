# Quickstart Guide: NPM Package Malware Analysis System

**Feature**: NPM Package Malware Analysis System  
**Version**: 1.0.0  
**Date**: 2025-09-09  

## Overview

This guide demonstrates how to use the NPM Package Malware Analysis CLI tool to analyze packages for security vulnerabilities and get recommendations for safer alternatives.

## Prerequisites

- Node.js 18+ installed
- NPM or Yarn package manager
- OpenRouter API key (for LLM analysis)
- Internet connection for package registry access

## Installation

```bash
# Install globally via npm
npm install -g npm-sec-analyzer

# Or install locally in project
npm install --save-dev npm-sec-analyzer

# Verify installation
npm-sec-analyzer --version
```

## Initial Configuration

```bash
# Set OpenRouter API key
npm-sec-analyzer config set api-key YOUR_OPENROUTER_API_KEY

# Optional: Configure cache TTL (default: 7 days)
npm-sec-analyzer config set cache-ttl 168

# Verify configuration
npm-sec-analyzer config list
```

## Basic Usage

### 1. Analyze a Single Package

Analyze the latest version of a popular package:

```bash
npm-sec-analyzer analyze express
```

**Expected Output**:
```
🔍 Analyzing express@4.18.2...
✅ Analysis complete (1.2s)

📊 SECURITY REPORT
Package: express@4.18.2
Risk Level: LOW
Overall Score: 15/100

⚠️  FINDINGS (1):
[MEDIUM] Outdated dependency 'qs' with known performance issue
- CVE: CVE-2022-24999
- Fix: Update to express@4.18.3 or newer
- Confidence: 92%

💡 RECOMMENDATIONS:
- Update to express@4.18.3+ (latest stable)
- Consider alternatives: fastify (security score: 95/100)

⏱  Analysis time: 1.2s | Cached: No
```

### 2. Analyze Specific Package Version

Analyze a specific version with JSON output:

```bash
npm-sec-analyzer analyze express@4.17.0 --format json --output report.json
```

**Expected Output File** (`report.json`):
```json
{
  "summary": {
    "totalPackages": 1,
    "securityIssues": 3,
    "overallRisk": "MEDIUM",
    "analysisTime": 2100
  },
  "packages": [
    {
      "packageName": "express",
      "packageVersion": "4.17.0",
      "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "timestamp": "2025-09-09T10:30:00Z",
      "overallRiskScore": 45,
      "riskLevel": "MEDIUM",
      "securityAlerts": [
        {
          "alertId": "alert_express_4.17.0_001",
          "severity": "HIGH",
          "category": "VULNERABILITY",
          "title": "Path traversal vulnerability in serve-static",
          "cveId": "CVE-2021-23343",
          "confidence": 98,
          "remediation": "Update to express@4.17.3 or newer"
        }
      ],
      "recommendations": [
        {
          "originalPackage": "express",
          "recommendedPackage": "fastify", 
          "recommendedVersion": "^4.24.3",
          "securityScore": 95,
          "popularityScore": 78,
          "maintenanceScore": 92,
          "migrationEffort": "MEDIUM"
        }
      ],
      "executionTime": 2100
    }
  ]
}
```

### 3. Scan Package.json File

Analyze all dependencies in a project:

```bash
npm-sec-analyzer scan --include-dev --format html --output security-report.html
```

**Expected Output**:
```
🔍 Scanning ./package.json...
📦 Found 25 dependencies (15 production, 10 development)

⏳ Analyzing dependencies...
[██████████████████████████████] 100% (25/25) Complete

📊 SCAN RESULTS
Total Packages: 25
Security Issues: 8
High/Critical: 2
Time: 45.2s

⚠️  HIGH PRIORITY ISSUES:
1. lodash@4.17.15 - Prototype pollution (CVE-2020-8203)
2. minimist@1.2.5 - Argument injection (CVE-2021-44906)

📝 Detailed report saved to: security-report.html
```

### 4. Deep Dependency Analysis

Analyze with maximum depth and high severity filter:

```bash
npm-sec-analyzer analyze react --depth 15 --severity high --timeout 60
```

**Expected Output**:
```
🔍 Deep analyzing react@18.2.0 (depth: 15, timeout: 60s)...
📊 Building dependency tree...
└─ react@18.2.0 (245 total dependencies)
   ├─ loose-envify@1.4.0 ✅
   ├─ js-tokens@4.0.0 ✅  
   └─ ... (243 more dependencies)

⚠️  HIGH SEVERITY ISSUES (2):
1. [CRITICAL] Malicious code detected in dependency chain
   Path: react → loose-envify → malicious-package@1.0.0
   Confidence: 94%
   
2. [HIGH] Remote code execution vulnerability
   Package: js-tokens@3.0.2 (transitive)
   CVE: CVE-2023-45678

🛡️  RECOMMENDED ACTIONS:
1. Audit dependency chain immediately
2. Consider using React@18.2.1+ which removes vulnerable path
3. Review build process for supply chain integrity

⏱  Analysis time: 47.8s | Dependencies analyzed: 245/245
```

## Advanced Features

### Cache Management

```bash
# View cache information
npm-sec-analyzer cache info

# Clear expired entries
npm-sec-analyzer cache clean

# Force clear all cache
npm-sec-analyzer cache clear --force
```

### Batch Analysis

```bash
# Analyze multiple packages
npm-sec-analyzer analyze express react vue angular

# Exclude specific patterns when scanning
npm-sec-analyzer scan --exclude "@types/*" "eslint-*" "prettier"
```

### Custom Configuration

Create a `.npm-sec-analyzer.json` config file:

```json
{
  "defaultFormat": "json",
  "defaultDepth": 10,
  "defaultSeverity": "medium",
  "cacheEnabled": true,
  "cacheTtl": 168,
  "apiTimeouts": {
    "npm": 10,
    "openrouter": 30
  },
  "excludePatterns": [
    "@types/*",
    "eslint-*"
  ]
}
```

Load custom config:
```bash
npm-sec-analyzer analyze express --config ./custom-config.json
```

## Integration Examples

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install security scanner
        run: npm install -g npm-sec-analyzer
        
      - name: Configure API key
        run: npm-sec-analyzer config set api-key ${{ secrets.OPENROUTER_API_KEY }}
        
      - name: Run security scan
        run: npm-sec-analyzer scan --format json --output security-report.json
        
      - name: Upload scan results
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: security-report.json
          
      - name: Fail on high/critical issues
        run: npm-sec-analyzer scan --severity high --format json | jq -e '.summary.securityIssues == 0'
```

### NPM Scripts Integration

Add to `package.json`:

```json
{
  "scripts": {
    "security:scan": "npm-sec-analyzer scan",
    "security:report": "npm-sec-analyzer scan --format html --output security-report.html",
    "security:check": "npm-sec-analyzer scan --severity high --format json"
  }
}
```

Usage:
```bash
npm run security:scan
npm run security:report
npm run security:check
```

### Pre-commit Hook

Using Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm-sec-analyzer scan --severity high"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **API Rate Limits**:
   ```
   Error: OpenRouter API rate limit exceeded
   Solution: Wait 60 seconds or upgrade OpenRouter plan
   ```

2. **Network Timeouts**:
   ```bash
   # Increase timeout
   npm-sec-analyzer analyze package --timeout 120
   ```

3. **Large Dependency Trees**:
   ```bash
   # Reduce analysis depth
   npm-sec-analyzer analyze package --depth 8
   ```

4. **Cache Issues**:
   ```bash
   # Clear cache and retry
   npm-sec-analyzer cache clear --force
   npm-sec-analyzer analyze package --no-cache
   ```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
npm-sec-analyzer analyze express --verbose
```

### Getting Help

```bash
# Command help
npm-sec-analyzer --help
npm-sec-analyzer analyze --help

# Configuration help
npm-sec-analyzer config --help

# Version information
npm-sec-analyzer --version
```

## Performance Optimization

1. **Use caching**: Keep default cache enabled for repeated analyses
2. **Limit depth**: Use `--depth 5-8` for faster scans
3. **Filter severity**: Use `--severity medium` to focus on important issues
4. **Exclude dev dependencies**: Skip `--include-dev` in production scans
5. **Batch operations**: Analyze multiple packages in single command

## Security Best Practices

1. **Regular scans**: Run weekly security scans on production dependencies
2. **CI integration**: Block deployments with high/critical vulnerabilities  
3. **Monitor alerts**: Subscribe to security advisories for used packages
4. **Update frequently**: Keep dependencies updated based on recommendations
5. **Verify alternatives**: Test recommended alternatives before switching

This quickstart guide covers the essential usage patterns for the NPM Package Malware Analysis CLI tool. For advanced configuration and API integration, refer to the full documentation.