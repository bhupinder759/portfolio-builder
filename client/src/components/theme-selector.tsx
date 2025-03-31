import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Theme {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface ThemeSelectorProps {
  selectedTheme: string;
  onNext: () => void;
}

const themes: Theme[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, modern design with focus on content",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80"
  },
  {
    id: "tech",
    name: "Tech",
    description: "Bold design for tech professionals",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant design for creative professionals",
    image: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80"
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated design with a premium feel",
    image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80"
  },
  {
    id: "nature",
    name: "Nature",
    description: "Organic, earthy design for environment-focused professionals",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with bold colors and clean layout",
    image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80"
  }
];

export function ThemeSelector({ selectedTheme, onNext }: ThemeSelectorProps) {
  const { toast } = useToast();
  const [theme, setTheme] = useState<string>(selectedTheme || "minimal");
  
  const updateThemeMutation = useMutation({
    mutationFn: async (theme: string) => {
      const res = await apiRequest("PATCH", "/api/portfolio", { theme });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Theme updated",
        description: "Your portfolio theme has been updated.",
      });
      onNext();
    },
    onError: (error) => {
      toast({
        title: "Failed to update theme",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
  };
  
  const handleNext = () => {
    if (theme !== selectedTheme) {
      updateThemeMutation.mutate(theme);
    } else {
      onNext();
    }
  };
  
  return (
    <div className="mb-8 bg-gray-950 rounded-xl shadow-sm p-6 ">
      <h2 className="text-xl font-semibold text-white mb-4">Choose a Theme</h2>
      <p className="text-slate-400 mb-6">Select a theme that best represents your professional style.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((themeItem) => (
          <div
            key={themeItem.id}
            className={cn(
              "border rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]",
              theme === themeItem.id ? "border-primary ring-2 ring-primary" : "border-none shadow-2xl shadow-blue-500/20"
            )}
            onClick={() => handleThemeSelect(themeItem.id)}
          >
            <div className="aspect-w-16 aspect-h-9 bg-slate-100 relative">
              <img
                className="object-cover w-full h-full"
                src={themeItem.image}
                alt={`${themeItem.name} theme preview`}
              />
              {theme === themeItem.id && (
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-80 flex items-center justify-center">
                  <span className="text-black bg-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Selected
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-slate-200">{themeItem.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{themeItem.description}</p>
              <Button 
                variant="ghost" 
                size="sm"
                className="mt-3 w-full text-primary bg-gray-300 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (theme !== themeItem.id) {
                    setTheme(themeItem.id);
                    updateThemeMutation.mutate(themeItem.id);
                  }
                }}
                disabled={updateThemeMutation.isPending || theme === themeItem.id}
              >
                {theme === themeItem.id ? 'Current Theme' : 'Try This Theme'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={updateThemeMutation.isPending}
          className="bg-gray-300 text-primary hover:bg-white hover:text-black"
        >
          {updateThemeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Next: Personal Details"
          )}
        </Button>
      </div>
    </div>
  );
}
