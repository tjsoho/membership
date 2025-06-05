"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminCourseContentForm } from "../../../../../components/admin/courseContentForm/AdminCourseContentForm";
import React from "react";
export default function AdminCourseContentPage() {
    const { courseId } = useParams();
    const [initialSteps, setInitialSteps] = useState([]);

    useEffect(() => {
        fetch(`/api/admin/courses/${courseId}/steps`)
            .then(res => res.json())
            .then(data => setInitialSteps(data.steps || []));
    }, [courseId]);

    const handleSave = async (steps: Array<{ title: string; videoUrl: string; transcript: string; duration?: string }>) => {
        await fetch(`/api/admin/courses/${courseId}/steps`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ steps }),
        });
        // Optionally show a toast
    };

    return <AdminCourseContentForm initialSteps={initialSteps} onSave={handleSave} />;
} 