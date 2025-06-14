"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { MdOutlineSubtitles } from "react-icons/md";
import { CourseWorkspace } from "./CourseWorkspace";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { HiArrowDown } from "react-icons/hi";
import { Navbar } from "../Navbar";

interface CourseStep {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  transcript: string;
  completed?: boolean;
}

// Mock data - replace with real data later
const courseSteps: CourseStep[] = [
  {
    id: 1,
    title: "Introduction",
    duration: "4.59",
    videoUrl: "https://www.youtube.com/embed/yUywAYciNZM",
    transcript: `Hi there, my name is Toby, and firstly, thank you for buying this mini-course. I'm really, really excited to share with you how you can save time and make money using AI with one, piece of content. It's going to be a game-changer. Now, the great thing about this mini-course is you don't need a marketing background, you don't need to spend hours looking into studying marketing or, or anything like that. Over the next 20 minutes or so, you are literally going to learn how and the techniques that all the bigwigs are doing. Apple, Google, Netflix, this is what they do. So, I'm really excited to share this with you. Before we get started, I'll give you a quick little background as to who I am and why I'm here, ah, educating you on this topic and then we're going to jump into the tools that I use. A little bit of the current problem and the current mindset that you might be facing as a business owner, trying to market your product and then we'll actually get into the goods and we will learn the strategy. So, who am I and why am I here talking to you, giving you all of this? Information and education. So, as I said, my name is Toby. I am a software engineer, but before I went into this world of software, and specifically AI, I owned multiple businesses and one of which was a music school. I was pretty much born with a musical instrument in my hand and I, I toured the world performing and I also built multiple music schools with over 300 students and 10 staff. I later sold, sold that music business and I had some time to think what I really wanted to do and I love the actual business side of things. I love setting up a business. I love designing it and running it from the tech point of view and the website and the marketing and how it all sits with little tech tools and all this sort of stuff. Basically I like to geek out on tools. Uhm, so then I started, I studied web development and software engineering. Go full circle now that I'm a software engineer at the same time I was learning this, AI came out and I just fell in love with it and went in a very, very deep hole learning all about AI And on the other side of that hole I have developed a software AI platform called Slug. And Sloan is an AI platform that helps business owners grow and scale their business with ease. I'll talk to you a little bit more about Sloan later on today, uhm, but that's my background. I have worked and coached with over 110 business owners showing them how they can actually adopt AI into their business to make their lives super easy without having to spend hours and hours and hours upon hours wasting time learning new courses and all these sorts of things. My idea here is I want to be able to give you a lot of value that you can start using straight away. That's the goal. My values that I really care about is education and empowerment and easiness. Freedom, I want to be able to do whatever I want, whenever I want, however I want to. I don't want anyone telling me I have to be at a certain place by a certain time and basically living by someone else's rules. So freedom is really, really big for me. Education and empowerment, well, being a music teacher, I guess, by trade is, I've always loved sharing information, uhm, and where I've taken that from here is empowering business owners with tech, with AI, with knowledge that helps them grow their business. And with the third value of mine, grow their business with the gains. You know, sometimes these topics that we're talking about, they're somewhat a little bit big and scary, and I get that. You know, marketing, what is marketing, and how can you do marketing without paying thousands of dollars to a marketing firm, hoping that it's going to work. AI. There's so much talk around AI at the moment, so how can we utilize these tools and these skills to allow us to stay in our zone of genius as a business owner, doing whatever it is that you do, being a specialty in your zone. So, that's how we're going to do it. The reason I wanted to share my values with you is because we're actually going to talk about values. I'll use later on in this mini course, and how we can use it to, and how we should be using our values to deliver content to speak to our audience. So, we'll touch on that a little bit more later. So, as for now, you now know who I am and what we're going to do in this course. And, in the next video, what I'm going to show you is the tools that I use, and also, we're going to talk about the current problem and the little bit of a block that most business owners are finding when they're wearing all the hats and doing it themselves. So, that's what we're going to do. I look forward to seeing you in the next video. Okay, bye.`,
    completed: false,
  },
  {
    id: 2,
    title: "Tools I use",
    duration: "9.38",
    videoUrl: "https://www.youtube.com/embed/rBWL1kmV8J4",
    transcript: "Welcome to the course...",
    completed: false,
  },
  {
    id: 3,
    title: "The Strategy",
    duration: "7.10",
    videoUrl: "https://www.youtube.com/embed/IdtPcAvLC2c",
    transcript: "Welcome to the course...",
    completed: false,
  },
  {
    id: 4,
    title: "Conrtent To Post",
    duration: "5:30",
    videoUrl: "https://www.youtube.com/embed/your-video-id",
    transcript: "Welcome to the course...",
    completed: false,
  },
  {
    id: 5,
    title: "Sloane",
    duration: "5:30",
    videoUrl: "https://www.youtube.com/embed/your-video-id",
    transcript: "Welcome to the course...",
    completed: false,
  },
  // ... other steps
];

