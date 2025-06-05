import React from "react";

export function CourseHighlights({ highlights }: { highlights: string[] }) {
    if (!highlights?.length) return null;
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-coastal-teal mb-2">Highlights</h2>
            <ul className="list-disc pl-6 space-y-1">
                {highlights.map((h, i) => (
                    <li key={i} className="text-coastal-dark-grey">{h}</li>
                ))}
            </ul>
        </div>
    );
} 