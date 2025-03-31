import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Portfolio } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generatePDF } from "@/lib/pdf-generator";
import { Loader2, Info, Download, Globe, Copy, Edit2 } from "lucide-react";

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  onBack: () => void;
  onEdit: () => void;
}

export function PortfolioPreview({ portfolio, onBack, onEdit }: PortfolioPreviewProps) {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/portfolio", { isPublished: true });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Portfolio published",
        description: "Your portfolio is now live and can be shared with others.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to publish",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  useEffect(() => {
    // Generate HTML for preview
    const previewHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${portfolio.firstName} ${portfolio.lastName} - Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: ${
              portfolio.theme === 'elegant' ? "'Playfair Display', serif" : 
              portfolio.theme === 'creative' ? "'Poppins', sans-serif" : 
              portfolio.theme === 'modern' ? "'Montserrat', sans-serif" : 
              "'Inter', sans-serif"
            };
            line-height: 1.5;
            color: ${
              portfolio.theme === 'tech' ? '#cbd5e1' : 
              portfolio.theme === 'elegant' ? '#374151' : 
              '#334155'
            };
            background-color: ${
              portfolio.theme === 'minimal' ? '#f8fafc' : 
              portfolio.theme === 'tech' ? '#0f172a' : 
              portfolio.theme === 'creative' ? '#fef3c7' : 
              portfolio.theme === 'elegant' ? '#f9fafb' : 
              portfolio.theme === 'nature' ? '#f0fdf4' : 
              portfolio.theme === 'modern' ? '#f0f4fd' : 
              '#f8fafc'
            };
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
          }
          .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: ${
              portfolio.theme === 'elegant' ? '2rem 1rem 3rem' : 
              portfolio.theme === 'modern' ? '3rem 1rem 3.5rem' : 
              '2rem 1rem'
            };
            color: ${portfolio.theme === 'tech' ? '#f8fafc' : '#1e293b'};
            background-color: ${
              portfolio.theme === 'minimal' ? 'transparent' : 
              portfolio.theme === 'tech' ? '#0f172a' : 
              portfolio.theme === 'creative' ? '#fef3c7' : 
              portfolio.theme === 'elegant' ? '#f9fafb' : 
              portfolio.theme === 'nature' ? '#f0fdf4' : 
              portfolio.theme === 'modern' ? '#eef2ff' : 
              'transparent'
            };
            border-bottom: ${
              portfolio.theme === 'elegant' ? '1px solid #e5e7eb' : 
              portfolio.theme === 'modern' ? '2px solid #4f46e5' : 
              'none'
            };
          }
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }
          .header h2 {
            font-size: 1.5rem;
            font-weight: 400;
            color: ${
              portfolio.theme === 'tech' ? '#94a3b8' : 
              portfolio.theme === 'creative' ? '#d97706' : 
              portfolio.theme === 'elegant' ? '#6b7280' : 
              portfolio.theme === 'nature' ? '#4d7c0f' : 
              portfolio.theme === 'modern' ? '#4f46e5' : 
              '#64748b'
            };
          }
          .profile-photo {
            width: 150px;
            height: 150px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid ${
              portfolio.theme === 'tech' ? '#38bdf8' : 
              portfolio.theme === 'creative' ? '#fcd34d' : 
              portfolio.theme === 'elegant' ? '#e5e7eb' : 
              portfolio.theme === 'nature' ? '#dcfce7' : 
              portfolio.theme === 'modern' ? '#c7d2fe' : 
              '#e0f2fe'
            };
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .profile-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          .section {
            margin-bottom: 3rem;
            background-color: ${
              portfolio.theme === 'tech' ? '#1e293b' : 
              portfolio.theme === 'elegant' ? '#ffffff' : 
              portfolio.theme === 'nature' ? '#f8fafc' : 
              portfolio.theme === 'modern' ? '#f5f5ff' : 
              'white'
            };
            padding: 2rem;
            border-radius: ${
              portfolio.theme === 'minimal' ? '0.5rem' : 
              portfolio.theme === 'tech' ? '0.25rem' : 
              portfolio.theme === 'creative' ? '0.75rem' : 
              portfolio.theme === 'elegant' ? '0.125rem' : 
              portfolio.theme === 'nature' ? '0.5rem' : 
              portfolio.theme === 'modern' ? '0.5rem' : 
              '0.5rem'
            };
            box-shadow: ${
              portfolio.theme === 'elegant' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 
              portfolio.theme === 'modern' ? '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)' : 
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            };
          }
          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid ${
              portfolio.theme === 'minimal' ? '#e2e8f0' : 
              portfolio.theme === 'tech' ? '#0ea5e9' : 
              portfolio.theme === 'creative' ? '#f59e0b' : 
              portfolio.theme === 'elegant' ? '#6b7280' : 
              portfolio.theme === 'nature' ? '#4d7c0f' : 
              portfolio.theme === 'modern' ? '#4f46e5' : 
              '#e2e8f0'
            };
            color: ${portfolio.theme === 'tech' ? '#f8fafc' : '#1e293b'};
          }
          .bio {
            font-size: 1.125rem;
            color: ${portfolio.theme === 'tech' ? '#cbd5e1' : '#4b5563'};
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .skill {
            background-color: ${
              portfolio.theme === 'minimal' ? '#f1f5f9' : 
              portfolio.theme === 'tech' ? '#0c4a6e' : 
              portfolio.theme === 'creative' ? '#fcd34d' : 
              portfolio.theme === 'elegant' ? '#f3f4f6' : 
              portfolio.theme === 'nature' ? '#dcfce7' : 
              portfolio.theme === 'modern' ? '#e0e7ff' : 
              '#f1f5f9'
            };
            color: ${
              portfolio.theme === 'tech' ? '#e0f2fe' : 
              portfolio.theme === 'creative' ? '#92400e' : 
              portfolio.theme === 'elegant' ? '#374151' : 
              portfolio.theme === 'nature' ? '#166534' : 
              portfolio.theme === 'modern' ? '#3730a3' : 
              '#0f172a'
            };
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          .experience-item, .project-item {
            margin-bottom: 2rem;
          }
          .experience-item h3, .project-item h3 {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            color: ${portfolio.theme === 'tech' ? '#f8fafc' : '#1e293b'};
          }
          .experience-item .company, .project-item .tech {
            font-size: 1rem;
            color: ${
              portfolio.theme === 'minimal' ? '#0ea5e9' : 
              portfolio.theme === 'tech' ? '#38bdf8' : 
              portfolio.theme === 'creative' ? '#d97706' : 
              portfolio.theme === 'elegant' ? '#6b7280' : 
              portfolio.theme === 'nature' ? '#4d7c0f' : 
              portfolio.theme === 'modern' ? '#4f46e5' : 
              '#0ea5e9'
            };
            margin-bottom: 0.25rem;
          }
          .experience-item .date {
            font-size: 0.875rem;
            color: ${portfolio.theme === 'tech' ? '#94a3b8' : '#64748b'};
            margin-bottom: 0.5rem;
          }
          .experience-item p, .project-item p {
            font-size: 1rem;
            color: ${portfolio.theme === 'tech' ? '#cbd5e1' : '#4b5563'};
          }
          .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
          }
          .project-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }
          .project-links a {
            color: ${
              portfolio.theme === 'minimal' ? '#0ea5e9' : 
              portfolio.theme === 'tech' ? '#38bdf8' : 
              portfolio.theme === 'creative' ? '#d97706' : 
              portfolio.theme === 'elegant' ? '#6b7280' : 
              portfolio.theme === 'nature' ? '#4d7c0f' : 
              portfolio.theme === 'modern' ? '#4f46e5' : 
              '#0ea5e9'
            };
            text-decoration: none;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
          }
          .project-links a i {
            margin-right: 0.25rem;
          }
          .contact {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin-top: 1rem;
            color: ${portfolio.theme === 'tech' ? '#cbd5e1' : '#4b5563'};
          }
          .contact-item {
            display: flex;
            align-items: center;
          }
          .contact-item i {
            margin-right: 0.5rem;
            color: ${
              portfolio.theme === 'minimal' ? '#0ea5e9' : 
              portfolio.theme === 'tech' ? '#38bdf8' : 
              portfolio.theme === 'creative' ? '#d97706' : 
              portfolio.theme === 'elegant' ? '#6b7280' : 
              portfolio.theme === 'nature' ? '#4d7c0f' : 
              portfolio.theme === 'modern' ? '#4f46e5' : 
              '#0ea5e9'
            };
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            ${portfolio.profilePhotoUrl ? `<div class="profile-photo"><img src="${portfolio.profilePhotoUrl}" alt="${portfolio.firstName} ${portfolio.lastName}" /></div>` : ''}
            <h1>${portfolio.firstName} ${portfolio.lastName}</h1>
            <h2>${portfolio.title}</h2>
          </header>
          
          <section class="section">
            <h2 class="section-title">About Me</h2>
            <p class="bio">${portfolio.bio}</p>
          </section>
          
          <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills">
              ${Array.isArray(portfolio.skills) && portfolio.skills.map(skill => `<div class="skill">${skill}</div>`).join('') || ''}
            </div>
          </section>
          
          <section class="section">
            <h2 class="section-title">Experience</h2>
            ${Array.isArray(portfolio.experiences) && portfolio.experiences.map(exp => `
              <div class="experience-item">
                <h3>${exp.position}</h3>
                <div class="company">${exp.company}</div>
                <div class="date">${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}</div>
                <p>${exp.description}</p>
              </div>
            `).join('') || ''}
          </section>
          
          <section class="section">
            <h2 class="section-title">Projects</h2>
            <div class="project-grid">
              ${Array.isArray(portfolio.projects) && portfolio.projects.map(proj => `
                <div class="project-item">
                  <h3>${proj.title}</h3>
                  <div class="tech">${proj.technologies.join(', ')}</div>
                  <p>${proj.description}</p>
                  <div class="project-links">
                    ${proj.demoLink ? `<a href="${proj.demoLink}" target="_blank"><i class="fas fa-link"></i> Demo</a>` : ''}
                    ${proj.githubLink ? `<a href="${proj.githubLink}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                  </div>
                </div>
              `).join('') || ''}
            </div>
          </section>
          
          <section class="section">
            <h2 class="section-title">Contact</h2>
            <div class="contact">
              ${portfolio.contactEmail ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${portfolio.contactEmail}</div>` : ''}
              ${portfolio.contactPhone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${portfolio.contactPhone}</div>` : ''}
              ${portfolio.contactLocation ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${portfolio.contactLocation}</div>` : ''}
            </div>
          </section>
        </div>
      </body>
      </html>
    `;
    
    // Create a blob URL for the preview
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    
    // Clean up blob URL on unmount
    return () => URL.revokeObjectURL(url);
  }, [portfolio]);
  
  const handleDownloadPDF = () => {
    generatePDF(portfolio, 
      () => toast({ 
        title: "PDF created", 
        description: "Your portfolio PDF has been generated and is being downloaded."
      }),
      (error) => toast({ 
        title: "PDF generation failed", 
        description: error.message, 
        variant: "destructive"
      })
    );
  };
  
  const handleCopyUrl = () => {
    // In a real app, this would be a unique public URL
    const portfolioUrl = `folio.app/${portfolio.userId}`;
    navigator.clipboard.writeText(portfolioUrl).then(
      () => toast({ title: "URL copied", description: "Portfolio URL copied to clipboard" }),
      () => toast({ title: "Copy failed", description: "Could not copy URL", variant: "destructive" })
    );
  };
  
  return (
    <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
      <div className="border-b border-slate-200 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Portfolio Preview</h2>
          <div className="flex space-x-2">
            <Button
              // variant="outline"
              size="sm"
              onClick={onEdit}
              className="bg-gray-700 text-white hover:bg-slate-500"
            >
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="bg-slate-700 text-white hover:bg-neutral-600"
            >
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <Alert className="mb-4 bg-neutral-700 outline-none border-none">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-gray-200">
            This is a preview of your portfolio. Your actual portfolio will look even better when published.
          </AlertDescription>
        </Alert>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-primary-50">
            {previewUrl && (
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                src={previewUrl}
                onLoad={() => setIsLoading(false)}
                title="Portfolio Preview"
              />
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="text-sm text-slate-300">Your portfolio URL</div>
            <div className="flex items-center mt-1">
              <span className="text-slate-300 font-medium mr-2">
                portfolio.app/{portfolio.userId}
              </span>
              <Button
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                onClick={handleCopyUrl}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end">
            <Button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending || !!portfolio.isPublished}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {publishMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : portfolio.isPublished ? (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Published
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Publish Portfolio
                </>
              )}
            </Button>
            <p className="text-xs text-slate-400 mt-2">
              {portfolio.isPublished 
                ? "Your portfolio is public and can be shared" 
                : "Make your portfolio public and shareable"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
