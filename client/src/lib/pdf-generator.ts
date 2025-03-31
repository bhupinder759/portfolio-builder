import { Portfolio } from "@shared/schema";

// This function would typically use a PDF library like jsPDF or use a server endpoint
// For this implementation, we'll use browser's built-in print functionality
export function generatePDF(
  portfolio: Portfolio,
  onSuccess: () => void,
  onError: (error: Error) => void
) {
  try {
    // Create a printable HTML string representing the portfolio
    const printableHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${portfolio.firstName} ${portfolio.lastName} - Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.5;
            color: #334155;
            padding: 2rem;
          }
          .page-break {
            page-break-after: always;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 3rem;
          }
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }
          .header h2 {
            font-size: 1.5rem;
            font-weight: 400;
            color: #64748b;
          }
          .section {
            margin-bottom: 3rem;
          }
          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
          }
          .bio {
            font-size: 1.125rem;
            color: #4b5563;
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .skill {
            background-color: #f1f5f9;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          .experience-item, .project-item {
            margin-bottom: 2rem;
          }
          .experience-item h3, .project-item h3 {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
          }
          .experience-item .company, .project-item .tech {
            font-size: 1rem;
            color: #0ea5e9;
            margin-bottom: 0.25rem;
          }
          .experience-item .date {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 0.5rem;
          }
          .experience-item p, .project-item p {
            font-size: 1rem;
            color: #4b5563;
          }
          .contact {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
          }
          .contact-item {
            color: #4b5563;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1>${portfolio.firstName} ${portfolio.lastName}</h1>
            <h2>${portfolio.title}</h2>
          </header>
          
          <section class="section">
            <h2 class="section-title">About Me</h2>
            <p class="bio">${portfolio.bio}</p>
          </section>
          
          <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills">
              ${portfolio.skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
            </div>
          </section>
          
          <section class="section">
            <h2 class="section-title">Experience</h2>
            ${Array.isArray(portfolio.experiences) && portfolio.experiences.map(exp => `
              <div class="experience-item">
                <h3>${exp.position}</h3>
                <div class="company">${exp.company}</div>
                <div class="date">${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}</div>
                <p>${exp.description}</p>
              </div>
            `).join('') || ''}
          </section>
          
          <div class="page-break"></div>
          
          <section class="section">
            <h2 class="section-title">Projects</h2>
            ${Array.isArray(portfolio.projects) && portfolio.projects.map(proj => `
              <div class="project-item">
                <h3>${proj.title}</h3>
                <div class="tech">${proj.technologies.join(', ')}</div>
                <p>${proj.description}</p>
              </div>
            `).join('') || ''}
          </section>
          
          <section class="section">
            <h2 class="section-title">Contact</h2>
            <div class="contact">
              ${portfolio.contactEmail ? `<div class="contact-item">Email: ${portfolio.contactEmail}</div>` : ''}
              ${portfolio.contactPhone ? `<div class="contact-item">Phone: ${portfolio.contactPhone}</div>` : ''}
              ${portfolio.contactLocation ? `<div class="contact-item">Location: ${portfolio.contactLocation}</div>` : ''}
            </div>
          </section>
          
          <div class="no-print">
            <p style="text-align: center; margin-top: 2rem; color: #64748b;">
              This page will automatically print. Press Ctrl+P (Cmd+P on Mac) if the print dialog doesn't appear.
            </p>
          </div>
        </div>
        
        <script>
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }, 1000);
        </script>
      </body>
      </html>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window. Please check if pop-ups are blocked.');
    }
    
    printWindow.document.write(printableHTML);
    printWindow.document.close();
    
    onSuccess();
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Failed to generate PDF'));
  }
}
