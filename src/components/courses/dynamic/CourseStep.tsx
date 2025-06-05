import React, { useState } from "react";

export function CourseStep({ step }) {
    const [showTranscript, setShowTranscript] = useState(false);
    return (
        <div className="bg-coastal-light-grey rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <div className="aspect-video mb-2">
                <iframe
                    src={step.videoUrl}
                    className="w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <button
                className="text-coastal-dark-teal underline mb-2"
                onClick={() => setShowTranscript((v) => !v)}
            >
                {showTranscript ? "Hide" : "Show"} Transcript
            </button>
            {showTranscript && (
                <div className="bg-white border border-coastal-sand rounded p-3 mt-2">
                    <p className="text-coastal-dark-grey whitespace-pre-line">{step.transcript}</p>
                </div>
            )}
        </div>
    );
} 