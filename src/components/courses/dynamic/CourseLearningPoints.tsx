import React from "react";

export function CourseLearningPoints({ points }: { points: string[] }) {
    if (!points?.length) return null;
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-coastal-teal mb-2">What You&apos;ll Learn</h2>
            <ul className="list-disc pl-6 space-y-1">
                {points.map((p, i) => (
                    <li key={i} className="text-coastal-dark-grey">{p}</li>
                ))}
            </ul>
        </div>
    );
} 