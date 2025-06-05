import React from "react";
import { CourseStep } from "./CourseStep";

export function CourseStepList({ steps }) {
    if (!steps?.length) return null;
    return (
        <div className="space-y-6">
            {steps.map((step, i) => (
                <CourseStep key={step.id || i} step={step} />
            ))}
        </div>
    );
} 