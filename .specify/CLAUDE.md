# Spec-First Workflow Instructions

## Overview
This document outlines the spec-first development workflow to be followed for this project.

## Steps to Follow

1. **Read the Constitution** - Start by reviewing `.specify/constitution.md` to understand the principles, constraints, and quality rules that govern this project.

2. **Read the Specifications** - Before implementing any feature, carefully read the relevant specification documents in `.specify/specs/` to understand the requirements, user stories, and acceptance criteria.

3. **Implement Against Specifications** - Write code that directly implements the functionality described in the specifications. Ensure every feature maps back to a specific requirement in the specs.

4. **Verify Against Acceptance Criteria** - Test your implementation against the acceptance criteria defined in the specifications to ensure it meets all requirements.

5. **Maintain Traceability** - Keep a clear connection between specifications and implementation. When in doubt, refer back to the specs.

## Key Principles
- No implementation without a corresponding specification
- Stay within the defined constraints (console app, in-memory storage)
- Follow quality rules for clean, beginner-friendly code
- Don't add features beyond what's specified