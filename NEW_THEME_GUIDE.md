# Creating a New Theme Guide

This guide provides instructions and code samples for creating new themes in the Portfolio Generator application.

## Theme Structure

Themes in the Portfolio Generator app consist of several components:

1. Theme metadata (ID, name, description, and preview image)
2. Theme-specific styling for the portfolio preview
3. Theme-specific component layouts

## Step 1: Create Theme Metadata

First, add your new theme to the available themes list:

```tsx
// client/src/components/theme-selector.tsx

const themes: Theme[] = [
  // ... existing themes
  {
    id: "futuristic",
    name: "Futuristic",
    description: "A bold, cutting-edge theme with neon accents and sleek animations",
    image: "/themes/futuristic-preview.png"
  },
];
```

## Step 2: Create Theme-Specific CSS

Create a CSS file for your theme with specific styling:

```css
/* client/src/themes/futuristic.css */

.theme-futuristic {
  --primary-color: #00f2ff;
  --secondary-color: #ff00e6;
  --background-color: #0a0a1a;
  --text-color: #ffffff;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: 1px solid rgba(0, 242, 255, 0.2);
  --heading-font: 'Orbitron', sans-serif;
  --body-font: 'Exo 2', sans-serif;
  
  color: var(--text-color);
  background-color: var(--background-color);
  font-family: var(--body-font);
}

.theme-futuristic h1,
.theme-futuristic h2,
.theme-futuristic h3,
.theme-futuristic h4,
.theme-futuristic h5,
.theme-futuristic h6 {
  font-family: var(--heading-font);
  letter-spacing: 1px;
}

.theme-futuristic header {
  background: linear-gradient(45deg, #0a0a1a 0%, #1a1a3a 100%);
  border-bottom: 1px solid var(--primary-color);
  padding: 2rem 0;
}

.theme-futuristic .header-content {
  position: relative;
  z-index: 1;
}

.theme-futuristic .header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 50%, rgba(0, 242, 255, 0.15), transparent 70%);
  pointer-events: none;
}

.theme-futuristic .name {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-transform: uppercase;
}

.theme-futuristic .title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.theme-futuristic .section-title {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  text-transform: uppercase;
}

.theme-futuristic .section-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.theme-futuristic .card {
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 242, 255, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.theme-futuristic .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 242, 255, 0.2);
}

.theme-futuristic .skill-tag {
  display: inline-block;
  background: rgba(0, 242, 255, 0.1);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.35rem 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: background 0.2s ease;
}

.theme-futuristic .skill-tag:hover {
  background: rgba(0, 242, 255, 0.2);
}

.theme-futuristic .project-card {
  position: relative;
  overflow: hidden;
}

.theme-futuristic .project-image {
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.theme-futuristic .project-card:hover .project-image {
  transform: scale(1.05);
}

.theme-futuristic .project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10, 10, 26, 0.9), transparent);
  padding: 2rem 1.5rem 1.5rem;
  transition: opacity 0.3s ease;
}

.theme-futuristic .social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--primary-color);
  border-radius: 50%;
  color: var(--primary-color);
  margin-right: 1rem;
  transition: all 0.2s ease;
}

.theme-futuristic .social-icon:hover {
  background: var(--primary-color);
  color: var(--background-color);
}

.theme-futuristic .contact-form input,
.theme-futuristic .contact-form textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 242, 255, 0.3);
  border-radius: 6px;
  color: var(--text-color);
  padding: 0.75rem 1rem;
  width: 100%;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease;
}

.theme-futuristic .contact-form input:focus,
.theme-futuristic .contact-form textarea:focus {
  border-color: var(--primary-color);
  outline: none;
}

.theme-futuristic .button {
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  color: var(--background-color);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theme-futuristic .button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
}

/* Animated gradient border effect */
.theme-futuristic .border-effect {
  position: relative;
}

.theme-futuristic .border-effect::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color), transparent, var(--primary-color));
  background-size: 400% 400%;
  z-index: -1;
  border-radius: 10px;
  animation: border-animation 6s ease-in-out infinite;
}

@keyframes border-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Glowing text effect */
.theme-futuristic .glow-text {
  text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color);
}
```

## Step 3: Create Theme Component

Create a component for rendering portfolios with your new theme:

