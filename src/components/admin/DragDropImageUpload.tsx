import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, RefreshCw, Trash2, Eye, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LazyImage } from '../LazyImage';
import { toast } from 'sonner';
import { imagesService } from '../../services/images';
import { useUploadErrorHandler } from '../../hooks/useUploadErrorHandler';
import { UploadErrorFallback } from '../ui/FallbackUI';
import { useImageFeedback } from '../../hooks/useFeedback';

interface UploadError {
  file: string;
  error: string;
  retryable: boolean;
}

interface ImageData {
  id: string;
  url: string;
  urls?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  altText: string;
  filename: string;
  size: number;
  type: string;
}

interface DragDropImageUploadProps {
  onImageUploaded: (imageData: ImageData | null) => void;
  onImagesUploaded?: (imageData: ImageData[]) => void; // For batch uploads
  currentImageUrl?: string;
  altText?: string;
  onAltTextChange?: (altText: string) => void;
  disabled?: boolean;
  allowMultiple?: boolean; // Enable batch upload
  maxFiles?: number; // Maximum number of files for batch upload
  showPreview?: boolean; // Show image preview
  allowReorder?: boolean; // Allow reordering of multiple images
  acceptedFormats?: string[]; // Custom accepted formats
  maxFileSize?: number; // Custom max file size in bytes
}

