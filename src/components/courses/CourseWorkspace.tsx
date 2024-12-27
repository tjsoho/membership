"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { exportToBlob } from "@excalidraw/excalidraw";
import { IoSave, IoMail, IoClose } from "react-icons/io5";
import { MdNote, MdDraw, MdExpandMore, MdExpandLess } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ExcalidrawWorkspace,
  ExcalidrawContent,
  ExcalidrawElement,
} from "./ExcalidrawWorkspace";

import { showToast } from "@/utils/toast";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Descendant } from "slate";

type TabType = "mindmap" | "notes" | null;
type WorkspaceType = "MINDMAP" | "NOTES";

interface WorkspaceItem {
  id: string;
  title: string;
  type: WorkspaceType;
  content: ExcalidrawContent | Descendant[] | string;
  createdAt: Date;
}

interface CourseWorkspaceProps {
  userEmail: string;
  courseId: string;
}

type AppState = {
  viewBackgroundColor: string;
  currentItemFontFamily: number;
  zoom: { value: number };
  scrollX: number;
  scrollY: number;
};

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

const defaultNoteContent: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export function CourseWorkspace({ userEmail, courseId }: CourseWorkspaceProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [noteContent, setNoteContent] =
    useState<Descendant[]>(defaultNoteContent);
  const [editingItem, setEditingItem] = useState<WorkspaceItem | null>(null);
  const [sceneVersion, setSceneVersion] = useState<number>(0);
  const excalidrawRef = useRef<any>(null);

  const [tmpElement, setTmpElement] = useState<ExcalidrawElement[]>([]);
  const [tmpAppState, setTmpAppState] = useState<AppState>({
    viewBackgroundColor: "#ffffff",
    currentItemFontFamily: 1,
    zoom: { value: 1 },
    scrollX: 0,
    scrollY: 0,
  });

  const [showTypeSelector, setShowTypeSelector] = useState(false);

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
      console.log("Fetching workspace items for course:", courseId);
      const response = await fetch(`/api/workspace?courseId=${courseId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch workspace items: ${errorText}`);
      }

      const items = await response.json();
      console.log("Fetched workspace items:", items);
      setWorkspaceItems(items);
    } catch (error) {
      console.error("Error fetching workspace items:", error);
    }
  };

  useEffect(() => {
    fetchWorkspaceItems();
  }, [courseId]);

  const handleSave = async () => {
    if (!currentTitle) {
      showToast.error("Error", "Please enter a title");
      return;
    }

    try {
      let content: ExcalidrawContent | Descendant[];

      if (activeTab === "mindmap") {
        if (!tmpElement || !tmpAppState) {
          throw new Error("Mind map content is not ready");
        }

        content = {
          elements: tmpElement || [],
          appState: {
            viewBackgroundColor: tmpAppState?.viewBackgroundColor || "#ffffff",
            currentItemFontFamily: tmpAppState?.currentItemFontFamily || 1,
            zoom: tmpAppState?.zoom || { value: 1 },
            scrollX: tmpAppState?.scrollX || 0,
            scrollY: tmpAppState?.scrollY || 0,
          },
        };
      } else {
        // Ensure we have valid Slate content
        content =
          noteContent.length > 0
            ? noteContent
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ];
      }

      const payload = {
        title: currentTitle,
        type: getWorkspaceType(activeTab),
        content: content,
        courseId,
      };

      console.log("Saving with payload:", payload);

      const method = editingItem ? "PUT" : "POST";
      const url = "/api/workspace";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingItem
            ? {
                id: editingItem.id,
                ...payload,
              }
            : payload
        ),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const savedItem = await response.json();
      console.log("Saved item:", savedItem);

      if (editingItem) {
        setWorkspaceItems((items) =>
          items.map((item) => (item.id === savedItem.id ? savedItem : item))
        );
      } else {
        setWorkspaceItems((items) => [savedItem, ...items]);
      }

      setEditingItem(savedItem);

      showToast.success(
        editingItem ? "Updated" : "Saved",
        editingItem
          ? "Item has been successfully updated"
          : "Item has been successfully saved"
      );
    } catch (error) {
      console.error("Save error:", error);
      showToast.error(
        "Error",
        (error as Error).message || "Failed to save item"
      );
    }
  };

  const handleEdit = (item: WorkspaceItem) => {
    console.log("Editing item:", item);
    console.log("Raw content:", item.content);

    setActiveTab(item.type === "MINDMAP" ? "mindmap" : "notes");
    setCurrentTitle(item.title);

    if (item.type === "MINDMAP") {
      try {
        const savedContent = item.content as ExcalidrawContent;
        console.log("Parsed Excalidraw content:", savedContent);

        if (!savedContent || !savedContent.elements) {
          console.error("Invalid mindmap content structure");
          return;
        }

        // Initialize with empty arrays if needed
        const content: ExcalidrawContent = {
          elements: Array.isArray(savedContent.elements)
            ? savedContent.elements
            : [],
          appState: {
            viewBackgroundColor:
              savedContent.appState?.viewBackgroundColor || "#ffffff",
            currentItemFontFamily:
              savedContent.appState?.currentItemFontFamily || 1,
            zoom: savedContent.appState?.zoom || { value: 1 },
            scrollX: savedContent.appState?.scrollX || 0,
            scrollY: savedContent.appState?.scrollY || 0,
          },
        };

        console.log("Initialized content:", content);
        setEditingItem(item);
      } catch (error) {
        console.error("Error parsing Excalidraw content:", error);
      }
    } else {
      setEditingItem(item);
      if (Array.isArray(item.content)) {
        setNoteContent(item.content as Descendant[]);
      } else if (typeof item.content === "string") {
        // Handle legacy string content or convert from string if needed
        setNoteContent([
          {
            type: "paragraph",
            children: [{ text: item.content }],
          },
        ]);
      } else {
        // Fallback to default content
        setNoteContent(defaultNoteContent);
      }
    }
  };

  const handleSendEmail = async (item: WorkspaceItem) => {
    try {
      showToast.info("Processing", "Preparing your workspace item...");
      let fileBlob: Blob;

      if (item.type === "MINDMAP") {
        const mindmapContent = item.content as ExcalidrawContent;
        fileBlob = await exportToBlob({
          elements: mindmapContent.elements,
          mimeType: "image/png",
          appState: {
            ...mindmapContent.appState,
            exportWithDarkMode: false,
            exportBackground: true,
            viewBackgroundColor: "#ffffff",
            exportScale: 2,
            exportPadding: 40,
          },
          files: null,
          getDimensions: (width: number, height: number) => ({
            width: Math.max(width, 1920),
            height: Math.max(height, 1080),
            scale: 2,
          }),
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

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([fileBlob], {
          type: item.type === "MINDMAP" ? "image/png" : "application/pdf",
        })
      );
      formData.append("title", item.title);
      formData.append("email", userEmail);
      formData.append(
        "fileType",
        item.type === "MINDMAP" ? "mindmap" : "notes"
      );

      const response = await fetch("/api/workspace/send-email", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send email");
      }

      showToast.success(
        "Sent!",
        "Your workspace item has been sent to your email"
      );
    } catch (error) {
      console.error("Failed to send email:", error);
      showToast.error(
        "Send Failed",
        error instanceof Error
          ? error.message
          : "Unable to send your workspace item"
      );
    }
  };

  const handleNew = () => {
    setEditingItem(null);
    setCurrentTitle("");
    setNoteContent(defaultNoteContent);

    // Only update Excalidraw state if we're in mindmap mode
    if (activeTab === "mindmap" && tmpAppState) {
      setTmpElement([]);
      setTmpAppState({
        viewBackgroundColor: "#ffffff",
        currentItemFontFamily: 1,
        zoom: { value: 1 },
        scrollX: 0,
        scrollY: 0,
      });
    }
  };

  const handleExcalidrawSave = (content: ExcalidrawContent) => {
    if (!editingItem) return;

    console.log("Handling Excalidraw save:", content);

    fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingItem.id,
        title: editingItem.title,
        content: content,
      }),
    }).catch((error) => {
      console.error("Error auto-saving:", error);
    });
  };

  const handleDelete = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation(); // Prevent the parent button's onClick from firing

      showToast.delete(
        "Confirm Delete",
        "Are you sure you want to delete this item?",
        async () => {
          try {
            const response = await fetch(`/api/workspace?id=${itemId}`, {
              method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete item");

            // Update the items list
            setWorkspaceItems((prevItems) =>
              prevItems.filter((item) => item.id !== itemId)
            );

            // Clear the editing state if we're deleting the currently edited item
            if (editingItem?.id === itemId) {
              setEditingItem(null);
              setCurrentTitle("");
              setNoteContent(defaultNoteContent);
            }

            showToast.success("Deleted", "Item has been successfully deleted");
          } catch (error) {
            console.error("Failed to delete item:", error);
            showToast.error("Error", "Failed to delete item");
          }
        }
      );
    },
    [editingItem]
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-coastal-sand overflow-hidden">
      {/* Workspace Header */}
      <div className="border-b border-coastal-sand p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-medium text-coastal-dark-teal">
            Your Workspace
          </h2>
          <div className="flex gap-2">
            {!showTypeSelector && (
              <button
                onClick={() => {
                  setShowTypeSelector(true);
                  setEditingItem(null);
                  setCurrentTitle("");
                  setNoteContent(defaultNoteContent);
                  setTmpElement([]);
                  setTmpAppState({
                    viewBackgroundColor: "#ffffff",
                    currentItemFontFamily: 1,
                    zoom: { value: 1 },
                    scrollX: 0,
                    scrollY: 0,
                  });
                }}
                className="px-4 py-2 text-white bg-coastal-dark-teal hover:bg-coastal-light-grey hover:text-coastal-dark-teal hover:border-2 hover:border-coastal-dark-teal rounded-lg transition-colors"
              >
                New
              </button>
            )}
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

        {isExpanded && showTypeSelector && !editingItem && (
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => {
                  setActiveTab("mindmap");
                  setShowTypeSelector(false);
                  setNoteContent(defaultNoteContent);
                  setTmpElement([]);
                  setTmpAppState({
                    viewBackgroundColor: "#ffffff",
                    currentItemFontFamily: 1,
                    zoom: { value: 1 },
                    scrollX: 0,
                    scrollY: 0,
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-coastal-dark-grey hover:border-coastal-dark-teal hover:bg-coastal-light-grey transition-colors"
              >
                <MdDraw size={24} />
                <span>Create Mind Map</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("notes");
                  setShowTypeSelector(false);
                  setNoteContent(defaultNoteContent);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-coastal-dark-grey hover:border-coastal-dark-teal hover:bg-coastal-light-grey transition-colors"
              >
                <MdNote size={24} />
                <span>Create Notes</span>
              </button>
            </div>
          </div>
        )}

        {isExpanded && (editingItem || activeTab) && (
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder={editingItem ? "Edit title..." : "Enter title..."}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-coastal-sand focus:border-coastal-dark-teal focus:ring-2 focus:ring-coastal-dark-teal/20"
            />
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-coastal-dark-teal text-white rounded-lg hover:bg-coastal-light-teal transition-colors"
            >
              <IoSave size={20} />
              {editingItem ? "Update" : "Save"}
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setCurrentTitle("");
                setNoteContent(defaultNoteContent);
                setActiveTab(null);
                setShowTypeSelector(false);
              }}
              className="px-4 py-2 border-2 border-coastal-sand text-coastal-dark-grey rounded-lg hover:bg-coastal-light-grey transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Main content area */}
      {isExpanded && (
        <div className="grid grid-cols-4 h-[600px]">
          {/* Sidebar */}
          <div className="col-span-1 border-r border-coastal-sand overflow-y-auto p-4">
            <h3 className=" text-coastal-dark-teal mb-4 font-medium text-2xl">
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
                        ? "border-coastal-dark-teal border-2 bg-coastal-light-grey/20"
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
                        title="Send via email"
                      >
                        <IoMail size={16} />
                      </button>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDelete(e, item.id);
                        }}
                        className="text-red-500 hover:text-red-700 transition-all"
                        title="Delete item"
                      >
                        <IoClose size={16} />
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
            {editingItem ? (
              // Show editor for existing item
              editingItem.type === "MINDMAP" ? (
                <ExcalidrawWorkspace
                  key={editingItem.id}
                  content={editingItem.content as ExcalidrawContent}
                  onSave={handleExcalidrawSave}
                  isEditing={true}
                  setTmpAppState={setTmpAppState}
                  setTmpElement={setTmpElement}
                />
              ) : (
                <RichTextEditor value={noteContent} onChange={setNoteContent} />
              )
            ) : showTypeSelector ? (
              // Show message when type selector is open
              <div className="flex items-center justify-center h-full text-coastal-dark-grey">
                <p className="text-lg">
                  Select the type of workspace you want to create
                </p>
              </div>
            ) : activeTab !== null ? (
              // Show new editor based on selected type
              activeTab === "mindmap" ? (
                <ExcalidrawWorkspace
                  key="new"
                  content={undefined}
                  onSave={handleExcalidrawSave}
                  isEditing={false}
                  setTmpAppState={setTmpAppState}
                  setTmpElement={setTmpElement}
                />
              ) : (
                <RichTextEditor
                  value={defaultNoteContent}
                  onChange={setNoteContent}
                />
              )
            ) : (
              // Show empty state message
              <div className="flex flex-col items-center justify-center h-full text-coastal-dark-grey">
                <p className="text-lg mb-2">Your workspace is empty</p>
                <p className="text-sm">
                  Click &quot;New&quot; to start creating
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
