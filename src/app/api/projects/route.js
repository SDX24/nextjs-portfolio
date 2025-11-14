// GET /api/projects
export async function GET() {
  const projects = [
    {
      title: "Conway's Game of Life",
      description: "Cellular automaton visualizer built with React and Canvas API.",
      image: "/project.png",
      link: "https://example.com/game-of-life",
      keywords: ["algorithms", "simulation", "react"]
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather application with location search and forecasts.",
      image: "/project.png",
      link: "https://example.com/weather",
      keywords: ["api", "weather", "dashboard"]
    },
    {
      title: "Task Manager Pro",
      description: "Full-stack task management application with user authentication.",
      image: "/project.png",
      link: "https://example.com/tasks",
      keywords: ["fullstack", "auth", "productivity"]
    }
  ];

  return Response.json({ projects });
}
