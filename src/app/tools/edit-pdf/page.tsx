"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { FileUploader } from "@/components/shared/FileUploader";
import { useEditPdfUI } from "@/hooks/useEditPdfUI";
import { ToolType } from "@/types/editor";

export default function EditPdfPage() {
  const {
    pdfFile,
    pdfDoc,
    numPages,
    currentPageIndex,
    setCurrentPageIndex,
    pageThumbnails,
    isReadingPdf,
    isProcessing,
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    isWatermarkModalOpen,
    setIsWatermarkModalOpen,
    fileInputRef,
    imageInputRef,
    canvasRef,
    canvasContainerRef,
    sigCanvasRef,
    selectedTool,
    setSelectedTool,
    textElements,
    setTextElements,
    imageElements,
    setImageElements,
    redactElements,
    setRedactElements,
    watermark,
    setWatermark,
    handleFileSelected,
    renderPage,
    handleWorkspaceClick,
    handleImageUpload,
    handleElementPointerDown,
    handlePointerMove,
    handlePointerUp,
    startDrawing,
    drawSignature,
    stopDrawing,
    clearSignature,
    saveSignature,
    saveInitials,
    onSaveClick,
    cancelEdit,
    pdfEdits,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
  } = useEditPdfUI();

  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [initialsText, setInitialsText] = useState("");

  useEffect(() => {
    if (pdfDoc && canvasRef.current)
      renderPage(currentPageIndex, canvasRef.current);
  }, [pdfDoc, currentPageIndex, renderPage, canvasRef]);

  const updateText = (id: string, text: string) =>
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, text } : el)),
    );
  const removeElement = (id: string, type: "text" | "image" | "redact") => {
    if (type === "text")
      setTextElements((prev) => prev.filter((el) => el.id !== id));
    if (type === "image")
      setImageElements((prev) => prev.filter((el) => el.id !== id));
    if (type === "redact")
      setRedactElements((prev) => prev.filter((el) => el.id !== id));
  };

  const tools: { id: ToolType | "watermark"; name: string; icon: string }[] = [
    { id: "text", name: "Add Text", icon: "match_case" },
    { id: "image", name: "Add Image", icon: "image" },
    { id: "signature", name: "Sign", icon: "history_edu" },
    { id: "redact", name: "Redact", icon: "ink_eraser" },
    { id: "watermark", name: "Watermark", icon: "branding_watermark" },
  ];

  const handleToolClick = (toolId: ToolType | "watermark") => {
    if (toolId === "image") imageInputRef.current?.click();
    else if (toolId === "signature") setIsSignatureModalOpen(true);
    else if (toolId === "watermark") setIsWatermarkModalOpen(true);
    else setSelectedTool((prev) => (prev === toolId ? "none" : toolId));
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100"
      onPointerUp={handlePointerUp}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Edit PDF
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Add text, images, redact confidential info, and sign your PDF
                documents.
              </p>
            </div>

            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
            />

            {!pdfFile ? (
              <FileUploader
                onFilesSelected={handleFileSelected}
                isProcessing={isReadingPdf}
                accept="application/pdf"
                multiple={false}
                icon="edit_document"
                buttonText="Select PDF file"
                subtitle="Select a single PDF to start editing"
                hasHistory={pdfEdits.length > 0}
              />
            ) : (
              <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
                {/* BARRA LATERAL IZQUIERDA */}
                <div className="w-full lg:w-32 flex flex-col gap-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                  {Array.from({ length: numPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPageIndex(i)}
                      className={`relative w-full aspect-[1/1.4] rounded-xl flex flex-col items-center justify-center font-bold text-sm transition-all border-2 overflow-hidden ${
                        currentPageIndex === i
                          ? "border-primary shadow-md"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1c29] text-slate-400 hover:border-primary/50"
                      }`}
                    >
                      {pageThumbnails[i] ? (
                        <img
                          src={pageThumbnails[i]}
                          alt={`Page ${i + 1}`}
                          className="w-full h-full object-cover opacity-90"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-3xl opacity-20">
                          description
                        </span>
                      )}
                      <span
                        className={`absolute bottom-1 px-2 py-0.5 rounded text-[10px] ${currentPageIndex === i ? "bg-primary text-white" : "bg-white/90 text-slate-700"}`}
                      >
                        {i + 1}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ÁREA CENTRAL */}
                <div className="flex-1 w-full flex flex-col bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden min-h-[700px]">
                  <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-[#1a1c29] border-b border-slate-200 dark:border-primary/20">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() =>
                          handleToolClick(tool.id as ToolType | "watermark")
                        }
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedTool === tool.id || (tool.id === "watermark" && watermark.text) ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {tool.icon}
                        </span>
                        {tool.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 bg-slate-100/50 dark:bg-[#0B0F19] p-4 md:p-8 flex justify-center items-start overflow-auto custom-scrollbar relative">
                    {selectedTool !== "none" &&
                      selectedTool !== "signature" && (
                        <div className="absolute top-4 bg-primary/90 text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-lg z-50 pointer-events-none">
                          Click anywhere to place
                        </div>
                      )}

                    <div
                      ref={canvasContainerRef}
                      onClick={handleWorkspaceClick}
                      onPointerMove={handlePointerMove}
                      className="relative shadow-xl transition-transform h-fit w-fit mx-auto select-none touch-none bg-white"
                      style={{
                        cursor:
                          selectedTool !== "none" ? "crosshair" : "default",
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        className="block max-w-full h-auto"
                      />

                      {/* ✨ TEXTOS */}
                      {textElements
                        .filter((el) => el.pageIndex === currentPageIndex)
                        .map((el) => (
                          <div
                            key={el.id}
                            className="absolute group p-3 cursor-move border-2 border-transparent hover:border-primary/30 rounded-lg pointer-events-auto transition-colors"
                            style={{
                              left: `calc(${el.x}% - 12px)`,
                              top: `calc(${el.y}% - 12px)`,
                            }}
                            onPointerDown={(e) =>
                              handleElementPointerDown(e, el.id, "text", "move")
                            }
                          >
                            {/* Icono de arrastre visual */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-slate-400 border border-slate-200 shadow-sm rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                              <span className="material-symbols-outlined text-[12px]">
                                drag_indicator
                              </span>
                            </div>

                            <input
                              type="text"
                              value={el.text}
                              onChange={(e) =>
                                updateText(el.id, e.target.value)
                              }
                              style={{
                                color: el.color,
                                fontSize: `${el.fontSize}px`,
                              }}
                              className="font-sans font-medium outline-none border-none p-0 bg-transparent min-w-[50px] cursor-text pointer-events-auto"
                              onPointerDown={(e) => e.stopPropagation()}
                            />

                            <button
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                removeElement(el.id, "text");
                              }}
                              className="absolute -top-3 -right-3 size-6 rounded-full bg-white text-rose-500 hover:bg-rose-500 hover:text-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-200"
                            >
                              <span className="material-symbols-outlined text-[12px] font-bold">
                                close
                              </span>
                            </button>
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(e, el.id, "text", "se")
                              }
                              className="absolute -bottom-1 -right-1 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize shadow-md"
                            />
                          </div>
                        ))}

                      {/* ✨ CENSURA (Las 4 esquinas completas) */}
                      {redactElements
                        .filter((el) => el.pageIndex === currentPageIndex)
                        .map((el) => (
                          <div
                            key={el.id}
                            className="absolute group border border-transparent hover:border-primary/50 pointer-events-auto cursor-move"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.width}%`,
                              height: `${el.height}%`,
                              background: el.color,
                            }}
                            onPointerDown={(e) =>
                              handleElementPointerDown(
                                e,
                                el.id,
                                "redact",
                                "move",
                              )
                            }
                          >
                            <button
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                removeElement(el.id, "redact");
                              }}
                              className="absolute -top-3 -right-3 size-6 rounded-full bg-white text-rose-500 hover:bg-rose-600 hover:text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-200 z-20"
                            >
                              <span className="material-symbols-outlined text-[14px] font-bold">
                                close
                              </span>
                            </button>

                            {/* Puntos de anclaje GRANDES (4 esquinas) */}
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "redact",
                                  "nw",
                                )
                              }
                              className="absolute -top-2 -left-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-nw-resize shadow-md"
                            />
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "redact",
                                  "ne",
                                )
                              }
                              className="absolute -top-2 -right-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-ne-resize shadow-md"
                            />
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "redact",
                                  "sw",
                                )
                              }
                              className="absolute -bottom-2 -left-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-sw-resize shadow-md"
                            />
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "redact",
                                  "se",
                                )
                              }
                              className="absolute -bottom-2 -right-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize shadow-md"
                            />
                          </div>
                        ))}

                      {/* ✨ IMÁGENES / FIRMAS (Las 4 esquinas completas) */}
                      {imageElements
                        .filter((el) => el.pageIndex === currentPageIndex)
                        .map((el) => (
                          <div
                            key={el.id}
                            className="absolute group border-2 border-dashed border-transparent hover:border-primary p-0.5 pointer-events-auto cursor-move"
                            style={{
                              left: `${el.x}%`,
                              top: `${el.y}%`,
                              width: `${el.width}%`,
                            }}
                            onPointerDown={(e) =>
                              handleElementPointerDown(
                                e,
                                el.id,
                                "image",
                                "move",
                              )
                            }
                          >
                            <img
                              src={el.base64Data}
                              alt="Added"
                              className="w-full h-auto block rounded-sm pointer-events-none"
                              draggable={false}
                            />

                            <button
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                removeElement(el.id, "image");
                              }}
                              className="absolute -top-3 -right-3 size-6 rounded-full bg-white text-rose-500 hover:bg-rose-600 hover:text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-200 z-20"
                            >
                              <span className="material-symbols-outlined text-[14px] font-bold">
                                close
                              </span>
                            </button>

                            {/* Puntos de anclaje GRANDES (4 esquinas) */}
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "image",
                                  "nw",
                                )
                              }
                              className="absolute -top-2 -left-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-nw-resize shadow-md"
                            />
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "image",
                                  "ne",
                                )
                              }
                              className="absolute -top-2 -right-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-ne-resize shadow-md"
                            />
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "image",
                                  "sw",
                                )
                              }
                              className="absolute -bottom-2 -left-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-sw-resize shadow-md"
                            />
                            <div
                              onPointerDown={(e) =>
                                handleElementPointerDown(
                                  e,
                                  el.id,
                                  "image",
                                  "se",
                                )
                              }
                              className="absolute -bottom-2 -right-2 size-4 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize shadow-md"
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1a1c29] border-t border-slate-200 dark:border-primary/20">
                    <button
                      onClick={() =>
                        setCurrentPageIndex((p) => Math.max(0, p - 1))
                      }
                      disabled={currentPageIndex === 0}
                      className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:text-primary transition-colors disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-lg">
                        chevron_left
                      </span>{" "}
                      Prev
                    </button>
                    <span className="text-sm font-bold text-slate-500">
                      Page {currentPageIndex + 1} of {numPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPageIndex((p) =>
                          Math.min(numPages - 1, p + 1),
                        )
                      }
                      disabled={currentPageIndex === numPages - 1}
                      className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:text-primary transition-colors disabled:opacity-40"
                    >
                      Next{" "}
                      <span className="material-symbols-outlined text-lg">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>

                {/* BARRA LATERAL DERECHA */}
                <div className="w-full lg:w-72 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-6 flex flex-col sticky top-24">
                  <h3 className="text-xl font-bold mb-2">Save PDF</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Your edits will be permanently applied.
                  </p>

                  <div className="flex flex-col gap-3 mb-6 border-b border-slate-100 dark:border-primary/20 pb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">File</span>
                      <span
                        className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]"
                        title={pdfFile.name}
                      >
                        {pdfFile.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Elements</span>
                      <span className="font-bold text-primary">
                        {textElements.length +
                          imageElements.length +
                          redactElements.length}
                      </span>
                    </div>
                    {watermark.text && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Watermark</span>
                        <span className="font-bold text-emerald-500">
                          Applied
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onSaveClick}
                    disabled={isProcessing || isReadingPdf}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          sync
                        </span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Save{" "}
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="w-full mt-3 text-sm text-slate-400 hover:text-rose-500 font-bold py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfEdits}
            isLoading={isColaLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
          />
        </main>
        <Footer />
      </div>

      {/* MODAL DE FIRMA MAGISTRAL */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1c29] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  draw
                </span>{" "}
                Add Signature
              </h3>
              <button
                onClick={() => setIsSignatureModalOpen(false)}
                className="text-slate-400 hover:text-rose-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
              <button
                onClick={() => setSigMode("draw")}
                className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors ${sigMode === "draw" ? "border-primary text-primary" : "border-transparent text-slate-500"}`}
              >
                Draw
              </button>
              <button
                onClick={() => setSigMode("type")}
                className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors ${sigMode === "type" ? "border-primary text-primary" : "border-transparent text-slate-500"}`}
              >
                Type Initials
              </button>
            </div>
            {sigMode === "draw" ? (
              <div className="bg-slate-50 dark:bg-white rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden mb-4 cursor-crosshair touch-none">
                <canvas
                  ref={sigCanvasRef}
                  width={450}
                  height={200}
                  className="w-full h-full block"
                  onMouseDown={startDrawing}
                  onMouseMove={drawSignature}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="text"
                  value={initialsText}
                  onChange={(e) => setInitialsText(e.target.value)}
                  // Detecta la tecla Enter y aplica las iniciales automáticamente
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveInitials(initialsText);
                    }
                  }}
                  autoFocus // Auto-focus para poder escribir directamente
                  placeholder="e.g. WM"
                  maxLength={5}
                  className="w-full px-4 py-8 text-center text-4xl font-serif italic rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary"
                />{" "}
              </div>
            )}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={
                  sigMode === "draw"
                    ? clearSignature
                    : () => setInitialsText("")
                }
                className="text-sm font-bold text-slate-500 px-4 py-2"
              >
                Clear
              </button>
              <button
                onClick={() =>
                  sigMode === "draw"
                    ? saveSignature()
                    : saveInitials(initialsText)
                }
                className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
              >
                Apply Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE WATERMARK */}
      {isWatermarkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1c29] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                branding_watermark
              </span>{" "}
              Global Watermark
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              This text will be applied diagonally to all pages.
            </p>
            <input
              type="text"
              value={watermark.text}
              onChange={(e) =>
                setWatermark({ ...watermark, text: e.target.value })
              }
              // Escucha la tecla Enter y cierra el modal
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setIsWatermarkModalOpen(false);
                }
              }}
              autoFocus // Opcional: Hace que puedas escribir nada más abrir el modal
              placeholder="e.g. DRAFT or CONFIDENTIAL"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-background-dark text-sm outline-none focus:ring-2 focus:ring-primary mb-6"
            />
            <button
              onClick={() => setIsWatermarkModalOpen(false)}
              className="w-full bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
