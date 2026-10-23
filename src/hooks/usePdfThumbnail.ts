import { useState, useEffect } from 'react';

export function usePdfThumbnail(file: File | null, renderScale: number = 0.5) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [allThumbnails, setAllThumbnails] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  // null = unknown yet, true = needs password / has restrictions, false = open PDF without protection
  const [isEncrypted, setIsEncrypted] = useState<boolean | null>(null);

  useEffect(() => {
    setIsEncrypted(null);
    if (!file) { 
      setThumbnailUrl(null); 
      setAllThumbnails([]);
      setNumPages(0);
      return; 
    }
    let isMounted = true;
    const generate = async () => {
      setIsGenerating(true);
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
        
        if (!isMounted) return;
        // getPermissions() returns null when the document has no encryption/restrictions
        const permissions = await pdfjsDoc.getPermissions().catch(() => null);
        if (isMounted) setIsEncrypted(permissions !== null);
        const total = pdfjsDoc.numPages;
        setNumPages(total);
        setAllThumbnails([]);

        // Progresivamente generar miniaturas
        const thumbnails: string[] = [];
        for (let i = 1; i <= Math.min(total, 100); i++) {
          if (!isMounted) break;
          const page = await pdfjsDoc.getPage(i);
          const viewport = page.getViewport({ scale: renderScale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
          
          if (i === 1) setThumbnailUrl(dataUrl);
          thumbnails.push(dataUrl);
          if (isMounted) setAllThumbnails([...thumbnails]);
        }
      } catch (err) {
        // Password-protected PDFs can't be previewed; that's expected (e.g. Unlock PDF page)
        const isPasswordError = (err as { name?: string })?.name === 'PasswordException';
        if (isPasswordError) { if (isMounted) setIsEncrypted(true); }
        else console.error('Error generating thumbnail', err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };
    generate();
    return () => { isMounted = false; };
  }, [file, renderScale]);
  
  return { thumbnailUrl, allThumbnails, isGenerating, numPages, isEncrypted };
}
