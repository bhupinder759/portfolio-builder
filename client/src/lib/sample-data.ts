import { Portfolio, Experience, Project, SocialLinks } from "@shared/schema";

export const sampleExperiences: Experience[] = [
  {
    id: "exp1",
    company: "Tech Innovations Inc.",
    position: "Senior Frontend Developer",
    startDate: "2020-03",
    endDate: "Present",
    description: "Led the development of the company's flagship product, resulting in a 40% increase in user engagement. Mentored junior developers and implemented modern React practices across multiple projects.",
  },
  {
    id: "exp2",
    company: "Digital Solutions Ltd.",
    position: "Web Developer",
    startDate: "2017-06",
    endDate: "2020-02",
    description: "Developed and maintained various client websites. Collaborated with the design team to implement responsive layouts and interactive features using JavaScript and CSS.",
  },
  {
    id: "exp3",
    company: "Creative Studio",
    position: "UI/UX Intern",
    startDate: "2016-01",
    endDate: "2017-05",
    description: "Assisted in designing user interfaces for mobile applications. Conducted user research and usability testing to improve product experiences.",
  }
];

export const sampleProjects: Project[] = [
  {
    id: "proj1",
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, product catalog, shopping cart, and payment integration. Built with React, Node.js, and MongoDB.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redux"],
    githubLink: "https://github.com/username/ecommerce-project",
    demoLink: "https://ecommerce-demo.example.com",
    image: "", // Would contain an image URL in a real scenario
  },
  {
    id: "proj2",
    title: "Weather Dashboard",
    description: "A weather application that displays current conditions and forecasts. Features include location search, saved locations, and animated weather icons.",
    technologies: ["React", "OpenWeather API", "CSS3", "Axios"],
    githubLink: "https://github.com/username/weather-app",
    image: "", // Would contain an image URL in a real scenario
  },
  {
    id: "proj3",
    title: "Task Management Tool",
    description: "A Kanban-style task management application with drag-and-drop functionality, task categorization, and deadline reminders.",
    technologies: ["React", "Redux", "Firebase", "Material UI"],
    githubLink: "https://github.com/username/task-manager",
    image: "", // Would contain an image URL in a real scenario
  }
];

export const sampleSocialLinks: SocialLinks = {
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username",
  website: "https://username.dev"
};

export const generateSamplePortfolio = (themeValue: string, userId: number): Partial<Portfolio> => {
  return {
    userId,
    theme: themeValue,
    firstName: "Alex",
    lastName: "Johnson",
    title: "Frontend Developer",
    bio: "Passionate frontend developer with over 5 years of experience building modern web applications. Specialized in React, TypeScript, and responsive design. I love creating beautiful, intuitive user interfaces that solve real-world problems.",
    contactEmail: "alex.johnson@example.com",
    contactLocation: "San Francisco, CA",
    profileImage: "", // Would contain an image URL in a real scenario
    skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Node.js", "REST APIs", "Git", "UI/UX", "Responsive Design"],
    experiences: sampleExperiences,
    projects: sampleProjects,
    socialLinks: sampleSocialLinks
  };
};

// Different sample data for different professional profiles

export const developerPortfolio = (themeValue: string, userId: number): Partial<Portfolio> => {
  return {
    userId,
    theme: themeValue,
    firstName: "Taylor",
    lastName: "Smith",
    title: "Full Stack Developer",
    bio: "Full stack developer with expertise in building scalable web applications. Passionate about clean code, performance optimization, and creating intuitive user experiences.",
    contactEmail: "taylor.smith@example.com",
    contactLocation: "Austin, TX",
    profileImage: "",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL", "Docker", "AWS", "CI/CD", "Testing"],
    experiences: [
      {
        id: "exp1",
        company: "TechForward",
        position: "Senior Developer",
        startDate: "2019-07",
        endDate: "Present",
        description: "Lead developer for the company's SaaS platform. Implemented microservices architecture and improved system performance by 60%."
      },
      {
        id: "exp2",
        company: "WebSolutions Inc.",
        position: "Software Engineer",
        startDate: "2016-03",
        endDate: "2019-06",
        description: "Developed and maintained client web applications. Implemented CI/CD pipelines and automated testing procedures."
      }
    ],
    projects: [
      {
        id: "proj1",
        title: "Real-time Collaboration Tool",
        description: "A collaborative platform with real-time editing, commenting, and task management. Built with React, Socket.io, and MongoDB.",
        technologies: ["React", "Socket.io", "MongoDB", "Node.js", "Express"],
        githubLink: "https://github.com/username/collab-tool",
        image: ""
      },
      {
        id: "proj2",
        title: "Inventory Management System",
        description: "A comprehensive inventory system for small businesses with barcode scanning, reporting, and supplier management.",
        technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Material UI"],
        githubLink: "https://github.com/username/inventory-system",
        image: ""
      }
    ],
    socialLinks: {
      github: "https://github.com/taylorsmith",
      linkedin: "https://linkedin.com/in/taylorsmith",
      twitter: "https://twitter.com/taylorsmith",
      website: "https://taylorsmith.dev"
    }
  };
};

