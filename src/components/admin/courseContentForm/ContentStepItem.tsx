import React from "react";
import { ContentStepField } from "./ContentStepField";

export function ContentStepItem({ step, onChange, onRemove }) {
    return (
        <div className="border p-4 rounded mb-4">
            <ContentStepField label="Step Title" value={step.title} onChange={v => onChange("title", v)} textarea={false} required={true} />
            <ContentStepField label="YouTube Embed URL" value={step.videoUrl} onChange={v => onChange("videoUrl", v)} textarea={false} required={true} />
            <ContentStepField label="Duration" value={step.duration} onChange={v => onChange("duration", v)} textarea={false} required={false} />
            <ContentStepField label="Transcript" value={step.transcript} onChange={v => onChange("transcript", v)} textarea={true} required={false} />
            <button type="button" onClick={onRemove} className="text-red-500 mt-2">Remove Step</button>
        </div>
    );
} 