"use client";

import React from "react";
import {
  DEFAULT_NUMBER_COLORS,
  FONT_SIZES,
  SHAPES_LIST,
  POSITION_LIST,
} from "@/hooks/useNumberPdfUI";
import { ToolActionButton } from "@/components/tools";

interface NumberPdfSidebarProps {
  position: string;
  setPosition: (pos: string) => void;
  format: string;
  setFormat: (fmt: string) => void;
  formatsList: { id: string; label: string; sample: string }[];
  size: number;
  setSize: (sz: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  textColor: string;
  setTextColor: (col: string) => void;
  shape: string;
  setShape: (shp: string) => void;
  shapeColor: string;
  setShapeColor: (col: string) => void;
  isProcessing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function NumberPdfSidebar({
  position,
  setPosition,
  format,
  setFormat,
  formatsList,
  size,
  setSize,
  fontFamily,
  setFontFamily,
  textColor,
  setTextColor,
  shape,
  setShape,
  shapeColor,
  setShapeColor,
  isProcessing,
  onCancel,
  onSubmit,
}: NumberPdfSidebarProps) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8 justify-center">
      {/* 1. Number Position */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Number Position
        </label>
        <div className="grid grid-cols-3 gap-3">
          {POSITION_LIST.map((p) => {
            const isSelected = position === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPosition(p.id)}
                title={p.title}
                className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all flex flex-col justify-center items-center gap-1 ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20 ring-1 ring-primary/40 font-bold"
                    : "border-slate-200 dark:border-primary/20 hover:border-slate-300 dark:hover:border-primary/40 text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/40"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                <span className="text-xs whitespace-nowrap">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Number Format */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Number Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {formatsList.map((f) => {
            const isSelected = format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-center flex flex-col gap-1 justify-center items-center ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20 ring-1 ring-primary/40 font-bold"
                    : "border-slate-200 dark:border-primary/20 hover:border-slate-300 dark:hover:border-primary/40 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40"
                }`}
              >
                <span className="font-bold text-xs sm:text-sm">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Appearance Section (Card) */}
      <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-primary/20">
        <div className="flex items-end gap-5 flex-wrap sm:flex-nowrap">
          {/* Size */}
          <div className="flex-[0.8] flex flex-col gap-2 min-w-[80px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-primary/30 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              {FONT_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz} pt
                </option>
              ))}
            </select>
          </div>

          {/* Font Family */}
          <div className="flex-1 flex flex-col gap-2 min-w-[120px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Font
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-primary/30 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          {/* Text Color */}
          <div className="flex-[1.4] flex flex-col gap-2 min-w-[250px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Text Color
            </label>
            <div className="flex gap-2.5 min-h-[44px] items-center flex-nowrap overflow-x-auto px-2 py-2">
              {DEFAULT_NUMBER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTextColor(c)}
                  style={{ backgroundColor: c }}
                  className={`size-7 shrink-0 rounded-full shadow-sm border-2 transition-transform ${
                    textColor === c
                      ? "border-primary ring-2 ring-primary/40 scale-110"
                      : "border-slate-300 dark:border-slate-700 hover:scale-105"
                  }`}
                  title={c}
                />
              ))}
              <div
                className={`relative size-7 shrink-0 rounded-full shadow-sm border-2 transition-transform hover:scale-105 overflow-hidden ${
                  !DEFAULT_NUMBER_COLORS.includes(textColor)
                    ? "border-primary ring-2 ring-primary/40 scale-110"
                    : "border-slate-300 dark:border-slate-700"
                }`}
                style={
                  !DEFAULT_NUMBER_COLORS.includes(textColor)
                    ? { backgroundColor: textColor }
                    : { background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }
                }
                title="Custom color"
              >
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="absolute inset-0 opacity-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-5 flex-wrap sm:flex-nowrap">
          {/* Shape */}
          <div className="flex-1 flex flex-col gap-2 min-w-[120px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Shape
            </label>
            <div className="flex bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-primary/30 p-1 shadow-sm h-[38px]">
              {SHAPES_LIST.map((s) => {
                const isSelected = shape === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShape(s.id)}
                    title={s.title}
                    className={`flex-1 flex items-center justify-center rounded-lg transition-all ${
                      isSelected
                        ? "bg-primary/15 text-primary font-bold shadow-sm"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {s.id === "none"
                        ? "block"
                        : s.id === "circle"
                        ? "radio_button_unchecked"
                        : "crop_square"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shape Color */}
          {shape !== "none" && (
            <div className="flex-[1.4] flex flex-col gap-2 min-w-[250px] animate-in fade-in duration-200">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Shape Color
              </label>
              <div className="flex gap-2.5 min-h-[44px] items-center flex-nowrap overflow-x-auto px-2 py-2">
                {DEFAULT_NUMBER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setShapeColor(c)}
                    style={{ backgroundColor: c }}
                    className={`size-7 shrink-0 rounded-full shadow-sm border-2 transition-transform ${
                      shapeColor === c
                        ? "border-primary ring-2 ring-primary/40 scale-110"
                        : "border-slate-300 dark:border-slate-700 hover:scale-105"
                    }`}
                    title={c}
                  />
                ))}
                <div
                  className={`relative size-7 shrink-0 rounded-full shadow-sm border-2 transition-transform hover:scale-105 overflow-hidden ${
                    !DEFAULT_NUMBER_COLORS.includes(shapeColor)
                      ? "border-primary ring-2 ring-primary/40 scale-110"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                  style={
                    !DEFAULT_NUMBER_COLORS.includes(shapeColor)
                      ? { backgroundColor: shapeColor }
                      : {
                          background:
                            "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                        }
                  }
                  title="Custom shape color"
                >
                  <input
                    type="color"
                    value={shapeColor}
                    onChange={(e) => setShapeColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Action buttons */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="btn-secondary w-1/3 flex items-center justify-center gap-2"
        >
          Cancel
        </button>
        <ToolActionButton
          onClick={onSubmit}
          disabled={isProcessing}
          isLoading={isProcessing}
          text="Number PDF"
          loadingText="Numbering..."
          icon="format_list_numbered"
          className="w-2/3"
        />
      </div>
    </div>
  );
}
