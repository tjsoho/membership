import React, { useState } from "react";
import { ContentStepList } from "./ContentStepList";

export function AdminCourseContentForm({ initialSteps = [], onSave }) {
    const [steps, setSteps] = useState(initialSteps);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(steps);
        setSaving(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Add Course Content</h2>
            <ContentStepList steps={steps} setSteps={setSteps} />
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-coastal-dark-teal text-white px-4 py-2 rounded mt-4"
            >
                {saving ? "Saving..." : "Save Content"}
            </button>
        </div>
    );
} 