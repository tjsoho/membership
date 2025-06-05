import React from "react";

export function ContentStepField({ label, value, onChange, textarea, required }) {
    return (
        <div className="mb-2">
            <label className="block text-sm font-medium text-coastal-ocean mb-1">{label}</label>
            {textarea ? (
                <textarea
                    className="block w-full rounded border p-2"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                />
            ) : (
                <input
                    className="block w-full rounded border p-2"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                />
            )}
        </div>
    );
} 