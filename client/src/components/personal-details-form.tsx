import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Portfolio } from "@shared/schema";

interface PersonalDetailsFormProps {
  portfolio: Portfolio;
  onBack: () => void;
  onNext: () => void;
}

const personalDetailsSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  title: z.string().min(1, { message: "Professional title is required" }),
  bio: z.string().min(10, { message: "Bio should be at least 10 characters" }),
  contactEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactLocation: z.string().optional(),
});

type FormValues = z.infer<typeof personalDetailsSchema>;

export function PersonalDetailsForm({ portfolio, onBack, onNext }: PersonalDetailsFormProps) {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>(portfolio.skills || []);
  const [newSkill, setNewSkill] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: portfolio.firstName || "",
      lastName: portfolio.lastName || "",
      title: portfolio.title || "",
      bio: portfolio.bio || "",
      contactEmail: portfolio.contactEmail || "",
      contactPhone: portfolio.contactPhone || "",
      contactLocation: portfolio.contactLocation || "",
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Portfolio>) => {
      const res = await apiRequest("PATCH", "/api/portfolio", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Details saved",
        description: "Your personal details have been updated.",
      });
      onNext();
    },
    onError: (error) => {
      toast({
        title: "Failed to save details",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  function onSubmit(data: FormValues) {
    updateMutation.mutate({
      ...data,
      skills,
    });
  }
  
  return (
    <div className="mb-8 bg-neutral-950 rounded-xl shadow-sm p-6 border border-neutral-900">
      <h2 className="text-xl font-semibold text-white mb-4">Personal Details</h2>
      <p className="text-slate-300 mb-6">Tell us about yourself to create your professional profile.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-white">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} className="bg-neutral-800 boder border-neutral-900"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} className="bg-neutral-800 boder border-neutral-900" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Professional Title</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer" {...field} className="bg-neutral-800 boder border-neutral-900 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Professional Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write a short professional bio..." 
                    className="resize-none bg-neutral-800 boder border-neutral-900 text-white"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-slate-500 mt-1">
                  Brief description of your professional background and expertise.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel className="block text-sm font-medium text-white mb-2">
              Skills
            </FormLabel>
            <div className="flex flex-wrap gap-2 p-2 border border-neutral-800 rounded-md bg-netural-800 min-h-[80px]">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-gray-300 text-black px-2 py-1 rounded-md text-sm flex items-center border border-neutral-300"
                >
                  {skill}
                  <button 
                    type="button"
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="border-0 pl-3 outline-none text-sm flex-grow min-w-[120px] bg-neutral-800 text-white placeholder-gray-400 caret-white "
                placeholder="Add skill + Enter"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="bg-neutral-800 boder border-neutral-900 text-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} className="bg-neutral-800 boder border-neutral-900 text-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="San Francisco, CA" {...field} className="bg-neutral-800 boder border-neutral-900 text-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button 
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Next: Experience"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
