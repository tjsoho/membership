# Admin Course Content Form Components

This directory contains single-use components for the admin course content form.

## Guidelines

- Each component should be **single-use** (one responsibility per file).
- **Maximum 50 lines** per component (excluding imports/exports).
- Follow the project coding notes and conventions.
- Components should be composable and receive all data via props.
- Designed for use in the admin course content creation/editing flow.

## Structure Example

- AdminCourseContentForm.tsx (main entry, composes all others)
- ContentStepList.tsx
- ContentStepItem.tsx
- ContentStepField.tsx

Add new components as needed for new content sections.
