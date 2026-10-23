"use client";

import { TextElement, ImageElement, RedactElement, WatermarkConfig } from "@/types/editor";
import { toast } from "react-hot-toast";
import { ToolActionButton } from "@/components/tools";

type AnyElement =
  | (TextElement & { type: "text" })
  | (ImageElement & { type: "image" | "signature" })
  | (RedactElement & { type: "redact" });

interface LayerManagementPanelProps {
  currentPageIndex: number;
  currentPageElements: AnyElement[];
  watermark: WatermarkConfig;
  selectedElementId: string | null;
  draggedLayerId: string | null;
  dragOverLayerId: string | null;
  isProcessing: boolean;
  isReadingPdf: boolean;
  textElements: TextElement[];
  imageElements: ImageElement[];
  redactElements: RedactElement[];
  onSelectElement: (id: string) => void;
  onRenameElement: (id: string, type: string, name: string) => void;
  onRemoveElement: (id: string, type: "text" | "image" | "redact") => void;
  onRemoveWatermark: () => void;
  onRemoveAll: () => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragLeave: () => void;
  onDrop: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function LayerIcon({ type }: { type: string }) {
  const icon =
    type === "text" ? "text_fields" :
    type === "signature" ? "draw" :
    type === "redact" ? "category" : "image";
  return <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">{icon}</span>;
}

export function LayerManagementPanel({
  currentPageIndex,
  currentPageElements,
  watermark,
  selectedElementId,
  draggedLayerId,
  dragOverLayerId,
  isProcessing,
  isReadingPdf,
  textElements,
  imageElements,
  redactElements,
  onSelectElement,
  onRenameElement,
  onRemoveElement,
  onRemoveWatermark,
  onRemoveAll,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onSave,
  onCancel,
}: LayerManagementPanelProps) {
  const hasNoElements =
    textElements.length === 0 &&
    imageElements.length === 0 &&
    redactElements.length === 0 &&
    !watermark.text;

  return (
    <aside className="w-full lg:w-96 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-6 md:p-8 flex flex-col gap-6 sticky top-24 shrink-0 transition-all">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Edit PDF
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage layers, elements and document annotations.
        </p>
      </div>

      {/* Page indicator + Remove all */}
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Page {currentPageIndex + 1} Layers ({currentPageElements.length})
          </span>
          <button
            type="button"
            onClick={onRemoveAll}
            className={`flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 px-2.5 py-1 rounded-full transition-all ${
              currentPageElements.length > 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">restart_alt</span>
            Reset page
          </button>
        </div>

        {/* Layer list */}
        <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto custom-scrollbar px-1 py-1">
        {currentPageElements.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 dark:text-slate-500 text-sm italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No elements added to this page yet.
          </div>
        ) : (
          currentPageElements.map((el, index) => {
            const isDragged = draggedLayerId === el.id;
            const isDragOver = dragOverLayerId === el.id;
            const draggedIndex = currentPageElements.findIndex((e) => e.id === draggedLayerId);

            return (
              <div
                key={el.id}
                draggable
                onDragStart={() => onDragStart(el.id)}
                onDragOver={(e) => { e.preventDefault(); onDragOver(el.id); }}
                onDragLeave={onDragLeave}
                onDrop={(e) => { e.preventDefault(); onDrop(el.id); }}
                onClick={() => onSelectElement(el.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border group cursor-grab active:cursor-grabbing transition-all relative ${
                  isDragOver && draggedIndex !== -1
                    ? `scale-[1.02] shadow-lg z-10 bg-primary/5 border-primary/40 before:content-[""] before:absolute ${
                        draggedIndex < index ? "before:-bottom-2" : "before:-top-2"
                      } before:left-0 before:w-full before:h-[3px] before:bg-primary before:rounded-full before:z-50`
                    : selectedElementId === el.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 hover:border-primary/30"
                } ${isDragged ? "opacity-40 scale-95" : ""}`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2 pointer-events-auto">
                  <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity cursor-grab shrink-0">
                    <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <LayerIcon type={el.type} />
                    <input
                      type="text"
                      value={el.name || ""}
                      draggable={false}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter" || e.key === "Escape") {
                          e.currentTarget.blur();
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectElement(el.id);
                      }}
                      onChange={(e) => onRenameElement(el.id, el.type, e.target.value)}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (!val) {
                          toast.error("Layer name cannot be empty");
                          onRenameElement(el.id, el.type, `Layer ${el.type}`);
                        } else if (val.length > 50) {
                          toast.error("Layer name cannot exceed 50 characters");
                          onRenameElement(el.id, el.type, val.slice(0, 50));
                        }
                      }}
                      className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 w-full outline-none focus:bg-white dark:focus:bg-slate-900/60 focus:ring-1 focus:ring-primary/40 focus:border-primary px-1.5 py-0.5 rounded transition-all cursor-text"
                      placeholder="Element name"
                      title="Click to rename (press Enter to confirm)"
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveElement(el.id, el.type === "signature" ? "image" : el.type);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded-md transition-all shrink-0 pointer-events-auto"
                  title="Remove layer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            );
          })
        )}

        {/* Watermark entry */}
        {watermark.text && (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-[16px] text-emerald-500 shrink-0">branding_watermark</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 truncate">Global Watermark</span>
            </div>
            <button
              onClick={onRemoveWatermark}
              className="text-emerald-400 hover:text-rose-500 p-1 rounded-md transition-all shrink-0"
              title="Remove Watermark"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Edit PDF / Cancel actions */}
      <div className="pt-4 mt-auto shrink-0 flex flex-col gap-3">
        <ToolActionButton
          onClick={onSave}
          disabled={isProcessing || isReadingPdf || hasNoElements}
          isLoading={isProcessing}
          text="Edit PDF"
          loadingText="Editing PDF..."
          icon="edit_document"
        />
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          Cancel
        </button>
      </div>
    </aside>
  );
}
