import images from '../data/images.json';
import { useImageViewer } from './ImageViewer';

export default function Photo({ src, alt, caption, gallery, browse = false, zoom = true, sizes = '(max-width: 700px) 100vw, 70vw', eager = false, width, height, ...props }) {
  const open = useImageViewer();
  const info = images[src];
  const variants = info?.variants || [];
  const img = <img {...props} src={variants[Math.min(1, variants.length - 1)]?.src || src}
    srcSet={variants.map(v => `${v.src} ${v.width}w`).join(', ') || undefined}
    sizes={sizes} width={info?.width || width} height={info?.height || height} alt={alt}
    loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : undefined} decoding="async" />;
  if (!zoom || !open) return img;
  const photos = (browse && gallery) || [{ src, alt, caption }];
  return <button type="button" className="zoom-photo" onClick={() => open(photos, Math.max(0, photos.findIndex(photo => photo.src === src)))} aria-label={'Enlarge image: '+alt}>{img}</button>;
}
