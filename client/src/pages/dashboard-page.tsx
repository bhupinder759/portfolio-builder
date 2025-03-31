import { useAuth } from "@/hooks/use-auth";
import { PortfolioBuilder } from "@/components/portfolio-builder";
import { useQuery } from "@tanstack/react-query";
import { Portfolio } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardPage() {
  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  return (
    <DashboardLayout activeTab="dashboard">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-slate-600">Loading portfolio...</span>
        </div>
      ) : (
        <PortfolioBuilder portfolio={portfolio} />
      )}
    </DashboardLayout>
  );
}
