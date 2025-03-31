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
import { Loader2, Pencil, Trash2, Link2, Github, CalendarIcon } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Project, Portfolio } from "@shared/schema";

interface ProjectsFormProps {
  portfolio: Portfolio;
  onBack: () => void;
  onNext: () => void;
}

const projectSchema = z.object({
  title: z.string().min(1, { message: "Project title is required" }),
  description: z.string().min(10, { message: "Description should be at least 10 characters" }),
  image: z.string().optional(),
  technologies: z.string().transform(val => val.split(',').map(t => t.trim()).filter(Boolean)),
  demoLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  githubLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectsForm({ portfolio, onBack, onNext }: ProjectsFormProps) {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(
    Array.isArray(portfolio.projects) ? portfolio.projects : []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Define a custom type that allows for both string and string[] for technologies
  interface ProjectFormWithStringTech extends Omit<ProjectFormValues, 'technologies'> {
    technologies: string;
  }

  const form = useForm<ProjectFormWithStringTech>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      technologies: "",
      demoLink: "",
      githubLink: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: { projects: Project[] }) => {
      const res = await apiRequest("PATCH", "/api/portfolio", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Projects saved",
        description: "Your projects have been updated.",
      });
      onNext();
    },
    onError: (error) => {
      toast({
        title: "Failed to save projects",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const openAddDialog = () => {
    form.reset({
      title: "",
      description: "",
      image: "",
      technologies: "",
      demoLink: "",
      githubLink: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    const project = projects[index];
    form.reset({
      title: project.title,
      description: project.description,
      image: project.image || "",
      technologies: project.technologies.join(", "),
      demoLink: project.demoLink || "",
      githubLink: project.githubLink || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      isCurrent: project.isCurrent || false,
    });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
    
    toast({
      title: "Project removed",
      description: "The project has been removed from your portfolio.",
    });
  };

  const handleSaveProject = (data: ProjectFormWithStringTech) => {
    // Convert technologies string to array
    const technologiesArray = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    
    const projectData = {
      ...data,
      technologies: technologiesArray,
      id: editingIndex !== null && projects[editingIndex]?.id 
        ? projects[editingIndex].id 
        : `proj-${Date.now()}`,
    };
    
    let updatedProjects;
    
    if (editingIndex !== null) {
      updatedProjects = [...projects];
      updatedProjects[editingIndex] = projectData;
    } else {
      updatedProjects = [...projects, projectData];
    }
    
    setProjects(updatedProjects);
    setIsDialogOpen(false);
    
    toast({
      title: editingIndex !== null ? "Project updated" : "Project added",
      description: editingIndex !== null 
        ? "The project has been updated." 
        : "The new project has been added to your portfolio.",
    });
  };

  const handleSubmit = () => {
    updateMutation.mutate({ projects });
  };

  const getRandomImageUrl = () => {
    const imageIds = [
      "photo-1460925895917-afdab827c52f",
      "photo-1517180452099-031c99a9a414",
      "photo-1555774698-0b77e0d5fac6",
      "photo-1517694712202-14dd9538aa97"
    ];
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    return `https://images.unsplash.com/${randomId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=281&q=80`;
  };

  return (
    <div className="mb-8 bg-neutral-950 rounded-xl shadow-sm p-6 border border-neutral-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <Button 
          // variant="outline" 
          size="sm" 
          onClick={openAddDialog}
          className="bg-gray-800 text-white hover:bg-gray-600 hover:text-gray-300 outline-1"
        >
          <i className="fas fa-plus mr-1 text-white"></i> Add Project
        </Button>
      </div>
      <p className="text-slate-300 mb-6">
        Showcase your notable projects and achievements.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="text-center py-8 bg-neutral-800 border border-dashed border-neutral-500 rounded-lg md:col-span-2">
            <p className="text-white">No projects added yet.</p>
            <Button 
              variant="link" 
              onClick={openAddDialog} 
              className="text-gray-300 mt-2"
            >
              Add your first project
            </Button>
          </div>
        ) : (
          projects.map((project, index) => (
            <div key={project.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-slate-100">
                <img 
                  className="object-cover w-full h-full" 
                  src={project.image || getRandomImageUrl()}
                  alt={`${project.title} project`} 
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-slate-900">{project.title}</h3>
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
                      onClick={() => handleDeleteProject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {project.technologies.join(", ")}
                </p>
                {(project.startDate || project.endDate) && (
                  <p className="text-sm text-slate-500 mt-1">
                    {project.startDate} {project.startDate && project.endDate && "-"} {project.isCurrent ? "Present" : project.endDate}
                  </p>
                )}
                <p className="text-sm text-slate-600 mt-2">
                  {project.description}
                </p>
                <div className="mt-3 flex space-x-2">
                  {project.demoLink && (
                    <a 
                      href={project.demoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 flex items-center"
                    >
                      <Link2 className="h-3.5 w-3.5 mr-1" /> Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 flex items-center"
                    >
                      <Github className="h-3.5 w-3.5 mr-1" /> GitHub
                    </a>
                  )}
                </div>
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
            "Next: Preview"
          )}
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => handleSaveProject(data))} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. E-commerce Dashboard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. React, Redux, Chart.js" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-slate-500">
                      Comma-separated list of technologies
                    </p>
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
                        placeholder="Describe your project" 
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="demoLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo Link (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://demo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Link (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date (optional)</FormLabel>
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
                            selected={field.value ? new Date(field.value) : undefined}
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
                      <FormLabel>End Date (optional)</FormLabel>
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
                      <FormLabel>I am currently working on this project</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Project</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
