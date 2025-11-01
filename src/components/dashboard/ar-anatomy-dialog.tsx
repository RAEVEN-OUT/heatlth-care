'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraOff, Bone, Heart, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ARAnatomyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AnatomySystem = 'skeletal' | 'circulatory' | 'muscular';

const anatomySystems = {
    skeletal: {
        name: 'Skeletal System',
        Icon: Bone,
        color: 'text-primary-foreground/80',
        imageId: 'skeletal-system',
    },
    circulatory: {
        name: 'Circulatory System',
        Icon: Heart,
        color: 'text-red-400',
        imageId: 'circulatory-system',
    },
    muscular: {
        name: 'Muscular System',
        Icon: Zap,
        color: 'text-yellow-400',
        imageId: 'muscular-system',
    },
}

export function ARAnatomyDialog({ open, onOpenChange }: ARAnatomyDialogProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [activeSystem, setActiveSystem] = useState<AnatomySystem>('skeletal');

  const activeSystemData = anatomySystems[activeSystem];
  const activeImage = PlaceHolderImages.find(img => img.id === activeSystemData.imageId);


  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (!open) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [open, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AR Anatomy Visualizer</DialogTitle>
          <DialogDescription>
            Point your camera at a flat surface to visualize the human anatomy. This feature is best experienced on a mobile device.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          
          {!hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
              <CameraOff className="h-12 w-12 mb-4" />
              <p className="text-center">Camera access is required for the AR experience.</p>
            </div>
          )}

          {hasCameraPermission && activeImage && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <Image
                    src={activeImage.imageUrl}
                    alt={activeImage.description}
                    width={300}
                    height={300}
                    data-ai-hint={activeImage.imageHint}
                    className="w-auto h-full object-contain opacity-80 mix-blend-lighten animate-pulse"
                />
            </div>
          )}
        </div>
         { hasCameraPermission && (
            <div className='flex justify-center items-center gap-2 mt-4'>
                {(Object.keys(anatomySystems) as AnatomySystem[]).map(system => (
                    <Button 
                        key={system} 
                        variant={activeSystem === system ? 'default' : 'outline'}
                        onClick={() => setActiveSystem(system)}
                    >
                       {anatomySystems[system].name}
                    </Button>
                ))}
            </div>
         )}
         { !hasCameraPermission && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser settings to use this feature. You may need to refresh the page after granting permission.
              </AlertDescription>
            </Alert>
          )}
      </DialogContent>
    </Dialog>
  );
}
