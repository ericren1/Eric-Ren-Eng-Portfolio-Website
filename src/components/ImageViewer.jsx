import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ImageViewerContext = createContext(null);
export const useImageViewer = () => useContext(ImageViewerContext);

export default function ImageViewer({ children }) {
  const [selection, setSelection] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!selection) return;
    if (!dialog.current.open) dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selection !== null]);
  const close = () => dialog.current?.close();
  const move = step => setSelection(current => current && ({ ...current, index: (current.index + step + current.images.length) % current.images.length }));
  const photo = selection?.images[selection.index];
  return <ImageViewerContext.Provider value={(images, index = 0) => {
    trigger.current = document.activeElement;
    setSelection({ images, index });
  }}>{children}<dialog ref={dialog} className="image-viewer" aria-label="Enlarged photograph"
    onClose={() => { setSelection(null); trigger.current?.focus({ preventScroll: true }); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}
    onKeyDown={event => { if (selection?.images.length > 1 && event.key === 'ArrowRight') { event.preventDefault(); move(1); } if (selection?.images.length > 1 && event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } }}>
    {photo && <div className="image-viewer-panel"><button autoFocus className="image-viewer-close" onClick={close} aria-label="Close enlarged image">×</button><img src={photo.src} alt={photo.alt} />
      {(selection.images.length > 1 || photo.caption) && <div className="image-viewer-footer">{selection.images.length > 1 && <button onClick={() => move(-1)} aria-label="Previous image">←</button>}<p aria-live="polite">{photo.caption || ''}</p>{selection.images.length > 1 && <button onClick={() => move(1)} aria-label="Next image">→</button>}</div>}
    </div>}
  </dialog></ImageViewerContext.Provider>;
}
