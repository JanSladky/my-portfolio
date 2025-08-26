declare module 'react-image-gallery' {
  import * as React from 'react';
  export interface ReactImageGalleryItem {
    original: string;
    thumbnail?: string;
    originalAlt?: string;
    thumbnailAlt?: string;
    description?: string;
  }
  export interface ReactImageGalleryProps {
    items: ReactImageGalleryItem[];
    showPlayButton?: boolean;
    showFullscreenButton?: boolean;
    showThumbnails?: boolean;
    renderItem?: (item: ReactImageGalleryItem) => React.ReactNode;
  }
  const ReactImageGallery: React.ComponentType<ReactImageGalleryProps>;
  export default ReactImageGallery;
}