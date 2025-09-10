# Soft Awake 🛡️

**Advanced NPM Package Security Analysis Tool with AI-Powered Intelligence**

Soft Awake is a comprehensive CLI tool that leverages Large Language Models (LLMs) to analyze NPM packages for security vulnerabilities, malware detection, and dependency risks. It provides intelligent recommendations for safer alternatives and helps developers make informed decisions about their project dependencies.

## 🚀 Features

- **🔍 Deep Package Analysis**: Comprehensive security scanning of NPM packages
- **🤖 AI-Powered Detection**: Uses OpenRouter LLM integration for advanced threat analysis
- **⚠️ Withdrawn Version Detection**: Identifies versions removed due to security vulnerabilities
- **📊 Multi-format Reports**: Generate reports in JSON, Text, or HTML formats
- **🏗️ Dependency Tree Analysis**: Analyze complete dependency trees up to 15 levels deep
- **⚡ Smart Caching**: Intelligent caching system to speed up repeated analyses
- **🎯 Severity Filtering**: Filter results by risk level (low, medium, high, critical)
- **📦 Batch Processing**: Analyze multiple packages simultaneously
- **🔧 Flexible Configuration**: Configurable settings for API keys and analysis parameters

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Output Formats](#output-formats)
- [Exit Codes](#exit-codes)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- **Node.js**: Version 18+ required
- **NPM**: Version 8+ required
- **OpenRouter API Key**: Required for LLM analysis

### Install from NPM

```bash
npm install -g soft-awake
```

### Install from Source

```bash
git clone https://github.com/ktfth/soft-awake.git
cd soft-awake
npm install
npm run build
npm link
```

## ⚡ Quick Start

1. **Configure your OpenRouter API key:**
   ```bash
   soft-awake config set api-key sk-or-v1-your-api-key-here
   ```

2. **Analyze a single package:**
   ```bash
   soft-awake analyze express
   ```

3. **Scan your project's dependencies:**
   ```bash
   soft-awake scan package.json --include-dev
   ```

## 📖 Commands

### `analyze` - Analyze NPM Packages

Analyze one or more NPM packages for security vulnerabilities and malware.

```bash
soft-awake analyze <packages...> [options]
```

**Arguments:**
- `<packages...>` - One or more NPM package names to analyze

**Options:**
- `-v, --version <version>` - Specific package version to analyze (default: latest)
- `-f, --format <format>` - Output format: json|text|html (default: text)
- `-o, --output <file>` - Output file path (default: stdout)
- `-d, --depth <number>` - Maximum dependency tree depth 1-15 (default: 5)
- `--no-cache` - Disable caching
- `-s, --severity <level>` - Minimum severity: low|medium|high|critical (default: medium)
- `-t, --timeout <seconds>` - Analysis timeout per package 5-300s (default: 30)

**Examples:**
```bash
# Analyze latest version of express
soft-awake analyze express

# Analyze specific version with high severity filter
soft-awake analyze react@18.2.0 --severity high

# Analyze multiple packages with JSON output
soft-awake analyze lodash axios moment --format json

# Deep analysis with custom timeout
soft-awake analyze webpack --depth 10 --timeout 60
```

### `scan` - Scan package.json Files

Scan a package.json file and analyze all dependencies.

```bash
soft-awake scan [package-json-path] [options]
```

**Arguments:**
- `[package-json-path]` - Path to package.json file (default: ./package.json)

**Options:**
- `-f, --file <path>` - Path to package.json file (default: ./package.json)
- `--include-dev` - Include devDependencies in analysis
- `-e, --exclude <patterns...>` - Package names to exclude from analysis
- `-o, --format <format>` - Output format: json|text|html (default: text)
- `--output <file>` - Output file path (default: stdout)

**Examples:**
```bash
# Scan current directory's package.json
soft-awake scan

# Scan with dev dependencies included
soft-awake scan --include-dev

# Scan specific file excluding test packages
soft-awake scan ./frontend/package.json --exclude "@types/*" "jest"

# Generate HTML report
soft-awake scan --format html --output security-report.html
```

### `cache` - Manage Analysis Cache

Manage the analysis result cache for improved performance.

```bash
soft-awake cache <subcommand> [options]
```

**Subcommands:**
- `clear` - Clear all cached analysis results
- `info` - Display cache statistics and information
- `clean` - Remove expired cache entries

**Options:**
- `-f, --force` - Force operation without confirmation (for clear command)

**Examples:**
```bash
# View cache information
soft-awake cache info

# Clean expired entries
soft-awake cache clean

# Clear all cache (with confirmation)
soft-awake cache clear

# Force clear all cache
soft-awake cache clear --force
```

### `config` - Manage Configuration

Manage tool configuration settings.

```bash
soft-awake config <subcommand> [key] [value]
```

**Subcommands:**
- `set <key> <value>` - Set a configuration value
- `get <key>` - Get a configuration value
- `list` - List all configuration settings

**Configuration Keys:**
- `api-key` - OpenRouter API key for LLM analysis
- `cache-ttl` - Cache time-to-live in hours (1-8760)

**Examples:**
```bash
# Set OpenRouter API key
soft-awake config set api-key sk-or-v1-your-api-key-here

# Set cache TTL to 24 hours
soft-awake config set cache-ttl 24

# Get current API key
soft-awake config get api-key

# List all settings
soft-awake config list
```

### `withdrawn` - Analyze Withdrawn Versions

Analyze potentially withdrawn or removed package versions due to security vulnerabilities.

```bash
soft-awake withdrawn <package> [options]
```

**Arguments:**
- `<package>` - NPM package name to analyze for withdrawn versions

**Options:**
- `-f, --format <format>` - Output format: text|json (default: text)
- `-o, --output <file>` - Output file path (default: stdout)
- `-v, --verbose` - Show detailed analysis information

**Examples:**
```bash
# Analyze debug package for withdrawn versions
soft-awake withdrawn debug

# Verbose analysis with detailed gap information
soft-awake withdrawn express --verbose

# JSON output for programmatic processing
soft-awake withdrawn lodash --format json

# Save report to file
soft-awake withdrawn react --output withdrawn-analysis.txt
```

**What This Command Detects:**
- **Version Gaps**: Missing versions in sequential numbering (e.g., 1.0.1, 1.0.2, ~~1.0.3~~, 1.0.4)
- **Suspicious Patterns**: Single missing patch versions often indicate security withdrawals
- **Security Alerts**: Flags versions that may have been removed due to vulnerabilities
- **Recommendations**: Guidance on avoiding potentially vulnerable version ranges

## ⚙️ Configuration

### OpenRouter API Key

Soft Awake requires an OpenRouter API key for LLM-powered analysis:

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Generate an API key
3. Configure it: `soft-awake config set api-key sk-or-v1-your-key`

### Environment Variables

You can also set configuration via environment variables:

```bash
export SOFT_AWAKE_API_KEY="sk-or-v1-your-api-key"
export SOFT_AWAKE_CACHE_TTL="168"  # 7 days in hours
```

## 📋 Usage Examples

### Basic Package Analysis

```bash
# Quick security check
soft-awake analyze express

# Detailed analysis with full dependency tree
soft-awake analyze express --depth 15 --severity low

# Check specific version
soft-awake analyze react@17.0.2
```

### Project Security Audit

```bash
# Full project audit including dev dependencies
soft-awake scan --include-dev --format json --output audit.json

# Production dependencies only
soft-awake scan --exclude "@types/*" "eslint*" "jest"
```

### Batch Analysis

```bash
# Analyze multiple related packages
soft-awake analyze react react-dom react-router

# Check all testing frameworks
soft-awake analyze jest mocha chai --severity high
```

### Advanced Reporting

```bash
# Generate comprehensive HTML report
soft-awake scan --format html --output security-report.html --include-dev

# JSON output for CI/CD integration
soft-awake analyze $PACKAGE_NAME --format json --severity critical
```

## 📄 Output Formats

### Text Format (Default)

Human-readable format with color coding and clear sections:

```
📊 SECURITY REPORT
==================================================

Package: express@4.18.2
Risk Level: MEDIUM
Overall Score: 45/100

🔴 Critical Issues (2):
• Potential ReDoS vulnerability in path-to-regexp
• Outdated dependency with known CVE

🟡 Medium Issues (3):
• Missing security headers configuration
• Deprecated dependency usage
• Insufficient input validation

💡 Recommendations:
• Update to express@4.19.0 or later
• Consider fastify as a more secure alternative
• Implement helmet middleware for security headers

⏱  Analysis time: 2.3s | Cached: No
--------------------------------------------------
```

### JSON Format

Structured data for programmatic processing:

```json
{
  "package": {
    "name": "express",
    "version": "4.18.2",
    "analyzedAt": "2024-01-15T10:30:00Z"
  },
  "security": {
    "overallScore": 45,
    "riskLevel": "MEDIUM",
    "issues": [
      {
        "severity": "CRITICAL",
        "type": "vulnerability",
        "title": "Potential ReDoS vulnerability",
        "description": "...",
        "cve": "CVE-2024-1234"
      }
    ]
  },
  "recommendations": [
    {
      "type": "update",
      "current": "4.18.2",
      "recommended": "4.19.0",
      "reason": "Security patches"
    }
  ]
}
```

### HTML Format

Complete web report with interactive elements and visualizations.

## 🚦 Exit Codes

Soft Awake uses specific exit codes to indicate analysis results:

- **0** - Success, no security issues found
- **1** - Security issues found (severity depends on --severity flag)
- **2** - Invalid command line arguments
- **3** - Configuration error (missing API key, invalid settings)
- **4** - Network error (unable to fetch package data)
- **5** - Package not found
- **6** - Analysis timeout
- **7** - Internal error

### CI/CD Integration

Use exit codes for automated security gates:

```bash
# Fail CI if critical issues found
soft-awake analyze $PACKAGE --severity critical
if [ $? -eq 1 ]; then
  echo "Critical security issues found!"
  exit 1
fi
```

## 🔌 API Integration

### OpenRouter Integration

Soft Awake integrates with OpenRouter for LLM-powered analysis:

- **Supported Models**: GPT-4, Claude, Llama, and others
- **Analysis Types**: Static code analysis, pattern recognition, threat intelligence
- **Rate Limiting**: Automatic retry with exponential backoff
- **Cost Optimization**: Intelligent prompt engineering to minimize token usage

### NPM Registry API

Direct integration with the NPM registry for package metadata:

- **Real-time Data**: Always uses latest package information
- **Version Resolution**: Smart handling of version specifiers
- **Dependency Mapping**: Complete dependency tree construction
- **Metadata Extraction**: Author, license, download stats, and more

## 🛡️ Security Features

### Malware Detection

- **Pattern Analysis**: Suspicious code patterns and obfuscation
- **Behavioral Analysis**: Network requests, file system access
- **Supply Chain**: Dependency confusion and typosquatting detection
- **Reputation Scoring**: Author history and package maintenance

### Withdrawn Version Detection

- **Version Gap Analysis**: Identifies missing versions in sequential numbering patterns
- **Security Withdrawal Detection**: Flags versions likely removed due to vulnerabilities
- **Historical Analysis**: Analyzes version publication patterns for anomalies
- **Advisory Integration**: Cross-references with security advisory databases
- **Risk Assessment**: Provides likelihood scores for withdrawal reasons

### Vulnerability Assessment

- **CVE Database**: Integration with Common Vulnerabilities and Exposures
- **Version Tracking**: Known vulnerable version identification
- **Transitive Dependencies**: Deep dependency vulnerability scanning
- **Severity Scoring**: CVSS-based risk assessment

### Best Practices

- **License Compliance**: License compatibility and legal risk assessment
- **Maintenance Status**: Package freshness and support status
- **Community Health**: Download statistics and community engagement
- **Alternative Suggestions**: Safer, more maintained alternatives

## 🚀 Performance

### Caching Strategy

- **Multi-level Caching**: In-memory and persistent SQLite cache
- **Smart Invalidation**: Time-based and version-based cache expiry
- **Compression**: Efficient storage of analysis results
- **Cache Statistics**: Hit rates and storage optimization

### Optimization Features

- **Parallel Processing**: Concurrent package analysis
- **Request Batching**: Optimized API calls to external services
- **Memory Management**: Efficient handling of large dependency trees
- **Progress Reporting**: Real-time analysis progress updates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/ktfth/soft-awake.git
cd soft-awake
npm install
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run contract tests
npm run test:contract

# Run with coverage
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Build and watch for changes
npm run build:watch
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://soft-awake.aldeia-viva.com.br/docs](https://soft-awake.aldeia-viva.com.br/docs)
- **Issues**: [GitHub Issues](https://github.com/ktfth/soft-awake/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ktfth/soft-awake/discussions)
- **Security**: security@soft-awake.dev

## 🙏 Acknowledgments

- OpenRouter for LLM API services
- NPM Registry for package metadata
- The open source security community
- All contributors and users who help improve Soft Awake

---

**Made with ❤️ for a more secure JavaScript ecosystem**
