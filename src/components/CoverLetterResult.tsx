
import React, { useState } from 'react';
import { ClipboardCopy, Download, Edit, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CoverLetterResultProps {
  coverLetter: string;
}

const CoverLetterResult: React.FC<CoverLetterResultProps> = ({ coverLetter }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(coverLetter);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your cover letter has been updated.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    toast({
      title: "Copied to clipboard",
      description: "Your cover letter has been copied to clipboard.",
    });
  };

  const handleDownload = () => {
    // Create a blob with the cover letter content
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cover_Letter.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded successfully",
      description: "Your cover letter has been downloaded.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generated Cover Letter</CardTitle>
        <CardDescription>Your personalized cover letter is ready</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] mb-4 font-mono text-sm"
            />
            <div className="flex justify-end">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted rounded-md p-6 mb-4 min-h-[300px] whitespace-pre-line font-serif leading-relaxed border">
              {editedContent}
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Letter
              </Button>
              <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2">
                <ClipboardCopy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoverLetterResult;