export const designerPortfolio = (themeValue: string, userId: number): Partial<Portfolio> => {
  return {
    userId,
    theme: themeValue,
    firstName: "Jordan",
    lastName: "Rivera",
    title: "UI/UX Designer",
    bio: "Creative UI/UX designer with a background in psychology and a passion for creating user-centered designs. I focus on crafting intuitive, accessible, and beautiful digital experiences.",
    contactEmail: "jordan.rivera@example.com",
    contactLocation: "Portland, OR",
    profileImage: "",
    skills: ["UI Design", "UX Research", "Wireframing", "Prototyping", "Figma", "Adobe XD", "Usability Testing", "Accessibility", "Design Systems", "HTML/CSS"],
    experiences: [
      {
        id: "exp1",
        company: "Design Lab",
        position: "Senior UI/UX Designer",
        startDate: "2018-05",
        endDate: "Present",
        description: "Lead designer for client projects across various industries. Conducted user research and testing to create data-driven design solutions."
      },
      {
        id: "exp2",
        company: "Creative Agency",
        position: "Junior Designer",
        startDate: "2015-09",
        endDate: "2018-04",
        description: "Collaborated with multidisciplinary teams to create visual designs for websites and mobile applications."
      }
    ],
    projects: [
      {
        id: "proj1",
        title: "Healthcare Patient Portal",
        description: "Redesigned patient portal improving user satisfaction by 45%. Created an accessible interface for users of all abilities.",
        technologies: ["Figma", "Sketch", "Adobe XD", "User Testing"],
        demoLink: "https://behance.net/username/patient-portal",
        image: ""
      },
      {
        id: "proj2",
        title: "Banking App Redesign",
        description: "Modernized a banking application with improved information architecture and streamlined user flows, resulting in a 30% reduction in customer support requests.",
        technologies: ["Adobe XD", "Usability Testing", "Information Architecture"],
        demoLink: "https://behance.net/username/banking-app",
        image: ""
      }
    ],
    socialLinks: {
      github: "https://github.com/jordanrivera",
      linkedin: "https://linkedin.com/in/jordanrivera",
      twitter: "https://twitter.com/jordanrivera",
      website: "https://jordanrivera.design"
    }
  };
};

export const photographerPortfolio = (themeValue: string, userId: number): Partial<Portfolio> => {
  return {
    userId,
    theme: themeValue,
    firstName: "Casey",
    lastName: "Morgan",
    title: "Professional Photographer",
    bio: "Award-winning photographer specializing in portrait and landscape photography. My work has been featured in National Geographic, Vogue, and various art exhibitions around the world.",
    contactEmail: "casey.morgan@example.com",
    contactLocation: "Denver, CO",
    profileImage: "",
    skills: ["Portrait Photography", "Landscape Photography", "Adobe Photoshop", "Adobe Lightroom", "Photo Composition", "Lighting", "Studio Setup", "Event Photography", "Drone Photography", "Photo Editing"],
    experiences: [
      {
        id: "exp1",
        company: "Morgan Photography",
        position: "Owner & Photographer",
        startDate: "2017-01",
        endDate: "Present",
        description: "Running a successful photography business specializing in portraits, events, and commercial photography."
      },
      {
        id: "exp2",
        company: "Art Magazine",
        position: "Staff Photographer",
        startDate: "2014-03",
        endDate: "2016-12",
        description: "Traveled internationally to capture photos for feature articles. Coordinated with journalists to tell compelling visual stories."
      }
    ],
    projects: [
      {
        id: "proj1",
        title: "Mountain Wilderness Series",
        description: "A collection of landscape photographs showcasing the untouched beauty of mountain ranges across North America. Exhibited in three galleries.",
        technologies: ["Photography", "Landscape", "Adobe Lightroom", "Exhibition"],
        demoLink: "https://caseymorganphotography.com/wilderness",
        image: ""
      },
      {
        id: "proj2",
        title: "Urban Portraits",
        description: "Street portrait series capturing the diversity and character of city dwellers in major urban centers.",
        technologies: ["Photography", "Portraiture", "Adobe Photoshop", "Street Photography"],
        demoLink: "https://caseymorganphotography.com/urban",
        image: ""
      }
    ],
    socialLinks: {
      github: "",
      linkedin: "https://linkedin.com/in/caseymorgan",
      twitter: "https://twitter.com/caseymorgan",
      website: "https://caseymorganphotography.com"
    }
  };
};