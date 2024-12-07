'use client'

import { useState, useEffect } from 'react'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { MdOutlineSubtitles } from 'react-icons/md'
import { CourseWorkspace } from './CourseWorkspace'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

interface CourseStep {
  id: number
  title: string
  duration: string
  videoUrl: string
  transcript: string
  completed?: boolean
}

// Mock data - replace with real data later
const courseSteps: CourseStep[] = [
  {
    id: 1,
    title: 'Introduction',
    duration: '5:30',
    videoUrl: 'https://www.youtube.com/embed/your-video-id',
    transcript: 'Welcome to the course...',
    completed: false
  },
  {
    id: 2,
    title: 'Tools I use',
    duration: '5:30',
    videoUrl: 'https://www.youtube.com/embed/your-video-id',
    transcript: 'Welcome to the course...',
    completed: false
  },
  // ... other steps
]

export function PerfectHomePage() {
  const [activeStep, setActiveStep] = useState(courseSteps[0])
  const [showTranscript, setShowTranscript] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState<Record<number, boolean>>({})
  const [overallProgress, setOverallProgress] = useState(0)
  const { data: session } = useSession()
  const params = useParams()
  const courseId = params.courseId as string

  // Calculate overall progress
  useEffect(() => {
    const completedSteps = Object.values(progress).filter(Boolean).length
    setOverallProgress((completedSteps / courseSteps.length) * 100)
  }, [progress])

  // Mark step as completed
  const markStepCompleted = (stepId: number) => {
    setProgress(prev => ({
      ...prev,
      [stepId]: true
    }))
  }

  // Handle video state
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    // You would implement actual video control here
  }

  const handleSendWorkspaceItem = async (file: Blob, title: string, email: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('email', email)

      const response = await fetch('/api/workspace/send-email', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      alert('Sent successfully!')
    } catch (error) {
      console.error('Failed to send:', error)
      alert('Failed to send. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-coastal-light-grey">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-72 bg-white h-screen shadow-lg fixed left-0 overflow-y-auto border-r border-coastal-sand">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-coastal-dark-teal mb-2">
                Course Progress
              </h2>
              <div className="relative h-2 bg-coastal-light-grey rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-coastal-dark-teal transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-sm text-coastal-dark-grey mt-2">
                {Math.round(overallProgress)}% Complete
              </p>
            </div>

            <nav className="space-y-3">
              {courseSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                    ${activeStep.id === step.id 
                      ? 'bg-coastal-dark-teal text-white shadow-md' 
                      : 'text-coastal-dark-grey hover:bg-coastal-light-grey'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                      ${progress[step.id] 
                        ? 'bg-coastal-light-teal text-white' 
                        : 'border-2 border-current'}`}
                    >
                      {progress[step.id] ? <IoCheckmarkCircle size={20} /> : step.id}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm opacity-75">{step.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-72 flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-coastal-sand">
              <h1 className="text-3xl font-bold text-coastal-dark-teal mb-6">
                {activeStep.title}
              </h1>

              {/* Video Player Container */}
              <div className="relative">
                <div className="aspect-video mb-4 bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={activeStep.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-between p-4 bg-coastal-light-grey/50 rounded-lg">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-full hover:bg-coastal-dark-teal hover:text-white
                             transition-colors"
                  >
                    {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
                  </button>

                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                             text-coastal-dark-teal hover:bg-coastal-dark-teal hover:text-white
                             transition-colors"
                  >
                    <MdOutlineSubtitles size={20} />
                    {showTranscript ? 'Hide' : 'Show'} Transcript
                  </button>

                  <button
                    onClick={() => markStepCompleted(activeStep.id)}
                    className={`px-4 py-2 rounded-lg transition-colors
                      ${progress[activeStep.id]
                        ? 'bg-coastal-light-teal text-white'
                        : 'bg-coastal-dark-teal text-white hover:bg-coastal-light-teal'}`}
                  >
                    {progress[activeStep.id] ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>

              {/* Transcript */}
              {showTranscript && (
                <div className="mt-6 p-6 bg-coastal-light-grey/30 rounded-lg border border-coastal-sand">
                  <div className="prose prose-coastal max-w-none">
                    <p className="text-coastal-dark-grey leading-relaxed">
                      {activeStep.transcript}
                    </p>
                  </div>
                </div>
              )}

              {/* Add Workspace Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-coastal-sand">
                <h2 className="text-2xl font-bold text-coastal-dark-teal mb-6">
                  Your Workspace
                </h2>
                <CourseWorkspace 
                  userEmail={session?.user?.email || ''}
                  courseId={courseId}
                  onSend={handleSendWorkspaceItem}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}