export const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  onImageUploaded,
  onImagesUploaded,
  currentImageUrl,
  altText = '',
  onAltTextChange,
  disabled = false,
  allowMultiple = false,
  maxFiles = 10,
  showPreview = true,
  allowReorder = false,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [batchProgress, setBatchProgress] = useState<{ [key: string]: number }>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
  const [localAltText, setLocalAltText] = useState(altText);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadErrorHandler = useUploadErrorHandler(3);
  const imageFeedback = useImageFeedback();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check specific image types
    if (!acceptedFormats.includes(file.type)) {
      const formatNames = acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ');
      return `Only ${formatNames} images are allowed`;
    }

    // Check file size
    if (file.size > maxFileSize) {
      const sizeMB = Math.round(maxFileSize / (1024 * 1024));
      return `File size must be less than ${sizeMB}MB`;
    }

    // Check file name length
    if (file.name.length > 255) {
      return 'File name is too long (max 255 characters)';
    }

    return null;
  };



  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File, retryAttempt = 0) => {
    if (!localAltText.trim()) {
      uploadErrorHandler.handleUploadError(
        new Error('Alt text is required for accessibility'), 
        file.name, 
        file.size
      );
      return;
    }

    if (localAltText.trim().length < 3) {
      uploadErrorHandler.handleUploadError(
        new Error('Alt text must be at least 3 characters long'), 
        file.name, 
        file.size
      );
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      uploadErrorHandler.handleUploadError(
        new Error(validationError), 
        file.name, 
        file.size
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('altText', localAltText.trim());

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await imagesService.uploadImage(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create image data object
      const imageData: ImageData = {
        id: response.data.image.id || '',
        url: response.data.image.url,
        urls: response.data.image.urls,
        altText: localAltText.trim(),
        filename: response.data.image.filename || file.name,
        size: file.size,
        type: file.type
      };

      // Set preview URL
      setPreviewUrl(response.data.image.urls?.medium || response.data.image.url);

      // Call the callback with image data
      onImageUploaded(imageData);

      // Show success feedback with enhanced message
      imageFeedback.showUploaded(file.name);
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Use the new upload error handler
      const uploadError = uploadErrorHandler.handleUploadError(error, file.name, file.size);
      
      // Auto-retry for retryable errors
      if (uploadErrorHandler.canRetry(uploadError) && retryAttempt < 2) {
        setTimeout(() => {
          uploadFile(file, retryAttempt + 1);
        }, 1000 * (retryAttempt + 1)); // Exponential backoff
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleFiles = async (files: File[]) => {
    if (!localAltText.trim()) {
      uploadErrorHandler.handleUploadError(
        new Error('Alt text is required for accessibility'), 
        'Multiple files'
      );
      return;
    }

    if (localAltText.trim().length < 3) {
      uploadErrorHandler.handleUploadError(
        new Error('Alt text must be at least 3 characters long'), 
        'Multiple files'
      );
      return;
    }

    // Validate all files first
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        uploadErrorHandler.handleUploadError(
          new Error(validationError), 
          file.name, 
          file.size
        );
        return;
      }
    }

    if (files.length > maxFiles) {
      uploadErrorHandler.handleUploadError(
        new Error(`Maximum ${maxFiles} files allowed`), 
        'Multiple files'
      );
      return;
    }

    setIsUploading(true);
    setBatchProgress({});
    const newUploadedImages: ImageData[] = [];

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${file.name}-${i}`;
        
        setBatchProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('altText', localAltText.trim());

          // Simulate progress for this file
          const progressInterval = setInterval(() => {
            setBatchProgress(prev => ({
              ...prev,
              [fileId]: Math.min((prev[fileId] || 0) + 15, 90)
            }));
          }, 200);

          const response = await imagesService.uploadImage(formData);
          
          clearInterval(progressInterval);
          setBatchProgress(prev => ({ ...prev, [fileId]: 100 }));

          const imageData: ImageData = {
            id: response.data.image.id || '',
            url: response.data.image.url,
            urls: response.data.image.urls,
            altText: localAltText.trim(),
            filename: response.data.image.filename || file.name,
            size: file.size,
            type: file.type
          };

          newUploadedImages.push(imageData);
        } catch (error: any) {
          console.error(`Upload error for ${file.name}:`, error);
          uploadErrorHandler.handleUploadError(error, file.name, file.size);
          setBatchProgress(prev => ({ ...prev, [fileId]: -1 })); // Mark as failed
        }
      }

      if (newUploadedImages.length > 0) {
        // Set preview URLs for batch upload
        const urls = newUploadedImages.map(img => img.urls?.medium || img.url);
        setPreviewUrls(urls);
        setUploadedImages(newUploadedImages);

        // Call the batch callback
        if (onImagesUploaded) {
          onImagesUploaded(newUploadedImages);
        }

        // Show batch upload success feedback
        imageFeedback.showUploaded(undefined, newUploadedImages.length);
      }
    } catch (error: any) {
      console.error('Batch upload error:', error);
      uploadErrorHandler.handleUploadError(error, 'Batch upload');
    } finally {
      setIsUploading(false);
      setBatchProgress({});
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!allowReorder || fromIndex === toIndex) return;

    const newImages = [...uploadedImages];
    const newUrls = [...previewUrls];
    
    // Reorder images
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Reorder URLs
    const [movedUrl] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, movedUrl);
    
    setUploadedImages(newImages);
    setPreviewUrls(newUrls);
    
    if (onImagesUploaded) {
      onImagesUploaded(newImages);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleReorderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      handleReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      if (files.length === 0) return;

      if (allowMultiple && files.length > 1) {
        await uploadMultipleFiles(files);
      } else {
        const file = files[0];
        await uploadFile(file);
      }
    },
    [disabled, localAltText, allowMultiple]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      
      if (allowMultiple && fileArray.length > 1) {
        await uploadMultipleFiles(fileArray);
      } else {
        const file = fileArray[0];
        await uploadFile(file);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [localAltText, allowMultiple]
  );

  const handleBrowseClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (index?: number) => {
    if (index !== undefined && allowMultiple) {
      // Remove specific image from multiple uploads
      const newImages = uploadedImages.filter((_, i) => i !== index);
      const newUrls = previewUrls.filter((_, i) => i !== index);
      
      setUploadedImages(newImages);
      setPreviewUrls(newUrls);
      
      if (onImagesUploaded) {
        onImagesUploaded(newImages);
      }
      
      if (newImages.length === 0) {
        onImageUploaded(null);
      }
    } else {
      // Remove single image
      setPreviewUrl(null);
      setPreviewUrls([]);
      setUploadedImages([]);
      onImageUploaded(null);
      if (onImagesUploaded) {
        onImagesUploaded([]);
      }
    }
  };



  const handleAltTextChange = (value: string) => {
    setLocalAltText(value);
    if (onAltTextChange) {
      onAltTextChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Alt Text Input */}
      <div>
        <Label htmlFor="altText">
          Alt Text <span className="text-red-500">*</span>
        </Label>
        <Input
          id="altText"
          placeholder="Describe the image for accessibility..."
          value={localAltText}
          onChange={(e) => handleAltTextChange(e.target.value)}
          disabled={disabled}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Required for accessibility. Describe what's in the image.
        </p>
      </div>

      {/* Upload Errors */}
      {uploadErrorHandler.errorState.hasError && uploadErrorHandler.errorState.error && (
        <UploadErrorFallback
          error={uploadErrorHandler.errorState.error.message}
          fileName={uploadErrorHandler.errorState.error.fileName}
          fileSize={uploadErrorHandler.errorState.error.fileSize}
          onRetry={uploadErrorHandler.canRetry(uploadErrorHandler.errorState.error) ? () => {
            if (uploadErrorHandler.retry()) {
              // Retry the upload with the original file
              // This would need to be implemented based on your specific needs
            }
          } : undefined}
          onRemove={() => uploadErrorHandler.clearError()}
        />
      )}

      {/* Upload Area */}
      {!previewUrl && previewUrls.length === 0 ? (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            {isUploading ? (
              <div className="w-full max-w-xs space-y-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                
                {/* Show batch progress if multiple files */}
                {Object.keys(batchProgress).length > 0 ? (
                  <div className="space-y-2 w-full">
                    {Object.entries(batchProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate">{fileId.split('-')[0]}</span>
                          <span>{progress === -1 ? 'Failed' : `${progress}%`}</span>
                        </div>
                        <Progress 
                          value={progress === -1 ? 100 : progress} 
                          className={`w-full ${progress === -1 ? 'bg-red-200' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-600 text-center">
                      Uploading and processing image...
                    </p>
                  </>
                )}
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drag & Drop your files or Browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')} up to {formatFileSize(maxFileSize)}
                    {allowMultiple && ` (Max ${maxFiles} files)`}
                  </p>
                  <Button type="button" variant="outline" disabled={disabled}>
                    Browse Files
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : previewUrls.length > 0 ? (
        /* Multiple Image Previews */
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                {previewUrls.length} images uploaded
              </h4>
              {allowReorder && previewUrls.length > 1 && (
                <p className="text-xs text-gray-500">
                  Drag to reorder
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div 
                  key={index} 
                  className={`relative group ${allowReorder ? 'cursor-move' : ''}`}
                  draggable={allowReorder}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleReorderDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {showPreview && (
                    <LazyImage
                      src={url}
                      alt={`${localAltText} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      useIntersectionObserver={false}
                      priority={true}
                      showLoadingIndicator={true}
                      retryOnError={true}
                    />
                  )}
                  
                  {/* Image Controls */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                      onClick={() => window.open(url, '_blank')}
                      title="View full size"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemoveImage(index)}
                      disabled={disabled}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Drag Handle */}
                  {allowReorder && (
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-6 w-6 bg-white/90 rounded flex items-center justify-center">
                        <Move className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                  )}
                  
                  {/* Image Info */}
                  <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="truncate">
                      {uploadedImages[index]?.filename || `Image ${index + 1}`}
                    </p>
                    <p className="text-xs opacity-75">
                      {uploadedImages[index]?.size ? formatFileSize(uploadedImages[index].size) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2">
              <ImageIcon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {previewUrls.length} images uploaded successfully
                </p>
                <p className="text-xs text-gray-500">
                  Alt text: {localAltText || 'No alt text provided'}
                </p>
                <p className="text-xs text-gray-500">
                  Total size: {uploadedImages.reduce((total, img) => total + img.size, 0) > 0 
                    ? formatFileSize(uploadedImages.reduce((total, img) => total + img.size, 0))
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Single Image Preview */
        <Card>
          <CardContent className="p-4">
            <div className="relative group">
              {showPreview && (
                <LazyImage
                  src={previewUrl}
                  alt={localAltText || 'Uploaded image'}
                  className="w-full h-48 object-cover rounded-lg"
                  useIntersectionObserver={false}
                  priority={true}
                  showLoadingIndicator={true}
                  retryOnError={true}
                />
              )}
              
              {/* Image Controls */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => window.open(previewUrl || '', '_blank')}
                  title="View full size"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage()}
                  disabled={disabled}
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <ImageIcon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Image uploaded successfully
                </p>
                <p className="text-xs text-gray-500">
                  Alt text: {localAltText || 'No alt text provided'}
                </p>
                {uploadedImages[0] && (
                  <p className="text-xs text-gray-500">
                    Size: {formatFileSize(uploadedImages[0].size)} • Type: {uploadedImages[0].type}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        multiple={allowMultiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Validation Message */}
      {!localAltText.trim() && (
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Alt text is required before uploading</span>
        </div>
      )}

      {/* Upload Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          Accepted formats: {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')}
        </p>
        <p>
          Maximum file size: {formatFileSize(maxFileSize)}
          {allowMultiple && ` • Maximum files: ${maxFiles}`}
        </p>
      </div>
    </div>
  );
};