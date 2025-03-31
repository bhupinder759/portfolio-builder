export interface PortfolioTheme {
  id: string;
  name: string;
  description: string;
  image: string;
}

export enum Step {
  Theme = 1,
  Details = 2,
  Experience = 3,
  Projects = 4,
  Preview = 5
}
