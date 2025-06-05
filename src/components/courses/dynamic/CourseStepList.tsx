import React from "react";
import { CourseStep } from "./CourseStep";

interface Step {
    id?: string;
    title: string;
    videoUrl: string;
    transcript: string;
}

export function CourseStepList({ steps }: { steps: Step[] }) {
    if (!steps?.length) return null;
    return (
        <div className="space-y-6">
            {steps.map((step: Step, i: number) => (
                <CourseStep key={step.id || i} step={step} />
            ))}
        </div>
    );
} 