# Data Model: NPM Package Malware Analysis System

**Feature**: NPM Package Malware Analysis System  
**Date**: 2025-09-09  
**Version**: 1.0.0

## Core Entities

### Package
Represents an NPM package with metadata and analysis context.

**Fields**:
- `name`: string (required) - Package name from npm registry
- `version`: string (required) - Semantic version (e.g., "1.2.3")
- `description`: string (optional) - Package description from package.json
- `maintainers`: PackageMaintainer[] (optional) - List of package maintainers
- `downloadCount`: number (optional) - Weekly download statistics
- `repositoryUrl`: string (optional) - GitHub/GitLab repository URL
- `homepage`: string (optional) - Package homepage URL
- `license`: string (optional) - Package license identifier
- `publishedDate`: Date (required) - When version was published to npm
- `dependencies`: PackageDependency[] (optional) - Direct dependencies list
- `devDependencies`: PackageDependency[] (optional) - Development dependencies

**Validation Rules**:
- `name` must match npm package naming rules (lowercase, hyphens, no spaces)
- `version` must be valid semver format
- `downloadCount` must be non-negative integer
- `repositoryUrl` must be valid URL if provided
- `publishedDate` must be valid ISO date

**State Transitions**:
- Created → Analyzing → Analyzed → Cached
- Failed states: AnalysisFailed, NotFound, AccessDenied

### Analysis Report
Contains security assessment and recommendations for a specific package.

**Fields**:
- `packageName`: string (required) - Reference to analyzed package
- `packageVersion`: string (required) - Analyzed version
- `analysisId`: string (required) - Unique analysis identifier (UUID)
- `timestamp`: Date (required) - When analysis was performed
- `overallRiskScore`: number (required) - Risk score 0-100 (higher = more risky)
- `riskLevel`: RiskLevel (required) - LOW | MEDIUM | HIGH | CRITICAL
- `securityAlerts`: SecurityAlert[] (required) - List of identified security issues
- `analysisMetadata`: AnalysisMetadata (required) - Analysis configuration and context
- `recommendations`: AlternativeRecommendation[] (optional) - Suggested safer alternatives
- `executionTime`: number (required) - Analysis duration in milliseconds
- `cacheExpiry`: Date (required) - When cached results expire

**Validation Rules**:
- `overallRiskScore` must be 0-100 integer
- `executionTime` must be positive integer
- `timestamp` must be recent (within last 24 hours for valid analysis)
- `cacheExpiry` must be after `timestamp`

**Relationships**:
- One-to-many with SecurityAlert (report contains multiple alerts)
- One-to-many with AlternativeRecommendation (report contains multiple alternatives)

### Dependency Tree
Hierarchical structure of package dependencies with security status.

**Fields**:
- `rootPackage`: Package (required) - Root package being analyzed  
- `nodes`: DependencyNode[] (required) - Flattened list of all dependencies
- `maxDepth`: number (required) - Maximum depth reached (limit: 15)
- `totalNodes`: number (required) - Total number of dependencies found
- `analysisComplete`: boolean (required) - Whether full tree was analyzed
- `criticalPath`: string[] (optional) - Path to most critical vulnerability
- `buildTimestamp`: Date (required) - When tree was constructed

**Validation Rules**:
- `maxDepth` must be 1-15
- `totalNodes` must match `nodes.length`
- `criticalPath` elements must exist in `nodes`

### Security Alert
Specific security issue found in a package with severity and description.

**Fields**:
- `alertId`: string (required) - Unique alert identifier
- `packageName`: string (required) - Affected package name
- `packageVersion`: string (required) - Affected package version  
- `severity`: Severity (required) - LOW | MEDIUM | HIGH | CRITICAL
- `category`: AlertCategory (required) - MALWARE | VULNERABILITY | SUSPICIOUS_CODE | OUTDATED | TYPOSQUATTING
- `title`: string (required) - Short alert description
- `description`: string (required) - Detailed vulnerability description
- `cveId`: string (optional) - CVE identifier if applicable
- `referenceUrls`: string[] (optional) - Links to vulnerability reports
- `detectionMethod`: DetectionMethod (required) - Static analysis, LLM, signature, behavioral
- `confidence`: number (required) - Detection confidence 0-100
- `remediation`: string (optional) - Suggested fix or mitigation
- `affectedVersions`: string (optional) - Version range affected
- `fixedInVersion`: string (optional) - Version where issue was resolved

