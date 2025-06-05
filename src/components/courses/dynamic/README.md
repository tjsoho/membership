# Dynamic Course Components

This directory contains single-use components for dynamic course content rendering.

## Guidelines

- Each component should be **single-use** (one responsibility per file).
- **Maximum 50 lines** per component (excluding imports/exports).
- Follow the project coding notes and conventions.
- Components should be composable and receive all data via props.
- No layout changes to the original course template.

## Structure Example

- CourseTemplate.tsx (main entry, composes all others)
- CourseTitle.tsx
- CourseStepList.tsx
- CourseStep.tsx
- CourseHighlights.tsx
- CourseLearningPoints.tsx

Add new components as needed for new dynamic content sections.
