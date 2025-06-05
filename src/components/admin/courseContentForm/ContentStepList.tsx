import React from "react";
import { ContentStepItem } from "./ContentStepItem";

export function ContentStepList({ steps, setSteps }) {
    const addStep = () => setSteps([...steps, { title: "", videoUrl: "", transcript: "", duration: "" }]);
    const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));
    const updateStep = (i, field, value) => setSteps(
        steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
    );

    return (
        <div>
            {steps.map((step, i) => (
                <ContentStepItem
                    key={i}
                    step={step}
                    onChange={(field, value) => updateStep(i, field, value)}
                    onRemove={() => removeStep(i)}
                />
            ))}
            <button type="button" onClick={addStep} className="text-coastal-teal mt-2">Add Step</button>
        </div>
    );
} 