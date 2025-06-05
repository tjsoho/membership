import React from "react";
import { ContentStepField } from "./ContentStepField";

interface CourseStep {
    title: string;
    videoUrl: string;
    transcript: string;
    duration?: string;
}

interface ContentStepItemProps {
    step: CourseStep;
    onChange: (field: keyof CourseStep, value: string) => void;
    onRemove: () => void;
}

export function ContentStepItem({ step, onChange, onRemove }: ContentStepItemProps) {
    return (
        <div className="border p-4 rounded mb-4">
            <ContentStepField label="Step Title" value={step.title} onChange={(v: string) => onChange("title", v)} textarea={false} required={true} />
            <ContentStepField label="YouTube Embed URL" value={step.videoUrl} onChange={(v: string) => onChange("videoUrl", v)} textarea={false} required={true} />
            <ContentStepField label="Duration" value={step.duration || ""} onChange={(v: string) => onChange("duration", v)} textarea={false} required={false} />
            <ContentStepField label="Transcript" value={step.transcript} onChange={(v: string) => onChange("transcript", v)} textarea={true} required={false} />
            <button type="button" onClick={onRemove} className="text-red-500 mt-2">Remove Step</button>
        </div>
    );
} 