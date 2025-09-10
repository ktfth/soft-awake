# Tasks: NPM Package Malware Analysis System

**Input**: Design documents from `/specs/001-preciso-construir-uma/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow plan.md single project structure

## Phase 3.1: Setup

- [ ] T001 Create project structure with src/{models,services,cli,lib} and tests/{contract,integration,unit} directories
- [ ] T002 Initialize Node.js TypeScript project with package.json, tsconfig.json, and npm-sec-analyzer as binary name
- [ ] T003 [P] Install dependencies: commander.js, winston, node-cache, sqlite3, uuid, semver, js-x-ray, open-router SDK
- [ ] T004 [P] Configure linting with ESLint, Prettier, and TypeScript compiler settings per research.md
- [ ] T005 [P] Setup Jest testing framework with TypeScript support and test scripts in package.json

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests
- [ ] T006 [P] Contract test for analyze command CLI interface in tests/contract/test_analyze_command.test.ts
- [ ] T007 [P] Contract test for scan command CLI interface in tests/contract/test_scan_command.test.ts  
- [ ] T008 [P] Contract test for cache command CLI interface in tests/contract/test_cache_command.test.ts
- [ ] T009 [P] Contract test for config command CLI interface in tests/contract/test_config_command.test.ts
- [ ] T010 [P] Contract test for MalwareAnalyzer service interface in tests/contract/test_malware_analyzer.test.ts
- [ ] T011 [P] Contract test for NPMClient service interface in tests/contract/test_npm_client.test.ts
- [ ] T012 [P] Contract test for CacheManager service interface in tests/contract/test_cache_manager.test.ts
- [ ] T013 [P] Contract test for ReportGenerator service interface in tests/contract/test_report_generator.test.ts

### Integration Tests
- [ ] T014 [P] Integration test single package analysis scenario from quickstart.md in tests/integration/test_single_package.test.ts
- [ ] T015 [P] Integration test package.json scanning scenario from quickstart.md in tests/integration/test_package_scan.test.ts
- [ ] T016 [P] Integration test dependency tree analysis from quickstart.md in tests/integration/test_dependency_tree.test.ts
- [ ] T017 [P] Integration test batch analysis scenario from quickstart.md in tests/integration/test_batch_analysis.test.ts
- [ ] T018 [P] Integration test cache management workflow in tests/integration/test_cache_workflow.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Data Models
- [ ] T019 [P] Package model with validation rules in src/models/Package.ts
- [ ] T020 [P] AnalysisReport model with security alerts in src/models/AnalysisReport.ts
- [ ] T021 [P] SecurityAlert model with severity/category enums in src/models/SecurityAlert.ts
- [ ] T022 [P] DependencyTree model with node relationships in src/models/DependencyTree.ts
- [ ] T023 [P] AlternativeRecommendation model with scoring in src/models/AlternativeRecommendation.ts
- [ ] T024 [P] Supporting types (PackageMaintainer, PackageDependency, etc.) in src/models/Types.ts

### Core Services  
- [ ] T025 [P] NPMClient service for package registry API integration in src/services/NPMClient.ts
- [ ] T026 [P] CacheManager service with SQLite persistence in src/services/CacheManager.ts
- [ ] T027 MalwareAnalyzer service combining static analysis + LLM in src/services/MalwareAnalyzer.ts
- [ ] T028 ReportGenerator service for output formatting (JSON/text/HTML) in src/services/ReportGenerator.ts
- [ ] T029 DependencyTreeBuilder service for recursive analysis in src/services/DependencyTreeBuilder.ts

### CLI Commands
- [ ] T030 [P] Analyze command implementation with all options in src/cli/AnalyzeCommand.ts
- [ ] T031 [P] Scan command for package.json analysis in src/cli/ScanCommand.ts
- [ ] T032 [P] Cache command for cache management in src/cli/CacheCommand.ts
- [ ] T033 [P] Config command for configuration management in src/cli/ConfigCommand.ts
- [ ] T034 Main CLI entry point with Commander.js setup in src/cli/cli.ts

### Library Integrations
- [ ] T035 [P] OpenRouter LLM client with rate limiting in src/lib/OpenRouterClient.ts
- [ ] T036 [P] Static analysis engine integrating js-x-ray and NodeSecure in src/lib/StaticAnalyzer.ts
- [ ] T037 [P] Configuration manager for API keys and settings in src/lib/ConfigManager.ts
- [ ] T038 [P] Logger setup with Winston structured logging in src/lib/Logger.ts
- [ ] T039 [P] Error handling utilities and custom error classes in src/lib/ErrorHandler.ts

## Phase 3.4: Integration

- [ ] T040 Connect AnalyzeCommand to MalwareAnalyzer service with error handling
- [ ] T041 Connect ScanCommand to dependency tree analysis workflow  
- [ ] T042 Integrate NPMClient with rate limiting and timeout handling
- [ ] T043 Connect CacheManager to all analysis services for result persistence
- [ ] T044 Integrate OpenRouterClient with MalwareAnalyzer for LLM analysis
- [ ] T045 Connect ReportGenerator to all commands for consistent output formatting
- [ ] T046 Add structured logging throughout all services and commands
- [ ] T047 Implement global error handling and exit codes per CLI contract

## Phase 3.5: Polish

### Unit Tests
- [ ] T048 [P] Unit tests for Package model validation in tests/unit/models/test_Package.test.ts
- [ ] T049 [P] Unit tests for AnalysisReport aggregation logic in tests/unit/models/test_AnalysisReport.test.ts
- [ ] T050 [P] Unit tests for SecurityAlert confidence scoring in tests/unit/models/test_SecurityAlert.test.ts
- [ ] T051 [P] Unit tests for NPMClient API parsing in tests/unit/services/test_NPMClient.test.ts
- [ ] T052 [P] Unit tests for CacheManager TTL logic in tests/unit/services/test_CacheManager.test.ts
- [ ] T053 [P] Unit tests for ReportGenerator formatting in tests/unit/services/test_ReportGenerator.test.ts

### Performance & Validation
- [ ] T054 Performance test: single package analysis <2s target in tests/performance/test_analysis_speed.test.ts
- [ ] T055 Performance test: dependency tree analysis <10s for 100 packages in tests/performance/test_tree_speed.test.ts
- [ ] T056 End-to-end validation using quickstart.md scenarios in tests/e2e/test_quickstart_scenarios.test.ts
- [ ] T057 [P] Update CLAUDE.md with implementation details and usage patterns
- [ ] T058 [P] Create package.json publish configuration and README.md
- [ ] T059 Remove code duplication and apply consistent error handling patterns
- [ ] T060 Run final integration tests and validate all CLI exit codes

## Dependencies

**Setup Dependencies**:
- T001 → T002 → T003,T004,T005 (project structure before configuration)

**Test Dependencies**:
- T006-T018 must complete and FAIL before ANY T019+ implementation tasks

**Implementation Dependencies**:
- T019-T024 (models) → T025-T029 (services) → T030-T034 (CLI) → T035-T039 (lib)
- T027 depends on T025,T026 (MalwareAnalyzer needs NPMClient and CacheManager)
- T034 depends on T030-T033 (CLI entry needs all commands)
- T040-T047 (integration) depend on all core implementation (T019-T039)

**Polish Dependencies**:
- T048-T060 depend on all integration tasks (T040-T047)

## Parallel Execution Examples

### Setup Phase (after T002):
```bash
# Launch T003-T005 together:
Task: "Install dependencies: commander.js, winston, node-cache, sqlite3, uuid, semver, js-x-ray, open-router SDK"
Task: "Configure linting with ESLint, Prettier, and TypeScript compiler settings per research.md" 
Task: "Setup Jest testing framework with TypeScript support and test scripts in package.json"
```

### Contract Tests (after setup):
```bash
# Launch T006-T013 together:
Task: "Contract test for analyze command CLI interface in tests/contract/test_analyze_command.test.ts"
Task: "Contract test for scan command CLI interface in tests/contract/test_scan_command.test.ts"
Task: "Contract test for cache command CLI interface in tests/contract/test_cache_command.test.ts"
Task: "Contract test for config command CLI interface in tests/contract/test_config_command.test.ts"
Task: "Contract test for MalwareAnalyzer service interface in tests/contract/test_malware_analyzer.test.ts"
Task: "Contract test for NPMClient service interface in tests/contract/test_npm_client.test.ts"
Task: "Contract test for CacheManager service interface in tests/contract/test_cache_manager.test.ts"
Task: "Contract test for ReportGenerator service interface in tests/contract/test_report_generator.test.ts"
```

### Data Models (after tests fail):
```bash
# Launch T019-T024 together:
Task: "Package model with validation rules in src/models/Package.ts"
Task: "AnalysisReport model with security alerts in src/models/AnalysisReport.ts"
Task: "SecurityAlert model with severity/category enums in src/models/SecurityAlert.ts"
Task: "DependencyTree model with node relationships in src/models/DependencyTree.ts"
Task: "AlternativeRecommendation model with scoring in src/models/AlternativeRecommendation.ts"
Task: "Supporting types (PackageMaintainer, PackageDependency, etc.) in src/models/Types.ts"
```

### CLI Commands (after services):
```bash
# Launch T030-T033 together:
Task: "Analyze command implementation with all options in src/cli/AnalyzeCommand.ts"
Task: "Scan command for package.json analysis in src/cli/ScanCommand.ts"
Task: "Cache command for cache management in src/cli/CacheCommand.ts"
Task: "Config command for configuration management in src/cli/ConfigCommand.ts"
```

## Notes
- [P] tasks = different files, no dependencies between them
- Verify all tests fail before implementing (T019+)
- Commit after each task completion
- Follow TDD: RED (test fails) → GREEN (make it pass) → REFACTOR
- Use exact file paths as specified in task descriptions
- Performance targets: <2s single package, <10s dependency tree (100 packages)

## Task Generation Rules Applied

1. **From CLI Contract** (cli-interface.yaml):
   - analyze, scan, cache, config commands → T006-T009 (contract tests) + T030-T033 (implementation)

2. **From API Schema** (api-schema.yaml):
   - Services: MalwareAnalyzer, NPMClient, CacheManager, ReportGenerator → T010-T013 (contract tests) + T025-T028 (implementation)

3. **From Data Model** (data-model.md):
   - Entities: Package, AnalysisReport, SecurityAlert, DependencyTree, AlternativeRecommendation → T019-T024 (model creation)

4. **From Quickstart** (quickstart.md scenarios):
   - User stories → T014-T018 (integration tests) + T056 (E2E validation)

5. **From Plan** (plan.md tech stack):
   - Node.js + TypeScript + Commander.js + Jest → T001-T005 (setup)
   - Libraries: js-x-ray, NodeSecure, OpenRouter → T035-T039 (lib integration)

## Validation Checklist ✅

- [x] All CLI commands have contract tests (T006-T009)
- [x] All services have contract tests (T010-T013)  
- [x] All entities have model tasks (T019-T024)
- [x] All tests come before implementation (T006-T018 before T019+)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] Performance requirements addressed (T054-T055)
- [x] Constitutional requirements met (TDD, libraries as CLI, structured logging)