```tsx
// client/src/components/portfolio-themes/futuristic-theme.tsx
import { Portfolio } from "@shared/schema";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { Tilt } from "react-tilt";

interface FuturisticThemeProps {
  portfolio: Portfolio;
  showContactForm?: boolean;
}

export function FuturisticTheme({ portfolio, showContactForm = false }: FuturisticThemeProps) {
  // Extract portfolio data
  const {
    firstName,
    lastName,
    title,
    bio,
    skills,
    experiences,
    projects,
    contactEmail,
    contactLocation,
    socialLinks,
  } = portfolio;

  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="theme-futuristic min-h-screen">
      {/* Header Section */}
      <header className="relative py-20">
        <div className="header-background"></div>
        <div className="container mx-auto px-6 header-content">
          <h1 className="name">{fullName}</h1>
          <h2 className="title">{title}</h2>
          <p className="max-w-2xl text-gray-300 mt-6">{bio}</p>

          {/* Skills */}
          <div className="mt-8">
            {skills && skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-8 flex">
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaGithub />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin />
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
            )}
            {socialLinks?.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaGlobe />
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Experience Section */}
        <section className="mb-20">
          <h2 className="section-title">Experience</h2>
          <div className="space-y-6">
            {experiences && experiences.map((exp) => (
              <div key={exp.id} className="card border-effect">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                    <h4 className="text-lg text-primary-500 mb-2">{exp.company}</h4>
                  </div>
                  <div className="text-sm text-gray-400 md:text-right mt-2 md:mt-0">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </div>
                </div>
                <p className="mt-4 text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <h2 className="section-title">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects && projects.map((project) => (
              <Tilt key={project.id} options={{ max: 15, scale: 1.05 }}>
                <div className="card project-card h-full flex flex-col">
                  {project.image && (
                    <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="project-image object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="mb-4">
                    {project.technologies && project.technologies.map((tech, index) => (
                      <span key={index} className="skill-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-4 mt-auto">
                    {project.demoLink && (
                      <a 
                        href={project.demoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="button text-sm px-4 py-2"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm px-4 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:bg-opacity-10 transition-colors"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-20">
          <h2 className="section-title">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="card border-effect">
              <h3 className="text-xl font-bold mb-6 text-white">Get In Touch</h3>
              {contactEmail && (
                <div className="mb-4">
                  <p className="text-gray-400 mb-1">Email</p>
                  <p className="text-primary-500">{contactEmail}</p>
                </div>
              )}
              {contactLocation && (
                <div className="mb-4">
                  <p className="text-gray-400 mb-1">Location</p>
                  <p className="text-white">{contactLocation}</p>
                </div>
              )}
              <div className="mt-6">
                <p className="text-gray-300">Let's connect and bring your ideas to life!</p>
              </div>
            </div>

            {showContactForm && (
              <div className="card border-effect">
                <h3 className="text-xl font-bold mb-6 text-white">Send Message</h3>
                <form className="contact-form">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                  <textarea rows={4} placeholder="Your Message" required></textarea>
                  <button type="submit" className="button">Send Message</button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-opacity-10 backdrop-filter backdrop-blur-lg border-t border-primary-500 border-opacity-20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Created with Portfolio Generator</p>
        </div>
      </footer>
    </div>
  );
}
```

## Step 4: Register the Theme in the Portfolio Preview Component

Update the portfolio preview component to include your new theme:

```tsx
// client/src/components/portfolio-preview.tsx

// Import your new theme
import { FuturisticTheme } from "./portfolio-themes/futuristic-theme";

export function PortfolioPreview({ portfolio, onBack, onEdit }: PortfolioPreviewProps) {
  // ... existing code

  return (
    <div className="mb-8">
      {/* ... existing code */}
      
      <div className="mt-8">
        {portfolio.theme === "minimal" && (
          <MinimalTheme portfolio={portfolio} />
        )}
        {portfolio.theme === "tech" && (
          <TechTheme portfolio={portfolio} />
        )}
        {portfolio.theme === "creative" && (
          <CreativeTheme portfolio={portfolio} />
        )}
        {portfolio.theme === "elegant" && (
          <ElegantTheme portfolio={portfolio} />
        )}
        {portfolio.theme === "nature" && (
          <NatureTheme portfolio={portfolio} />
        )}
        {portfolio.theme === "modern" && (
          <ModernTheme portfolio={portfolio} />
        )}
        {/* Add your new theme condition */}
        {portfolio.theme === "futuristic" && (
          <FuturisticTheme portfolio={portfolio} />
        )}
      </div>
    </div>
  );
}
```

## Step 5: Add Theme Font Dependencies

If your theme uses custom fonts, add them to the index.html file:

```html
<!-- client/index.html -->
<head>
  <!-- ... other head content -->
  
  <!-- Futuristic theme fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

## Step 6: Create a Theme Preview Image

Create a preview image for your theme to display in the theme selector:

1. Take a screenshot or create a mockup of a portfolio using your theme
2. Resize it to fit within the theme selector cards (recommended: 400x300px)
3. Save it as PNG or JPG in the public/themes directory
4. Reference it in the theme metadata (Step 1)

## Step 7: Import Theme CSS

Import your theme CSS in the main CSS file:

```css
/* client/src/index.css */

/* ... other imports */
@import './themes/futuristic.css';
```

## Tips for Creating Effective Themes

1. **Define a Clear Visual Identity**: Each theme should have a unique look and feel that conveys a specific mood or style.

2. **Use Consistent Colors**: Create a harmonious color palette with 3-5 main colors.

3. **Typography Matters**: Choose fonts that work well together and reflect the theme's character.

4. **Consider Different Portfolio Types**: Ensure your theme works well for different portfolio types (developer, designer, photographer, etc.).

5. **Test Responsiveness**: Make sure your theme looks good on all screen sizes.

6. **Optimize Performance**: Minimize CSS size and avoid complex animations that might reduce performance.

7. **Accessibility**: Ensure sufficient color contrast and readable text sizes.

8. **Focus on Content**: The design should enhance the portfolio content, not distract from it.

By following these steps, you can create beautiful and unique themes for the Portfolio Generator application.