
'use client';

import type React from 'react';
import {useState, useRef, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {generatePoemFromPhoto} from '@/ai/flows/generate-poem-from-photo';
import {Loader2, UploadCloud, X} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploadProps {
  onPoemGenerated: (poem: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: string) => void;
  onPhotoUpload: (dataUri: string | null) => void;
}

export function PhotoUpload({
  onPoemGenerated,
  onLoadingChange,
  onError,
  onPhotoUpload,
}: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {toast} = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // Check if file size exceeds 4MB
         toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload an image smaller than 4MB.",
        });
        clearSelection();
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onPhotoUpload(result); // Pass data URI to parent
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGeneratePoem = useCallback(async () => {
    if (!file || !previewUrl) {
      toast({
        variant: 'destructive',
        title: 'No Photo Selected',
        description: 'Please select a photo first.',
      });
      return;
    }

    setIsGenerating(true);
    onLoadingChange(true);
    onError(null); // Clear previous errors

    try {
       const result = await generatePoemFromPhoto({ photoDataUri: previewUrl });
       onPoemGenerated(result.poem);
       toast({
        title: "Poem Generated!",
        description: "Your masterpiece awaits.",
      });
    } catch (error) {
      console.error('Error generating poem:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
       onError(`Failed to generate poem: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: `Could not generate poem. ${errorMessage}`,
      });
    } finally {
      setIsGenerating(false);
      onLoadingChange(false);
    }
  }, [file, previewUrl, onPoemGenerated, onLoadingChange, onError, toast]);


   const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    onPhotoUpload(null); // Notify parent that photo is removed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="flex flex-col items-center space-y-6 p-4 border border-dashed rounded-lg bg-card/50 h-full justify-center">
      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={previewUrl}
              alt="Selected photo preview"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
             <Button
              variant="destructive"
              size="icon"
              onClick={clearSelection}
              className="absolute top-2 right-2 rounded-full z-10 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
           <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center text-center p-8 space-y-4 w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors"
             onClick={triggerFileInput}
             role="button"
             tabIndex={0}
             onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
           >
             <UploadCloud className="w-12 h-12 text-muted-foreground" />
             <p className="text-muted-foreground">
               Click or drag & drop to upload photo
             </p>
             <p className="text-xs text-muted-foreground">(Max 4MB)</p>
           </motion.div>
        )}
      </AnimatePresence>

       <Input
         id="photo-upload"
         type="file"
         accept="image/*"
         onChange={handleFileChange}
         ref={fileInputRef}
         className="hidden" // Hide the default input, use the div above
       />


       <Button
        onClick={handleGeneratePoem}
        disabled={!file || isGenerating}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-live="polite"
      >
        {isGenerating ? (
           <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             Generating Poem...
           </>
         ) : (
          'Generate Poem'
        )}
      </Button>
    </div>
  );
}
