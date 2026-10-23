"use client";

import { ToolType, WatermarkConfig } from "@/types/editor";

export interface Tool {
  id: ToolType | "watermark";
  name: string;
  icon: string;
}

export const EDITOR_TOOLS: Tool[] = [
  { id: "none", name: "Navigate", icon: "pan_tool_alt" },
  { id: "text", name: "Add Text", icon: "text_fields" },
  { id: "image", name: "Add Image", icon: "image" },
  { id: "signature", name: "Sign", icon: "draw" },
  { id: "redact", name: "Add Shape", icon: "category" },
  { id: "watermark", name: "Watermark", icon: "branding_watermark" },
];

interface EditorToolbarProps {
  selectedTool: ToolType;
  watermark: WatermarkConfig;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToolClick: (toolId: ToolType | "watermark") => void;
}

export function EditorToolbar({
  selectedTool,
  watermark,
  isSidebarOpen,
  onToggleSidebar,
  onToolClick,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-[#1a1c29] border-b border-slate-200 dark:border-primary/20 shrink-0">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center size-10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1423] shadow-sm"
          title={isSidebarOpen ? "Hide Pages Panel" : "Show Pages Panel"}
        >
          <span className="material-symbols-outlined text-[20px]">view_sidebar</span>
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
        {EDITOR_TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              selectedTool === tool.id || (tool.id === "watermark" && watermark.text)
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tool.icon}</span>
            {tool.name}
          </button>
        ))}
      </div>
    </div>
  );
}
