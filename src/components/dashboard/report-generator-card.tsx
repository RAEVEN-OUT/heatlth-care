"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { FileScan, Loader, Upload, X, Bot } from "lucide-react";
import { handleGenerateReport } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = {
  summary: null,
  error: null,
};

function SubmitButton() {
  const [isPending, startTransition] = useTransition();
  
  // This is a workaround to get the form pending state
  // as useFormStatus is not available in this version of React
  useEffect(() => {
    const form = document.querySelector('form[data-report-generator-form]');
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
          Generating...
        </>
      ) : (
        <>
          <FileScan className="mr-2 h-4 w-4" />
          Generate Summary
        </>
      )}
    </Button>
  );
}

export function ReportGeneratorCard() {
  const [state, formAction] = useActionState(handleGenerateReport, initialState);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageDataUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formRef.current) {
      formRef.current.reset();
    }
    state.summary = null;
    state.error = null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Report Generator</CardTitle>
        <CardDescription>
          Upload a medical image (e.g., skin lesion, X-ray) to generate a summary of findings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4" data-report-generator-form>
          <Input type="hidden" name="mediaDataUri" value={imageDataUri || ''} />

          {!imagePreview && (
             <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-muted-foreground/50 hover:border-primary transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <Input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
            </label>
          )}

          {imagePreview && (
            <div className="relative w-full max-w-sm mx-auto">
              <Image
                src={imagePreview}
                alt="Image preview"
                width={300}
                height={300}
                className="rounded-lg object-contain w-full h-auto max-h-64"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}

          {imagePreview && <SubmitButton />}
        </form>

        {state.summary && (
          <div className="mt-6">
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertTitle>AI Generated Summary</AlertTitle>
              <AlertDescription>
                <p className="text-sm text-foreground/90">{state.summary}</p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
