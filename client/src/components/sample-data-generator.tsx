import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Portfolio } from "@shared/schema";
import { generateSamplePortfolio, developerPortfolio, designerPortfolio, photographerPortfolio } from "@/lib/sample-data";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CodeIcon, PaintbrushIcon, CameraIcon, UserIcon } from "lucide-react";

interface SampleDataGeneratorProps {
  portfolio: Portfolio;
  onSampleApplied?: () => void;
}

export function SampleDataGenerator({ portfolio, onSampleApplied }: SampleDataGeneratorProps) {
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Portfolio>) => {
      const res = await apiRequest("PATCH", "/api/portfolio", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Sample data applied",
        description: "Your portfolio has been populated with sample data.",
      });
      if (onSampleApplied) {
        onSampleApplied();
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to apply sample data",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const applySampleData = (profile: "general" | "developer" | "designer" | "photographer") => {
    let sampleData: Partial<Portfolio>;
    
    switch (profile) {
      case "developer":
        sampleData = developerPortfolio(portfolio.theme, portfolio.userId);
        break;
      case "designer":
        sampleData = designerPortfolio(portfolio.theme, portfolio.userId);
        break;
      case "photographer":
        sampleData = photographerPortfolio(portfolio.theme, portfolio.userId);
        break;
      default:
        sampleData = generateSamplePortfolio(portfolio.theme, portfolio.userId);
    }
    
    // Keep the existing theme
    updateMutation.mutate({
      ...sampleData,
      theme: portfolio.theme
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 bg-gray-600">
          <UserIcon className="h-4 w-4" />
          Apply Sample Data
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose a profile type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => applySampleData("general")}>
          <UserIcon className="h-4 w-4 mr-2" />
          General Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applySampleData("developer")}>
          <CodeIcon className="h-4 w-4 mr-2" />
          Developer Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applySampleData("designer")}>
          <PaintbrushIcon className="h-4 w-4 mr-2" />
          Designer Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applySampleData("photographer")}>
          <CameraIcon className="h-4 w-4 mr-2" />
          Photographer Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}