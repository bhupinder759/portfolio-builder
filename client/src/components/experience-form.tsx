import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Experience, Portfolio } from "@shared/schema";

interface ExperienceFormProps {
  portfolio: Portfolio;
  onBack: () => void;
  onNext: () => void;
}

const experienceSchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().min(10, { message: "Description should be at least 10 characters" }),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceForm({ portfolio, onBack, onNext }: ExperienceFormProps) {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>(
    Array.isArray(portfolio.experiences) ? portfolio.experiences : []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: { experiences: Experience[] }) => {
      const res = await apiRequest("PATCH", "/api/portfolio", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Experiences saved",
        description: "Your work experiences have been updated.",
      });
      onNext();
    },
    onError: (error) => {
      toast({
        title: "Failed to save experiences",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const openAddDialog = () => {
    form.reset({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    const exp = experiences[index];
    form.reset({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      isCurrent: exp.isCurrent || false,
      description: exp.description,
    });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
    
    toast({
      title: "Experience removed",
      description: "The work experience has been removed from your portfolio.",
    });
  };

  const handleSaveExperience = (data: ExperienceFormValues) => {
    const experienceData = {
      ...data,
      id: editingIndex !== null && experiences[editingIndex]?.id 
        ? experiences[editingIndex].id 
        : `exp-${Date.now()}`,
    };
    
    let updatedExperiences;
    
    if (editingIndex !== null) {
      updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = experienceData;
    } else {
      updatedExperiences = [...experiences, experienceData];
    }
    
    setExperiences(updatedExperiences);
    setIsDialogOpen(false);
    
    toast({
      title: editingIndex !== null ? "Experience updated" : "Experience added",
      description: editingIndex !== null 
        ? "The work experience has been updated." 
        : "The new work experience has been added to your portfolio.",
    });
  };

  const handleSubmit = () => {
    updateMutation.mutate({ experiences });
  };

  return (
    <div className="mb-8 bg-neutral-950 rounded-xl shadow-sm p-6 border border-neutral-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Work Experience</h2>
        <Button 
          // variant="outline" 
          size="sm" 
          onClick={openAddDialog}
          className="bg-gray-800 text-white hover:bg-gray-600 hover:text-gray-300 outline-1"
        >
          <i className="fas fa-plus mr-1  text-white"></i> Add Experience
        </Button>
      </div>
      <p className="text-slate-400 mb-6">
        Add your work experience to showcase your professional background.
      </p>
      
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-8 border bg-neutral-800 border-dashed border-slate-600 rounded-lg">
            <p className="text-white">No work experiences added yet.</p>
            <Button 
              variant="link" 
              onClick={openAddDialog} 
              className="text-primary text-gray-400 mt-2"
            >
              Add your first experience
            </Button>
          </div>
        ) : (
          experiences.map((experience, index) => (
            <div key={experience.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900">{experience.position}</h3>
                  <p className="text-sm text-primary-700">{experience.company}</p>
                  <p className="text-sm text-slate-500">
                    {experience.startDate} - {experience.isCurrent ? "Present" : experience.endDate}
                  </p>
                </div>
                <div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                    onClick={() => openEditDialog(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                    onClick={() => handleDeleteExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-slate-600">{experience.description}</p>
              </div>
            </div>
          ))
        )}
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
          type="button"
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Next: Projects"
          )}
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveExperience)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Your job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                field.value
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "MMM yyyy"));
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={form.getValues("isCurrent")}
                            >
                              {field.value ? (
                                field.value
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "MMM yyyy"));
                              }
                            }}
                            disabled={form.getValues("isCurrent")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("endDate", "");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently work here</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your responsibilities and achievements" 
                        className="resize-none"
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Experience</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
