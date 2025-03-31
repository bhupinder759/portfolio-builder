import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Portfolio } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function ThemesPage() {
  const { user } = useAuth();
  
  const { data: portfolio, isLoading, isError } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  const themes = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean, minimalist design with a focus on content',
      image: 'https://images.unsplash.com/photo-1515504846179-94ac6b34ebb9?q=80&w=1326&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Modern and bold design for tech professionals',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated design with a premium feel',
      image: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Vibrant and unique design for creative professionals',
      image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with bold colors and clean layout',
      image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Organic, earthy design for environment-focused professionals',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
    }
  ];

  return (
    <DashboardLayout activeTab="themes">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">Portfolio Themes</h1>
          <p className="text-muted-foreground">
            Choose from our collection of professionally designed themes for your portfolio.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-slate-600">Loading themes...</span>
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            There was an error loading your portfolio data. Please refresh and try again.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {themes.map((theme) => (
              <div key={theme.id} className="bg-neutral-900 rounded-lg overflow-hidden hover:shadow-[5px_5px_0px_0px_rgba(109,40,217)] transition-shadow shadow-2xl shadow-blue-300/20">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={theme.image} 
                    alt={`${theme.name} theme preview`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {portfolio?.theme === theme.id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      Current Theme
                    </div>
                  )}
                </div>
                <div className="p-6 ">
                  <h3 className="text-xl font-semibold text-white mb-2">{theme.name}</h3>
                  <p className="text-slate-300 mb-4">
                    {theme.description}
                  </p>
                  
                  <a href={`/api/try-theme/${theme.id}`}>
                    <Button 
                      variant={portfolio?.theme === theme.id ? "outline" : "default"} 
                      className="w-full cursor-pointer bg-slate-600"
                    >
                      {portfolio?.theme === theme.id ? 'Current Theme' : 'Apply Theme'}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}