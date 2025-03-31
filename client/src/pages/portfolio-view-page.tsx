import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Portfolio } from "@shared/schema";
import { Loader2, Download, ExternalLink } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Link } from "wouter";

export default function PortfolioViewPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: portfolio, isLoading, isError } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  const handleGeneratePDF = () => {
    if (!portfolio) return;
    
    generatePDF(
      portfolio,
      (url) => {
        // Success callback - open the PDF in a new tab
        window.open(url, '_blank');
      },
      (error) => {
        // Error callback
        toast({
          title: "Error generating PDF",
          description: error.message,
          variant: "destructive",
        });
      }
    );
  };

  const renderPortfolioContent = () => {
    if (!portfolio) return null;

    return (
      <div className="space-y-8">
        {/* Header with name and title */}
        <div className="text-center bg- sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{portfolio.name || "Your Name"}</h1>
            <p className="text-xl text-slate-500 mt-1">{portfolio.profession || "Your Profession"}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleGeneratePDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Link href="/dashboard">
              <Button variant="default">
                <ExternalLink className="mr-2 h-4 w-4" />
                Edit Portfolio
              </Button>
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-slate-600">
              {portfolio.bio || "Add your bio to tell people about yourself and your work."}
            </p>
            
            {/* Skills */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Experience</h2>
            <div className="space-y-6">
              {portfolio.experience.map((exp, index) => (
                <div key={index} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-medium text-slate-900">{exp.position} at {exp.company}</h3>
                    <span className="text-sm text-slate-500 mt-1 sm:mt-0">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="border border-slate-100 rounded-lg overflow-hidden">
                  {project.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-medium text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{project.date}</p>
                    <p className="mt-2 text-slate-600">{project.description}</p>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-primary hover:underline"
                      >
                        View Project
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Contact</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {portfolio.email && (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Email</h3>
                  <p className="text-slate-900">{portfolio.email}</p>
                </div>
              </div>
            )}
            {portfolio.phone && (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Phone</h3>
                  <p className="text-slate-900">{portfolio.phone}</p>
                </div>
              </div>
            )}
            {portfolio.location && (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Location</h3>
                  <p className="text-slate-900">{portfolio.location}</p>
                </div>
              </div>
            )}
            {portfolio.website && (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <i className="fas fa-globe"></i>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Website</h3>
                  <a 
                    href={portfolio.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {portfolio.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {portfolio.socialLinks && Object.values(portfolio.socialLinks).some(link => link) && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-medium mb-4">Social Media</h3>
              <div className="flex flex-wrap gap-4">
                {portfolio.socialLinks.github && (
                  <a 
                    href={portfolio.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary"
                  >
                    <i className="fab fa-github text-2xl"></i>
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a 
                    href={portfolio.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary"
                  >
                    <i className="fab fa-linkedin text-2xl"></i>
                  </a>
                )}
                {portfolio.socialLinks.twitter && (
                  <a 
                    href={portfolio.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary"
                  >
                    <i className="fab fa-twitter text-2xl"></i>
                  </a>
                )}
                {portfolio.socialLinks.instagram && (
                  <a 
                    href={portfolio.socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary"
                  >
                    <i className="fab fa-instagram text-2xl"></i>
                  </a>
                )}
                {portfolio.socialLinks.dribbble && (
                  <a 
                    href={portfolio.socialLinks.dribbble} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary"
                  >
                    <i className="fab fa-dribbble text-2xl"></i>
                  </a>
                )}
                {portfolio.socialLinks.behance && (
                  <a 
                    href={portfolio.socialLinks.behance} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-primary"
                  >
                    <i className="fab fa-behance text-2xl"></i>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout activeTab="portfolio">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Portfolio</h1>
          <p className="text-muted-foreground text-gray-400">
            View your portfolio as others would see it.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-slate-600">Loading portfolio...</span>
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            There was an error loading your portfolio. Please refresh and try again.
          </div>
        ) : !portfolio ? (
          <div className="p-6 bg-yellow-50 text-yellow-700 rounded-md">
            <p className="font-medium mb-2">Portfolio not found</p>
            <p className="mb-4">You haven't created a portfolio yet.</p>
            <Link href="/dashboard">
              <Button>Create Portfolio</Button>
            </Link>
          </div>
        ) : (
          <div className={`p-6 bg-white ${portfolio.theme === 'dark' ? 'bg-slate-900 text-white' : ''} rounded-lg shadow-sm`}>
            {renderPortfolioContent()}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}