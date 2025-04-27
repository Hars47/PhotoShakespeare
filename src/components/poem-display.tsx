
'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface PoemDisplayProps {
  poem: string | null;
  photoDataUri: string | null;
  isLoading: boolean;
  error: string | null;
}

export function PoemDisplay({ poem, photoDataUri, isLoading, error }: PoemDisplayProps) {
  const hasContent = poem || isLoading || error || photoDataUri;

   const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

   const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
     <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
       className={`flex flex-col h-full p-4 rounded-lg border ${!hasContent ? 'items-center justify-center border-dashed bg-card/30' : 'bg-card/50'}`}
     >
      <AnimatePresence mode="wait">
         {isLoading && (
          <motion.div
            key="loading"
            variants={itemVariants}
            exit="exit"
            className="space-y-4 flex flex-col items-center justify-center flex-grow"
           >
             <Skeleton className="h-48 w-full rounded-lg" />
             <div className="space-y-2 w-full pt-4">
               <Skeleton className="h-4 w-3/4" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
             </div>
          </motion.div>
        )}

         {error && !isLoading && (
           <motion.div
            key="error"
            variants={itemVariants}
            exit="exit"
            className="flex-grow flex items-center justify-center"
           >
            <Alert variant="destructive" className="w-full">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          </motion.div>
        )}

        {poem && !isLoading && !error && (
          <motion.div
            key="poem"
            variants={itemVariants}
            exit="exit"
             className="flex flex-col flex-grow overflow-hidden"
          >
             <ScrollArea className="flex-grow pr-4 -mr-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {poem}
              </pre>
             </ScrollArea>
          </motion.div>
        )}

        {!isLoading && !error && !poem && !photoDataUri && (
           <motion.div
            key="placeholder-no-photo"
            variants={itemVariants}
            exit="exit"
            className="text-center text-muted-foreground flex flex-col items-center justify-center flex-grow"
           >
             <FileText className="w-12 h-12 mb-4" />
             <p>Upload a photo and generate a poem!</p>
          </motion.div>
        )}

         {!isLoading && !error && !poem && photoDataUri && (
          <motion.div
            key="placeholder-with-photo"
            variants={itemVariants}
            exit="exit"
            className="text-center text-muted-foreground flex flex-col items-center justify-center flex-grow"
          >
             <FileText className="w-12 h-12 mb-4" />
             <p>Click "Generate Poem" to see the magic happen.</p>
          </motion.div>
        )}
       </AnimatePresence>
     </motion.div>
  );
}
