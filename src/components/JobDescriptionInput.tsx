
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface JobDescriptionInputProps {
  onJobDescriptionChanged: (description: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onJobDescriptionChanged }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJobDescription(text);
    setCharacterCount(text.length);
    onJobDescriptionChanged(text);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paste Job Description</CardTitle>
        <CardDescription>Copy and paste the job posting you're applying for</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste the full job description here..."
          className="min-h-[200px] resize-none"
          value={jobDescription}
          onChange={handleChange}
        />
        <div className="flex justify-end mt-2">
          <span className="text-xs text-muted-foreground">{characterCount} characters</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;
