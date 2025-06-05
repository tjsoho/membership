import React from "react";
import { ContentStepItem } from "./ContentStepItem";

interface CourseStep {
    title: string;
    videoUrl: string;
    transcript: string;
    duration?: string;
}

interface ContentStepListProps {
    steps: CourseStep[];
    setSteps: React.Dispatch<React.SetStateAction<CourseStep[]>>;
}

export function ContentStepList({ steps, setSteps }: ContentStepListProps) {
    const addStep = () => setSteps([...steps, { title: "", videoUrl: "", transcript: "", duration: "" }]);
    const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
    const updateStep = (i: number, field: keyof CourseStep, value: string) => setSteps(
        steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
    );

    return (
        <div>
            {steps.map((step: CourseStep, i: number) => (
                <ContentStepItem
                    key={i}
                    step={step}
                    onChange={(field: keyof CourseStep, value: string) => updateStep(i, field, value)}
                    onRemove={() => removeStep(i)}
                />
            ))}
            <button type="button" onClick={addStep} className="text-coastal-teal mt-2">Add Step</button>
        </div>
    );
} 