export function PerfectHomePage() {
  const [activeStep, setActiveStep] = useState(courseSteps[0]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const { data: session } = useSession();
  const params = useParams();
  const courseId = params.courseId as string;

  // Calculate overall progress
  useEffect(() => {
    const completedSteps = Object.values(progress).filter(Boolean).length;
    setOverallProgress((completedSteps / courseSteps.length) * 100);
  }, [progress]);

  // Load progress when component mounts
  useEffect(() => {
    async function loadProgress() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch(
          `/api/courses/progress?courseId=${params.courseId}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const progressMap = data.reduce(
            (acc: Record<number, boolean>, item: any) => {
              acc[item.stepId] = item.completed;
              return acc;
            },
            {}
          );
          setProgress(progressMap);
        } else {
          console.error("Failed to load progress:", res.statusText);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
    loadProgress();
  }, [params.courseId]);

  // Update the markStepCompleted function
  const markStepCompleted = async (stepId: number) => {
    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: params.courseId,
          stepId,
          completed: true,
        }),
      });

      if (res.ok) {
        setProgress((prev) => ({
          ...prev,
          [stepId]: true,
        }));
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  // Handle video state
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // You would implement actual video control here
  };

  // Add these new states at the top of your component
  const [isVideoFloating, setIsVideoFloating] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState({
    x: 100,
    y: window.innerHeight - 300,
  });
  const videoRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Add this useEffect for intersection observer
  useEffect(() => {
    if (!workspaceRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVideoFloating(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(workspaceRef.current);
    return () => observer.disconnect();
  }, []);

  // Add drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Add state for video time
  const [videoTime, setVideoTime] = useState(0);
  const mainVideoRef = useRef<HTMLIFrameElement>(null);
  const floatingVideoRef = useRef<HTMLIFrameElement>(null);

  // First, add this at the top of your component to load YouTube API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Update the video state
  const [videoState, setVideoState] = useState({
    currentTime: 0,
    isPlaying: false,
    mainPlayer: null as any,
    floatingPlayer: null as any,
    lastUpdateTime: Date.now(),
  });

  // Add a function to sync players
  const syncPlayers = (
    sourcePlayer: any,
    targetPlayer: any,
    currentTime: number
  ) => {
    if (
      targetPlayer &&
      Math.abs(targetPlayer.getCurrentTime() - currentTime) > 1
    ) {
      targetPlayer.seekTo(currentTime);
      if (videoState.isPlaying) {
        targetPlayer.playVideo();
      }
    }
  };

  // Update the initialization function
  const initializePlayers = () => {
    if (!mainVideoRef.current || !floatingVideoRef.current) return;

    const mainPlayer = new (window as any).YT.Player(mainVideoRef.current, {
      events: {
        onReady: (event: any) => {
          setVideoState((prev) => ({
            ...prev,
            mainPlayer: event.target,
          }));
          event.target.seekTo(videoState.currentTime);
          if (videoState.isPlaying) {
            event.target.playVideo();
          }
        },
        onStateChange: (event: any) => {
          if (event.target && event.target.getCurrentTime) {
            const currentTime = event.target.getCurrentTime();
            setVideoState((prev) => ({
              ...prev,
              currentTime,
              isPlaying: event.data === 1,
              lastUpdateTime: Date.now(),
            }));
            if (videoState.floatingPlayer) {
              syncPlayers(event.target, videoState.floatingPlayer, currentTime);
            }
          }
        },
      },
    });

    if (isVideoFloating) {
      const floatingPlayer = new (window as any).YT.Player(
        floatingVideoRef.current,
        {
          events: {
            onReady: (event: any) => {
              setVideoState((prev) => ({
                ...prev,
                floatingPlayer: event.target,
              }));
              event.target.seekTo(videoState.currentTime);
              if (videoState.isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              if (event.target && event.target.getCurrentTime) {
                const currentTime = event.target.getCurrentTime();
                setVideoState((prev) => ({
                  ...prev,
                  currentTime,
                  isPlaying: event.data === 1,
                  lastUpdateTime: Date.now(),
                }));
                if (videoState.mainPlayer) {
                  syncPlayers(event.target, videoState.mainPlayer, currentTime);
                }
              }
            },
          },
        }
      );
    }
  };

  // Add an effect to handle player synchronization
  useEffect(() => {
    if (videoState.mainPlayer && videoState.floatingPlayer) {
      const interval = setInterval(() => {
        const activePlayer = isVideoFloating
          ? videoState.floatingPlayer
          : videoState.mainPlayer;
        const inactivePlayer = isVideoFloating
          ? videoState.mainPlayer
          : videoState.floatingPlayer;

        if (activePlayer && inactivePlayer) {
          const currentTime = activePlayer.getCurrentTime();
          syncPlayers(activePlayer, inactivePlayer, currentTime);
        }
      }, 1000); // Sync every second

      return () => clearInterval(interval);
    }
  }, [videoState.mainPlayer, videoState.floatingPlayer, isVideoFloating]);

  // Update drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - floatingPosition.x,
      y: e.clientY - floatingPosition.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      requestAnimationFrame(() => {
        const newX = Math.min(
          Math.max(0, window.innerWidth - (e.clientX - dragStart.x) - 320),
          window.innerWidth - 320
        );
        const newY = Math.min(
          Math.max(0, e.clientY - dragStart.y),
          window.innerHeight - 180
        );

        setFloatingPosition({ x: newX, y: newY });
      });
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, dragStart.x, dragStart.y]);

  // Update the FloatingVideo component
  const FloatingVideo = () => (
    <div
      style={{
        position: "fixed",
        right: "16px",
        bottom: "16px",
        width: "320px",
        height: "180px",
        zIndex: 50,
      }}
      className="rounded-lg shadow-xl overflow-hidden group"
    >
      <div
        onMouseDown={handleDragStart}
        className="absolute top-0 left-0 right-0 h-8 bg-black/50 cursor-move z-20 
                 opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div id="floating-player" className="w-full h-full">
        <iframe
          ref={floatingVideoRef}
          src={`${activeStep.videoUrl}?enablejsapi=1&origin=${window.location.origin}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );

  // Update the MainVideo component
  const MainVideo = () => (
    <div id="main-player" className="w-full h-full">
      <iframe
        ref={mainVideoRef}
        src={`${activeStep.videoUrl}?enablejsapi=1&origin=${window.location.origin}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );

  // Add this effect after your other useEffects
  useEffect(() => {
    // Wait 5 seconds before showing the toast
    const showTimer = setTimeout(() => {
      const toastId = toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center justify-between p-4`}
          >
            <div className="flex items-center">
              <HiArrowDown className="text-coastal-dark-teal w-6 h-6 animate-bounce" />
              <div className="ml-3">
                <p className="text-[18px] font-medium text-coastal-dark-teal text-center">
                  Workspace Available
                </p>
                <p className="text-sm text-gray-500">
                  Don&apos;t forget to scroll below for your workspace
                </p>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(toastId)}
              className="ml-4 flex-shrink-0 rounded-md p-1.5 
                       hover:bg-coastal-light-grey/50 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-4 w-4 text-coastal-dark-grey"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ),
        {
          duration: 20000,
          position: "bottom-center",
        }
      );
    }, 5000);

    return () => {
      clearTimeout(showTimer);
    };
  }, [activeStep.id]); // Show this reminder when user changes video/step

  return (
    <div className="min-h-screen bg-coastal-light-grey">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-0">
        {/* Left Sidebar */}
        <div className="w-72 bg-white h-[calc(100vh-64px)] shadow-lg fixed left-0 overflow-y-auto border-r border-coastal-sand top-16">
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
                      ? "bg-coastal-dark-teal text-white shadow-md"
                      : "text-coastal-dark-grey hover:bg-coastal-light-grey"
                    }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                      ${progress[step.id]
                          ? "bg-coastal-light-teal text-white"
                          : "border-2 border-current"
                        }`}
                    >
                      {progress[step.id] ? (
                        <IoCheckmarkCircle size={20} />
                      ) : (
                        step.id
                      )}
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
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-coastal-sand">
              <h1 className="text-3xl font-bold text-coastal-dark-teal mb-6">
                {activeStep.title}
              </h1>

              {/* Video Player Container */}
              <div className="relative" ref={videoRef}>
                <div
                  className={`aspect-video mb-4 bg-black rounded-lg overflow-hidden
                               transition-all duration-300
                               ${isVideoFloating ? "opacity-0" : "opacity-100"
                    }`}
                >
                  <MainVideo />
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-between p-4 bg-coastal-light-grey/50 rounded-lg">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-full hover:bg-coastal-dark-teal hover:text-white
                             transition-colors"
                  >
                    {isPlaying ? (
                      <BsPauseFill size={24} />
                    ) : (
                      <BsPlayFill size={24} />
                    )}
                  </button>

                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                             text-coastal-dark-teal hover:bg-coastal-dark-teal hover:text-white
                             transition-colors"
                  >
                    <MdOutlineSubtitles size={20} />
                    {showTranscript ? "Hide" : "Show"} Transcript
                  </button>

                  <button
                    onClick={() => markStepCompleted(activeStep.id)}
                    className={`px-4 py-2 rounded-lg transition-colors
                      ${progress[activeStep.id]
                        ? "bg-coastal-light-teal text-white"
                        : "bg-coastal-dark-teal text-white hover:bg-coastal-light-teal"
                      }`}
                  >
                    {progress[activeStep.id] ? "Completed" : "Mark Complete"}
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
              <div ref={workspaceRef} className="bg-white mt-8">
                <CourseWorkspace
                  userEmail={session?.user?.email || ""}
                  courseId={courseId}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating video */}
        {isVideoFloating && <FloatingVideo />}
      </div>
    </div>
  );
}
