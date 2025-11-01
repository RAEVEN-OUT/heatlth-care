'use client';

import { useActionState, useEffect, useRef, useTransition } from 'react';
import { Bot, Loader, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { handleSymptomCheck } from '@/lib/actions';

const initialState = {
  possibleConditions: null,
  error: null,
};

function SubmitButton() {
  const [isPending, startTransition] = useTransition();

  // This is a workaround to get the form pending state
  // as useFormStatus is not available in this version of React
  useEffect(() => {
    const form = document.querySelector('form[data-symptom-form]');
    if (form) {
      const handleSubmit = (e: Event) => {
        startTransition(() => {
            // This will be handled by the form action
        });
      };
      form.addEventListener('submit', handleSubmit);
      return () => {
        form.removeEventListener('submit', handleSubmit);
      };
    }
  }, [startTransition]);


  return (
    <Button type="submit" disabled={isPending} className="w-full">
      {isPending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Insights
        </>
      )}
    </Button>
  );
}

type SymptomCheckerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SymptomCheckerDialog({ open, onOpenChange }: SymptomCheckerDialogProps) {
  const [state, formAction] = useActionState(handleSymptomCheck, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      formRef.current?.reset();
      state.possibleConditions = null;
      state.error = null;
    }
  }, [open, state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Symptom Checker</DialogTitle>
          <DialogDescription>
            Describe your symptoms below. This tool provides potential insights and is not a substitute for professional medical advice.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4" data-symptom-form>
          <Textarea
            name="symptoms"
            placeholder="e.g., 'I have a sore throat, headache, and a slight fever.'"
            rows={5}
          />
          <SubmitButton />
        </form>

        {state.possibleConditions && (
          <div className="mt-4">
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertTitle>Potential Insights</AlertTitle>
              <AlertDescription>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{state.possibleConditions}</p>
                 <p className="text-xs text-muted-foreground mt-4">
                    Disclaimer: This is not a medical diagnosis. Please consult a healthcare professional.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
