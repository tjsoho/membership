import React from "react";

export function CourseTitle({ title }: { title: string }) {
    return (
        <h1 className="text-3xl font-bold text-coastal-dark-teal mb-6">
            {title}
        </h1>
    );
} 