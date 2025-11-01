'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
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
import { CameraOff, Bone, Heart, Zap, ScanFace, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { handleDetectHuman } from '@/lib/actions';

const initialState = {
  humanDetected: null,
  error: null,
  confidence: null,
  message: null,
};

function ScanButton() {
    const [pending, setPending] = useState(false);
    
    // A bit of a hack to get the pending state from the form status
    useEffect(() => {
        const form = document.querySelector('form[data-scanning-form]');
        if (!form) return;
    
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName === 'data-pending') {
                    const isPending = (mutation.target as HTMLFormElement).dataset.pending === 'true';
                    setPending(isPending);
                }
            });
        });
    
        observer.observe(form, { attributes: true });
    
        return () => observer.disconnect();
      }, []);

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <ScanFace className="mr-2 h-4 w-4" />
          Scan for Person
        </>
      )}
    </Button>
  );
}


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
  const [state, formAction] = useActionState(handleDetectHuman, initialState);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [activeSystem, setActiveSystem] = useState<AnatomySystem>('skeletal');

  const activeSystemData = anatomySystems[activeSystem];
  const activeImage = PlaceHolderImages.find(img => img.id === activeSystemData.imageId);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (!open) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
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

    if(open) {
        getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [open, toast]);
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
        if(formRef.current) formRef.current.reset();
        // @ts-ignore
        state.humanDetected = null;
        // @ts-ignore
        state.error = null;
        // @ts-ignore
        state.confidence = null;
        // @ts-ignore
        state.message = null;
    }
  }, [open, state]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg', 0.8);
        return dataUri;
      }
    }
    return null;
  }

  const handleFormAction = () => {
    const dataUri = captureFrame();
    if(dataUri && formRef.current) {
        const formData = new FormData(formRef.current);
        formData.set('mediaDataUri', dataUri);
        formAction(formData);
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AR Anatomy Visualizer</DialogTitle>
          <DialogDescription>
            Point your camera at a person and click &quot;Scan for Person&quot; to overlay anatomical models.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          
          {!hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
              <CameraOff className="h-12 w-12 mb-4" />
              <p className="text-center">Camera access is required for the AR experience.</p>
            </div>
          )}

          {hasCameraPermission && state.humanDetected && activeImage && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <Image
                    src={activeImage.imageUrl}
                    alt={activeImage.description}
                    width={300}
                    height={300}
                    data-ai-hint={activeImage.imageHint}
                    className="w-auto h-full object-contain opacity-80 mix-blend-lighten"
                />
            </div>
          )}
        </div>

        {state.message && (
             <div className={cn('mb-4 p-4 rounded-lg flex items-start gap-3',
                state.humanDetected ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
             )}>
                {state.humanDetected ? (
                     <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                ) : (
                    <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                )}
                <div>
                     <p className={cn('font-semibold',
                        state.humanDetected ? 'text-green-800' : 'text-orange-800'
                     )}>
                        {state.humanDetected ? 'Detection Successful' : 'No Person Detected'}
                     </p>
                    <p className={cn('text-sm',
                        state.humanDetected ? 'text-green-700' : 'text-orange-700'
                    )}>
                        {state.message}
                    </p>
                    {state.confidence && (
                        <p className="text-xs mt-1 text-gray-600">
                           Confidence: {(state.confidence * 100).toFixed(0)}%
                        </p>
                    )}
                </div>
            </div>
        )}

        { hasCameraPermission && !state.humanDetected && (
            <form ref={formRef} action={handleFormAction} data-scanning-form>
                <ScanButton />
            </form>
        )}
        
         { hasCameraPermission && state.humanDetected && (
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
