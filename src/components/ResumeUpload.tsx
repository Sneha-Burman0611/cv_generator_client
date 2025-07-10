
import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as pdfjsLib from 'pdfjs-dist';

// Use the matching worker from the CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

interface ResumeUploadProps {
  onResumeUploaded: (content: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeContent, setResumeContent] = useState('');
  const [error, setError] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

 const handleFile = (file: File) => {
        setError("");
        setFile(file);

        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];

        if (!validTypes.includes(file.type)) {
            setError("Please upload a PDF, DOCX, or TXT file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                if (file.type === "application/pdf") {
                    const typedArray = new Uint8Array(
                        e.target?.result as ArrayBuffer
                    );
                    const pdf = await pdfjsLib.getDocument({ data: typedArray })
                        .promise;

                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items
                            .map((item: any) => item.str)
                            .join(" ");
                        fullText += pageText + "\n\n";
                    }

                    setResumeContent(fullText);
                    onResumeUploaded(fullText);
                } else if (file.type === "text/plain") {
                    const content = e.target?.result as string;
                    setResumeContent(content);
                    onResumeUploaded(content);
                } else {
                    // Optional: placeholder content for DOCX
                    const mockContent = `Resume for ${file.name} uploaded.\n\n(Support for .docx can be added later.)`;
                    setResumeContent(mockContent);
                    onResumeUploaded(mockContent);
                }
            } catch (err) {
                console.error("Error parsing file:", err);
                setError(
                    "Failed to parse the file. Please try another format."
                );
            }
        };

        if (file.type === "text/plain") {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>Supported formats: PDF, DOCX, TXT</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-border'} transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Drag and drop your resume here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
            </div>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="outline" onClick={() => document.getElementById('resume-upload')?.click()}>
              Browse Files
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}
        
        {file && (
          <div className="mt-4 flex items-center gap-2 bg-secondary p-3 rounded-md">
            <File className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        )}
        
        {resumeContent && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Parsed Resume Content:</p>
            <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-line max-h-40 overflow-y-auto">
              {resumeContent}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
