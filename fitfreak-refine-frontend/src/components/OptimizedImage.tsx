import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

/**
 * Optimized Image component with lazy loading, error handling, and Cloudinary transformations
 */
export function OptimizedImage({ src, alt, className, fallback, ...props }: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Add Cloudinary optimizations if it's a Cloudinary URL
  const getOptimizedUrl = (url: string): string => {
    if (url?.includes('cloudinary.com')) {
      // Add Cloudinary transformations for optimal delivery
      if (url.includes('/upload/')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
          // Add auto format, quality, and width transformations
          return `${parts[0]}/upload/q_auto,f_auto,w_auto,c_limit/${parts[1]}`;
        }
      }
    }
    return url;
  };

  const handleError = () => {
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError && !fallback) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        {...props}
        src={getOptimizedUrl(imageSrc)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
