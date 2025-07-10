import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import CoverLetterResult from "@/components/CoverLetterResult";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Index = () => {
    const [resumeContent, setResumeContent] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateCoverLetter = async () => {
        setIsGenerating(true);
        setCoverLetter("");

        try {
            const response = await fetch("https://cv-generator-server.onrender.com/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resumeContent: resumeContent,
                    jobDescription: jobDescription,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate cover letter.");
            }

            const data = await response.json();

            setCoverLetter(data.coverLetter || "No cover letter returned.");
        } catch (error) {
            console.error("Error generating cover letter:", error);
            setCoverLetter(
                "Something went wrong while generating the cover letter. Please try again."
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const isFormComplete =
        resumeContent.trim() !== "" && jobDescription.trim() !== "";

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <section className="mb-8 text-center">
                        <h2 className="text-3xl font-bold mb-2">
                            AI Cover Letter Generator
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Generate tailored cover letters instantly using your
                            resume and job description.
                        </p>
                    </section>

                    <div className="grid gap-8 step-container">
                        <section>
                            <div className="relative pl-6 pb-8">
                                <div className="absolute top-1 bottom-0 left-0 border-l-2 border-muted"></div>
                                <div className="step relative">
                                    <h3 className="text-xl font-bold mb-4 pl-6">
                                        Resume Upload
                                    </h3>
                                    <ResumeUpload
                                        onResumeUploaded={setResumeContent}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="relative pl-6 pb-8">
                                <div className="absolute top-1 bottom-0 left-0 border-l-2 border-muted"></div>
                                <div className="step relative">
                                    <h3 className="text-xl font-bold mb-4 pl-6">
                                        Job Description
                                    </h3>
                                    <JobDescriptionInput
                                        onJobDescriptionChanged={
                                            setJobDescription
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="relative pl-6 pb-8">
                                <div className="absolute top-1 bottom-0 left-0 border-l-2 border-muted"></div>
                                <div className="step relative">
                                    <h3 className="text-xl font-bold mb-4 pl-6">
                                        Generate Cover Letter
                                    </h3>
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={handleGenerateCoverLetter}
                                            disabled={
                                                !isFormComplete || isGenerating
                                            }
                                            className="w-full max-w-md"
                                            size="lg"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                "Generate Cover Letter"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {coverLetter && (
                            <section className="animate-fade-in">
                                <div className="relative pl-6">
                                    <div className="absolute top-1 bottom-0 left-0 border-l-2 border-muted"></div>
                                    <div className="step relative">
                                        <h3 className="text-xl font-bold mb-4 pl-6">
                                            Your Cover Letter
                                        </h3>
                                        <CoverLetterResult
                                            coverLetter={coverLetter}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Index;