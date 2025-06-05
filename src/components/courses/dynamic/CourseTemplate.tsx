import React from "react";
import { CourseTitle } from "./CourseTitle";
import { CourseHighlights } from "./CourseHighlights";
import { CourseLearningPoints } from "./CourseLearningPoints";
import { CourseStepList } from "./CourseStepList";

interface Step {
    id?: string;
    title: string;
    videoUrl: string;
    transcript: string;
}

interface CourseTemplateProps {
    title: string;
    highlights: string[];
    whatYouWillLearn: string[];
    steps: Step[];
}

export function CourseTemplate({ title, highlights, whatYouWillLearn, steps }: CourseTemplateProps) {
    return (
        <div className="min-h-screen bg-coastal-light-grey">
            <div className="max-w-6xl mx-auto space-y-8 p-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-coastal-sand">
                    <CourseTitle title={title} />
                    <CourseHighlights highlights={highlights} />
                    <CourseLearningPoints points={whatYouWillLearn} />
                    <CourseStepList steps={steps} />
                </div>
            </div>
        </div>
    );
} 