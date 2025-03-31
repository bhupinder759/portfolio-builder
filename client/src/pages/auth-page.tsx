import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm, RegisterForm } from "@/components/auth-forms";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth forms */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-4 bg-black">
        <Card className="w-full max-w-md shadow-lg bg-neutral-800 border-none">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white flex items-center justify-center">
                <span className="text-white mr-2">
                  {/* Using text instead of FontAwesome icon */}
                  🗃️
                </span>
                Portfolio
              </h1>
              <p className="text-slate-300 mt-2">
                Create your professional portfolio in minutes
              </p>
            </div>

            <Tabs defaultValue="login" className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-neutral-700">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero background */}
      <div className=" md:w-1/2 bg-slate-950 text-white p-10 flex flex-col justify-center align-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Showcase Your Skills with a Professional Portfolio</h2>
          <p className="text-white mb-6">
            Portfolio helps you create stunning portfolios to highlight your work and impress potential clients or employers.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">Choose from beautiful themes</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">Showcase your projects and experience</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">Download as PDF for offline sharing</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">Get noticed by potential employers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
