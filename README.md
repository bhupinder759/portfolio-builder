# Portfolio Generator

A modern React-based portfolio generator that empowers users to create professional digital portfolios with ease. This application supports multiple design themes, providing enhanced personalization and visual storytelling options.

## Features

- **Multiple Portfolio Themes**: Choose from a variety of professionally designed themes including Elegant, Nature, Modern, and more.
- **User Authentication**: Secure login and registration system.
- **Multi-step Portfolio Builder**: Guided process to create your portfolio:
  - Theme Selection
  - Personal Details
  - Experience
  - Projects
  - Preview
- **PDF Generation**: Export your portfolio as a PDF document.
- **Responsive Design**: Looks great on all devices - mobile, tablet, and desktop.

## Technology Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Database**: In-memory storage (can be extended to PostgreSQL)
- **Authentication**: Passport.js with local strategy
- **PDF Generation**: Client-side PDF creation
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query for server state, React Context for UI state

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/portfolio-generator.git
   cd portfolio-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Creating a Portfolio

1. Register a new account or log in to an existing one
2. Follow the multi-step process to create your portfolio:
   - Select a theme that matches your style
   - Enter your personal details (name, title, bio, skills)
   - Add your professional experiences
   - Showcase your projects
   - Preview your portfolio before finalizing
3. Generate a PDF version of your portfolio for sharing or printing

### Editing Your Portfolio

1. Log in to your account
2. Navigate to the dashboard
3. Click on "Edit Portfolio" to make changes
4. Save your changes to update your portfolio

## Deployment

### Deploying to Replit

This application is designed to work seamlessly on Replit:

1. Fork the Repl
2. Click the "Run" button
3. Access your running application via the provided URL

### Deploying to Other Platforms

The application can be deployed to various platforms like Vercel, Netlify, or Heroku:

1. Build the application: `npm run build`
2. Deploy the `dist` directory to your platform of choice
3. Set up environment variables as needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shadcn UI for the component library
- Tailwind CSS for styling
- React and Node.js communities for their excellent documentation