**Validation Rules**:
- `confidence` must be 0-100 integer
- `cveId` must match CVE format (CVE-YYYY-NNNN) if provided
- `referenceUrls` must be valid URLs
- `severity` and `confidence` must align (CRITICAL requires >90% confidence)

### Alternative Recommendation  
Safer package alternative with justification and comparison metrics.

**Fields**:
- `originalPackage`: string (required) - Package being replaced
- `recommendedPackage`: string (required) - Suggested alternative package
- `recommendedVersion`: string (required) - Specific version to use
- `justification`: string (required) - Why this alternative is safer
- `securityScore`: number (required) - Security score 0-100 (higher = better)
- `popularityScore`: number (required) - Popularity score 0-100 (higher = more popular)  
- `maintenanceScore`: number (required) - Maintenance score 0-100 (higher = better maintained)
- `compatibilityNotes`: string (optional) - Migration or compatibility considerations
- `lastUpdated`: Date (required) - When recommendation was last verified
- `migrationEffort`: MigrationEffort (required) - LOW | MEDIUM | HIGH

**Validation Rules**:
- All scores must be 0-100 integers
- `recommendedPackage` must be different from `originalPackage`
- `recommendedVersion` must be valid semver
- `lastUpdated` must be recent (within 30 days)

## Supporting Types

### Enums

**RiskLevel**: LOW | MEDIUM | HIGH | CRITICAL  
**Severity**: LOW | MEDIUM | HIGH | CRITICAL  
**AlertCategory**: MALWARE | VULNERABILITY | SUSPICIOUS_CODE | OUTDATED | TYPOSQUATTING  
**DetectionMethod**: STATIC_ANALYSIS | LLM_ANALYSIS | SIGNATURE_MATCH | BEHAVIORAL_ANALYSIS  
**MigrationEffort**: LOW | MEDIUM | HIGH

### Complex Types

**PackageMaintainer**:
- `name`: string (required)
- `email`: string (optional) 
- `url`: string (optional)

**PackageDependency**:
- `name`: string (required)
- `version`: string (required) - Version constraint (e.g., "^1.0.0")
- `optional`: boolean (required)

**DependencyNode**:
- `package`: Package (required)
- `parent`: string (optional) - Parent package name (null for root)
- `depth`: number (required) - Depth in tree (0 for root)
- `isDirect`: boolean (required) - Direct vs transitive dependency
- `analysisStatus`: AnalysisStatus (required)

**AnalysisMetadata**:
- `analyzerId`: string (required) - Which analyzer version was used
- `llmModel`: string (optional) - LLM model used for analysis
- `staticAnalysisTools`: string[] (required) - List of static analysis tools used
- `analysisDepth`: number (required) - Depth of analysis performed
- `timeoutReached`: boolean (required) - Whether analysis hit time limits

**AnalysisStatus**: PENDING | ANALYZING | COMPLETED | FAILED | SKIPPED

## Entity Relationships

```
Package 1:N Analysis Report
Package 1:1 Dependency Tree (as root)
Analysis Report 1:N Security Alert
Analysis Report 1:N Alternative Recommendation  
Dependency Tree 1:N Dependency Node
Dependency Node N:1 Package
```

## Data Flow

1. **Input**: Package name + version → Create Package entity
2. **Analysis**: Package → Generate Analysis Report with Security Alerts
3. **Dependencies**: Package → Build Dependency Tree with Dependency Nodes  
4. **Recommendations**: Security Alerts → Generate Alternative Recommendations
5. **Output**: Analysis Report aggregates all findings for user consumption

## Persistence Strategy

- **Cache Layer**: In-memory (node-cache) + SQLite for persistence
- **TTL Strategy**: 7 days for Analysis Reports, 1 day for Package metadata, 1 hour for Dependency Trees
- **Indexing**: By package name+version for fast lookup
- **Size Limits**: Max 100MB cache, 10k cached reports