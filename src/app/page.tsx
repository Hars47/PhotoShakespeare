'use client';

import type * as React from 'react';
import {useState} from 'react';
import {PhotoUpload} from '@/components/photo-upload';
import {PoemDisplay} from '@/components/poem-display';
import {Separator} from '@/components/ui/separator';
import {motion} from 'framer-motion';
import {ScrollArea} from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [poem, setPoem] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePoemGenerated = (generatedPoem: string) => {
    setPoem(generatedPoem);
    setError(null);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null); // Clear previous errors when starting a new generation
      setPoem(null); // Clear previous poem
    }
  };

   const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handlePhotoUpload = (dataUri: string | null) => {
    setPhotoDataUri(dataUri);
     if (!dataUri) {
      // Clear poem and error if photo is removed
      setPoem(null);
      setError(null);
    }
  };


  return (
     <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-xl rounded-xl overflow-hidden">
           <CardHeader className="text-center bg-muted/50 p-6">
             <CardTitle className="text-3xl font-semibold text-primary tracking-tight">
              PhotoPoet
             </CardTitle>
           </CardHeader>
           <CardContent className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PhotoUpload
                  onPoemGenerated={handlePoemGenerated}
                  onLoadingChange={handleLoadingChange}
                  onError={handleError}
                  onPhotoUpload={handlePhotoUpload}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
              >
                <PoemDisplay
                  poem={poem}
                  photoDataUri={photoDataUri}
                  isLoading={isLoading}
                  error={error}
                />
              </motion.div>
             </div>
           </CardContent>
         </Card>
       </motion.div>
       <footer className="mt-8 text-center text-muted-foreground text-sm">
         Powered by Firebase Genkit & Next.js
       </footer>
     </main>
  );
}
