"use client";

import { useState, useRef, useEffect } from 'react'
import { exportToBlob } from '@excalidraw/excalidraw'
import { IoSave, IoMail } from 'react-icons/io5'
import { MdNote, MdDraw, MdExpandMore, MdExpandLess } from 'react-icons/md'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { 
  ExcalidrawWorkspace, 
  ExcalidrawContent,
  ExcalidrawElement 
} from './ExcalidrawWorkspace'

type TabType = "mindmap" | "notes";
type WorkspaceType = "MINDMAP" | "NOTES";

interface WorkspaceItem {
  id: string;
  title: string;
  type: WorkspaceType;
  content: ExcalidrawContent | string;
  createdAt: Date;
}

interface CourseWorkspaceProps {
  userEmail: string;
  courseId: string;
  onSend: (file: Blob, title: string, email: string) => Promise<void>;
}

const convertHtmlToPdf = async (html: string): Promise<Blob> => {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    return pdf.output("blob");
  } finally {
    document.body.removeChild(container);
  }
};

export function CourseWorkspace({
  userEmail,
  courseId,
  onSend,
}: CourseWorkspaceProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("mindmap");
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingItem, setEditingItem] = useState<WorkspaceItem | null>(null);
  const [sceneVersion, setSceneVersion] = useState<number>(0);
  const excalidrawRef = useRef<any>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch(`/api/workspace?courseId=${courseId}`);
        if (response.ok) {
          const items = await response.json();
          setWorkspaceItems(items);
        }
      } catch (error) {
        console.error("Failed to load workspace items:", error);
      }
    };

    loadItems();
  }, [courseId]);

  const getWorkspaceType = (tab: TabType): WorkspaceType => {
    return tab === "mindmap" ? "MINDMAP" : "NOTES";
  };

  const fetchWorkspaceItems = async () => {
    try {
      console.log('Fetching workspace items for course:', courseId)
      const response = await fetch(`/api/workspace?courseId=${courseId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch workspace items: ${errorText}`)
      }
      
      const items = await response.json()
      console.log('Fetched workspace items:', items)
      setWorkspaceItems(items)
    } catch (error) {
      console.error('Error fetching workspace items:', error)
    }
  }

  useEffect(() => {
    fetchWorkspaceItems()
  }, [courseId])

  const handleSave = async () => {
    if (!currentTitle) {
      alert('Please enter a title')
      return
    }

    try {
      let content: ExcalidrawContent | string
      
      if (activeTab === 'mindmap') {
        const elements = excalidrawRef.current?.getSceneElements() || []
        const appState = excalidrawRef.current?.getAppState() || {}
        
        content = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: appState.currentItemFontFamily || 1,
            zoom: appState.zoom || { value: 1 },
            scrollX: appState.scrollX || 0,
            scrollY: appState.scrollY || 0,
          }
        }
        console.log('Saving mindmap content:', content)
      } else {
        content = noteContent
      }

      const payload = {
        title: currentTitle,
        type: getWorkspaceType(activeTab),
        content: content,
        courseId,
      }

      console.log('Saving with payload:', payload)

      const method = editingItem ? 'PUT' : 'POST'
      const url = '/api/workspace' + (editingItem ? `/${editingItem.id}` : '')

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem ? {
          id: editingItem.id,
          ...payload
        } : payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const savedItem = await response.json()
      console.log('Saved item:', savedItem)
      
      if (editingItem) {
        setWorkspaceItems(items => 
          items.map(item => item.id === savedItem.id ? savedItem : item)
        )
      } else {
        setWorkspaceItems(items => [savedItem, ...items])
      }

      setEditingItem(savedItem)
    } catch (error) {
      console.error('Failed to save workspace item:', error)
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEdit = (item: WorkspaceItem) => {
    console.log('Editing item:', item)
    console.log('Raw content:', item.content)
    
    setActiveTab(item.type === 'MINDMAP' ? 'mindmap' : 'notes')
    setCurrentTitle(item.title)
    
    if (item.type === 'MINDMAP') {
      try {
        const savedContent = item.content as ExcalidrawContent
        console.log('Parsed Excalidraw content:', savedContent)
        
        if (!savedContent || !savedContent.elements) {
          console.error('Invalid mindmap content structure')
          return
        }
        
        // Initialize with empty arrays if needed
        const content: ExcalidrawContent = {
          elements: Array.isArray(savedContent.elements) ? savedContent.elements : [],
          appState: {
            viewBackgroundColor: savedContent.appState?.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: savedContent.appState?.currentItemFontFamily || 1,
            zoom: savedContent.appState?.zoom || { value: 1 },
            scrollX: savedContent.appState?.scrollX || 0,
            scrollY: savedContent.appState?.scrollY || 0,
          }
        }
        
        console.log('Initialized content:', content)
        setEditingItem(item)
        
      } catch (error) {
        console.error('Error parsing Excalidraw content:', error)
      }
    } else {
      setEditingItem(item)
      setNoteContent(item.content as string)
    }
  }

  const handleSendEmail = async (item: WorkspaceItem) => {
    try {
      let fileBlob: Blob;

      if (item.type === "MINDMAP") {
        const mindmapContent = item.content as ExcalidrawContent;
        fileBlob = await exportToBlob({
          elements: mindmapContent.elements,
          mimeType: "application/pdf",
          appState: mindmapContent.appState || { exportWithDarkMode: false },
        });
      } else {
        const noteHtml = `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
              <h1 style="color: #4EA292;">${item.title}</h1>
              <div style="white-space: pre-wrap; line-height: 1.6;">
                ${item.content}
              </div>
            </body>
          </html>
        `;
        fileBlob = await convertHtmlToPdf(noteHtml);
      }

      await onSend(fileBlob, item.title, userEmail);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const handleNew = () => {
    setEditingItem(null);
    setCurrentTitle("");
    setNoteContent("");
    if (excalidrawRef.current) {
      excalidrawRef.current.updateScene({
        elements: [],
        appState: {
          viewBackgroundColor: "#ffffff",
          currentItemFontFamily: 1,
        },
      });
    }
  };

  const handleExcalidrawSave = (content: ExcalidrawContent) => {
    if (!editingItem) return
    
    console.log('Handling Excalidraw save:', content)
    
    fetch('/api/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingItem.id,
        title: editingItem.title,
        content: content,
      }),
    }).catch(error => {
      console.error('Error auto-saving:', error)
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-coastal-sand overflow-hidden">
      {/* Workspace Header */}
      <div className="border-b border-coastal-sand p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-coastal-dark-teal">
            Workspace
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleNew}
              className="px-4 py-2 text-coastal-dark-teal hover:bg-coastal-light-grey 
                       rounded-lg transition-colors"
            >
              New
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-coastal-light-grey transition-colors"
            >
              {isExpanded ? (
                <MdExpandLess size={24} />
              ) : (
                <MdExpandMore size={24} />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setActiveTab("mindmap")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${
                    activeTab === "mindmap"
                      ? "bg-coastal-dark-teal text-white"
                      : "text-coastal-dark-grey hover:bg-coastal-light-grey"
                  }`}
              >
                <MdDraw size={20} />
                Mind Map
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${
                    activeTab === "notes"
                      ? "bg-coastal-dark-teal text-white"
                      : "text-coastal-dark-grey hover:bg-coastal-light-grey"
                  }`}
              >
                <MdNote size={20} />
                Notes
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder={editingItem ? "Edit title..." : "Enter title..."}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-coastal-sand
                         focus:border-coastal-dark-teal focus:ring-2 focus:ring-coastal-dark-teal/20"
              />
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-coastal-dark-teal text-white
                         rounded-lg hover:bg-coastal-light-teal transition-colors"
              >
                <IoSave size={20} />
                {editingItem ? "Update" : "Save"}
              </button>
              {editingItem && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setCurrentTitle("");
                    setNoteContent("");
                  }}
                  className="px-4 py-2 border-2 border-coastal-sand text-coastal-dark-grey
                           rounded-lg hover:bg-coastal-light-grey transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-4 h-[600px]">
          {/* Sidebar */}
          <div className="col-span-1 border-r border-coastal-sand overflow-y-auto p-4">
            <h3 className="font-medium text-coastal-dark-teal mb-4">
              Saved Items
            </h3>
            <div className="space-y-2">
              {workspaceItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleEdit(item)}
                  className={`w-full p-3 rounded-lg border text-left
                    ${
                      editingItem?.id === item.id
                        ? "border-coastal-dark-teal bg-coastal-light-grey/20"
                        : "border-coastal-sand hover:border-coastal-dark-teal"
                    }
                    transition-colors group`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-coastal-dark-grey">
                      {item.title}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendEmail(item);
                        }}
                        className="text-coastal-dark-teal hover:text-coastal-light-teal transition-all"
                      >
                        <IoMail size={16} />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-coastal-dark-grey">
                    {item.type === "MINDMAP" ? "Mind Map" : "Notes"} •
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Workspace */}
          <div className="col-span-3 h-full">
            {activeTab === "mindmap" ? (
              <ExcalidrawWorkspace
                key={editingItem?.id || 'new'}
                content={editingItem?.type === 'MINDMAP' 
                  ? (editingItem.content as ExcalidrawContent)
                  : undefined}
                onSave={handleExcalidrawSave}
                isEditing={!!editingItem}
              />
            ) : (
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start typing your notes..."
                className="w-full h-full p-4 resize-none border-none focus:ring-0
                         text-coastal-dark-grey"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
