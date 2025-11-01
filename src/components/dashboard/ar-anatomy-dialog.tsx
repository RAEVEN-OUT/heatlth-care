'use client';

import { useEffect, useRef, useState } from 'react';
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

type ARAnatomyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AnatomySystem = 'skeletal' | 'circulatory' | 'muscular';

const anatomySystems = {
    skeletal: {
        name: 'Skeletal System',
        Icon: Bone,
        color: 'text-primary-foreground/80'
    },
    circulatory: {
        name: 'Circulatory System',
        Icon: Heart,
        color: 'text-red-400'
    },
    muscular: {
        name: 'Muscular System',
        Icon: Zap,
        color: 'text-yellow-400'
    },
}

export function ARAnatomyDialog({ open, onOpenChange }: ARAnatomyDialogProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [activeSystem, setActiveSystem] = useState<AnatomySystem>('skeletal');

  const ActiveIcon = anatomySystems[activeSystem].Icon;

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

          {hasCameraPermission && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-white bg-black/30 p-4 rounded-lg">
                    <ActiveIcon className={cn("h-16 w-16 mx-auto animate-pulse", anatomySystems[activeSystem].color)} />
                    <p className="mt-2 font-semibold">Visualizing {anatomySystems[activeSystem].name}</p>
                    <p className="text-xs text-primary-foreground/70">AR overlay placeholder</p>
                </div>
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
