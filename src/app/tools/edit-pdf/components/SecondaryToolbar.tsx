"use client";

import { useState, useEffect } from "react";
import { TextElement, RedactElement } from "@/types/editor";

interface SecondaryToolbarProps {
  selectedTool: string;
  activeShapeType: "rectangle" | "circle";
  activeShapeColor: string;
  onShapeTypeChange: (type: "rectangle" | "circle") => void;
  onShapeColorChange: (color: string) => void;
  selectedTextElement?: TextElement;
  onUpdateTextFormat?: (id: string, updates: Partial<TextElement>) => void;
  editingElementId?: string | null;
  selectedRedactElement?: RedactElement | null;
  onUpdateRedactColor?: (id: string, color: string) => void;
}

function Divider() {
  return <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />;
}

function ToolbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-2 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-primary/20 shrink-0 text-slate-500 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
      {children}
    </div>
  );
}

function ButtonBase({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex items-center justify-center hover:text-primary transition-colors rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

export function SecondaryToolbar({
  selectedTool,
  activeShapeType,
  activeShapeColor,
  onShapeTypeChange,
  onShapeColorChange,
  selectedTextElement,
  onUpdateTextFormat,
  editingElementId,
  selectedRedactElement,
  onUpdateRedactColor,
}: SecondaryToolbarProps) {
  // Track live selection formatting when editing inside contenteditable
  const [selBold, setSelBold] = useState(false);
  const [selItalic, setSelItalic] = useState(false);
  const [selUnderline, setSelUnderline] = useState(false);

  useEffect(() => {
    const updateFromSelection = () => {
      if (!editingElementId) return;
      try {
        setSelBold(document.queryCommandState('bold'));
        setSelItalic(document.queryCommandState('italic'));
        setSelUnderline(document.queryCommandState('underline'));
      } catch { /* ignore */ }
    };
    document.addEventListener('selectionchange', updateFromSelection);
    return () => {
      document.removeEventListener('selectionchange', updateFromSelection);
      // Reset formatting state when leaving editing mode
      setSelBold(false);
      setSelItalic(false);
      setSelUnderline(false);
    };
  }, [editingElementId]);

  if (selectedTool === "text" || selectedTextElement) {
    const fontSize = selectedTextElement ? selectedTextElement.fontSize : 24;
    const color = selectedTextElement ? selectedTextElement.color : "#000000";
    const id = selectedTextElement ? selectedTextElement.id : null;
    const isEditing = editingElementId && editingElementId === id;
    // When editing: show live selection state; when block selected: show block CSS state
    const isBold = isEditing ? selBold : (selectedTextElement?.isBold ?? false);
    const isItalic = isEditing ? selItalic : (selectedTextElement?.isItalic ?? false);
    const isUnderline = isEditing ? selUnderline : (selectedTextElement?.isUnderline ?? false);
    const textAlign = selectedTextElement?.textAlign ?? "left";
    const fontFamily = selectedTextElement?.fontFamily ?? "Arial";
    const backgroundColor = selectedTextElement?.backgroundColor || "transparent";
    const shapeType = selectedTextElement?.shapeType || "none";

    return (
      <div className="flex flex-col w-full shrink-0">
        <ToolbarWrapper>
          <div className="flex items-center gap-1.5 px-2">
            <span className="material-symbols-outlined text-[16px] text-slate-500">font_download</span>
            <select 
              value={fontFamily} 
              onChange={(e) => id && onUpdateTextFormat && onUpdateTextFormat(id, { fontFamily: e.target.value })}
              className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-300 cursor-pointer max-w-[120px]"
              disabled={!id}
            >
              <option className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300" value="Arial">Arial</option>
              <option className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300" value="Times New Roman">Times</option>
              <option className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300" value="Courier New">Courier</option>
              <option className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300" value="Georgia">Georgia</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 px-2">
            <span className="material-symbols-outlined text-[16px] text-slate-500">format_size</span>
            <select 
              value={fontSize} 
              onChange={(e) => id && onUpdateTextFormat && onUpdateTextFormat(id, { fontSize: Number(e.target.value) })}
              className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-300 cursor-pointer"
              disabled={!id}
            >
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 48, 64, 72].map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">{s}pt</option>
              ))}
            </select>
          </div>
          <Divider />
          {/* B/I/U: if user is typing (editingElementId), use execCommand for partial selection; else apply to whole block */}
          <ButtonBase 
            className={`size-8 font-serif font-bold text-[15px] transition-colors ${isBold ? 'bg-primary/10 text-primary border-primary/30' : ''}`} 
            title="Bold (applies to selection or block)"
            onMouseDown={(e) => e.preventDefault()} 
            onClick={() => {
              if (editingElementId && editingElementId === id) {
                document.execCommand('bold');
              } else if (id && onUpdateTextFormat) {
                onUpdateTextFormat(id, { isBold: !isBold });
              }
            }}
            disabled={!id}
          >B</ButtonBase>
          <ButtonBase 
            className={`size-8 font-serif italic text-[15px] transition-colors ${isItalic ? 'bg-primary/10 text-primary border-primary/30' : ''}`} 
            title="Italic (applies to selection or block)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (editingElementId && editingElementId === id) {
                document.execCommand('italic');
              } else if (id && onUpdateTextFormat) {
                onUpdateTextFormat(id, { isItalic: !isItalic });
              }
            }}
            disabled={!id}
          >I</ButtonBase>
          <ButtonBase 
            className={`size-8 font-serif underline text-[15px] transition-colors ${isUnderline ? 'bg-primary/10 text-primary border-primary/30' : ''}`} 
            title="Underline (applies to selection or block)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (editingElementId && editingElementId === id) {
                document.execCommand('underline');
              } else if (id && onUpdateTextFormat) {
                onUpdateTextFormat(id, { isUnderline: !isUnderline });
              }
            }}
            disabled={!id}
          >U</ButtonBase>
          <Divider />
          <div className="flex gap-1.5 items-center px-2 py-2">
            {["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].map(c => (
              <button
                key={c}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (editingElementId && editingElementId === id) {
                    document.execCommand('foreColor', false, c);
                  } else if (id && onUpdateTextFormat) {
                    onUpdateTextFormat(id, { color: c });
                  }
                }}
                style={{ backgroundColor: c }}
                disabled={!id}
                title="Text color"
                className={`w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all ${color === c ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600 hover:scale-105'}`}
              />
            ))}
            <div 
              className={`relative w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all hover:scale-105 overflow-hidden ${!["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].includes(color) ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600'}`} 
              style={!["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].includes(color) ? { backgroundColor: color } : { background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
              title="Custom Color"
            >
               <input type="color" value={color} onChange={(e) => id && onUpdateTextFormat && onUpdateTextFormat(id, { color: e.target.value })} disabled={!id} className="absolute inset-0 opacity-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer" />
            </div>
          </div>
          <ButtonBase 
            className="size-8" 
            title="Alignment"
            onClick={() => {
              if (!id || !onUpdateTextFormat) return;
              const nextAlign = textAlign === "left" ? "center" : textAlign === "center" ? "right" : "left";
              onUpdateTextFormat(id, { textAlign: nextAlign });
            }}
            disabled={!id}
          >
            <span className="material-symbols-outlined text-[18px]">
              {textAlign === 'center' ? 'format_align_center' : textAlign === 'right' ? 'format_align_right' : 'format_align_left'}
            </span>
          </ButtonBase>
        </ToolbarWrapper>

        <ToolbarWrapper>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mx-2">Background Shape</span>
          
          {/* Text Shape Type (None, Rectangle, Circle) */}
          <ButtonBase 
            className={`size-8 font-serif transition-colors ${shapeType === 'none' ? 'bg-primary/10 text-primary border-primary/30' : ''}`} 
            title="No Shape"
            onClick={() => id && onUpdateTextFormat && onUpdateTextFormat(id, { shapeType: 'none', backgroundColor: 'transparent' })}
            disabled={!id}
          >
            <span className="material-symbols-outlined text-[18px]">block</span>
          </ButtonBase>
          <ButtonBase 
            className={`size-8 transition-colors ${shapeType === 'rectangle' ? 'bg-primary/10 text-primary border-primary/30' : ''}`} 
            title="Rectangle Shape"
            onClick={() => id && onUpdateTextFormat && onUpdateTextFormat(id, { shapeType: 'rectangle', backgroundColor: backgroundColor === 'transparent' ? '#000000' : backgroundColor })}
            disabled={!id}
          >
            <span className="material-symbols-outlined text-[18px]">rectangle</span>
          </ButtonBase>
          <ButtonBase 
            className={`size-8 transition-colors ${shapeType === 'circle' ? 'bg-primary/10 text-primary border-primary/30' : ''}`} 
            title="Circle Shape"
            onClick={() => id && onUpdateTextFormat && onUpdateTextFormat(id, { shapeType: 'circle', backgroundColor: backgroundColor === 'transparent' ? '#000000' : backgroundColor })}
            disabled={!id}
          >
            <span className="material-symbols-outlined text-[18px]">circle</span>
          </ButtonBase>

          {/* Text Background Color */}
          <Divider />
          <div className={`flex gap-1.5 items-center px-2 py-2 transition-opacity duration-200 ${shapeType === 'none' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:block">Fill</span>
            {["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].map(c => (
              <button
                key={c}
                onClick={() => id && onUpdateTextFormat && onUpdateTextFormat(id, { backgroundColor: c })}
                style={{ backgroundColor: c }}
                disabled={!id || shapeType === 'none'}
                title="Background Color"
                className={`w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all ${backgroundColor === c ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600 hover:scale-105'}`}
              />
            ))}
            <div 
              className={`relative w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all hover:scale-105 overflow-hidden ${!["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b", "transparent"].includes(backgroundColor) ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600'}`} 
              style={!["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b", "transparent"].includes(backgroundColor) ? { backgroundColor: backgroundColor } : { background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
              title="Custom Background"
            >
               <input type="color" value={backgroundColor === 'transparent' ? '#000000' : backgroundColor} onChange={(e) => id && onUpdateTextFormat && onUpdateTextFormat(id, { backgroundColor: e.target.value })} disabled={!id || shapeType === 'none'} className="absolute inset-0 opacity-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer" />
            </div>
          </div>
        </ToolbarWrapper>
      </div>
    );
  }

  // Shape selected: show its color editor
  if (selectedRedactElement) {
    const COLORS = ["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b", "#f59e0b", "#10b981", "#8b5cf6"];
    const currentColor = selectedRedactElement.color;
    return (
      <ToolbarWrapper>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mx-2">Shape Color</span>
        <div className="flex gap-1.5 items-center px-2 py-1">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => onUpdateRedactColor && onUpdateRedactColor(selectedRedactElement.id, c)}
              style={{ backgroundColor: c }}
              title={c}
              className={`w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all ${currentColor === c ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600 hover:scale-105'}`}
            />
          ))}
          <div
            className={`relative w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all hover:scale-105 overflow-hidden ${!COLORS.includes(currentColor) ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600'}`}
            style={!COLORS.includes(currentColor) ? { backgroundColor: currentColor } : { background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
            title="Custom Color"
          >
            <input type="color" value={currentColor} onChange={(e) => onUpdateRedactColor && onUpdateRedactColor(selectedRedactElement.id, e.target.value)} className="absolute inset-0 opacity-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer" />
          </div>
        </div>
      </ToolbarWrapper>
    );
  }

  if (selectedTool === "image") {
    return null;
  }

  if (selectedTool === "redact") {
    return (
      <ToolbarWrapper>
        <div className="flex gap-1.5 items-center px-2 py-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:block">Color</span>
          {["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].map(c => (
            <button
              key={c}
              onClick={() => onShapeColorChange(c)}
              style={{ backgroundColor: c }}
              title="Shape Color"
              className={`w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all ${activeShapeColor === c ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600 hover:scale-105'}`}
            />
          ))}
          <div 
            className={`relative w-6 h-6 shrink-0 rounded-full shadow-sm border transition-all hover:scale-105 overflow-hidden ${!["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].includes(activeShapeColor) ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-slate-300 dark:border-slate-600'}`} 
            style={!["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"].includes(activeShapeColor) ? { backgroundColor: activeShapeColor } : { background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
            title="Custom Color"
          >
             <input type="color" value={activeShapeColor} onChange={(e) => onShapeColorChange(e.target.value)} className="absolute inset-0 opacity-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer" />
          </div>
        </div>
        <Divider />
        <button
          onClick={() => onShapeTypeChange("rectangle")}
          className={`flex items-center justify-center size-8 transition-colors rounded-lg border ${
            activeShapeType === "rectangle"
              ? "bg-primary/10 text-primary border-primary/30"
              : "hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          }`}
          title="Rectangle"
        >
          <span className="material-symbols-outlined text-[18px]">rectangle</span>
        </button>
        <button
          onClick={() => onShapeTypeChange("circle")}
          className={`flex items-center justify-center size-8 transition-colors rounded-lg border ${
            activeShapeType === "circle"
              ? "bg-primary/10 text-primary border-primary/30"
              : "hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          }`}
          title="Circle"
        >
          <span className="material-symbols-outlined text-[18px]">circle</span>
        </button>
      </ToolbarWrapper>
    );
  }

  return null;
}
