"use client";
import React from "react";
import { CourseWorkspace } from "./CourseWorkspace";
import { useSession } from "next-auth/react";

interface DefaultCourseContentProps {
    courseId: string;
}

export function DefaultCourseContent({ courseId }: DefaultCourseContentProps) {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-coastal-shell py-12">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">Course Content</h1>
                    {session?.user?.email && (
                        <CourseWorkspace
                            courseId={courseId}
                            userEmail={session.user.email}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}