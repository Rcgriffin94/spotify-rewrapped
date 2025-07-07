"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Code, Zap, Users, Database, User, Github } from "lucide-react"

export default function ProjectDetailsPage() {
  const techStack = [
    "Next.js 14",
    "TypeScript",
    "Tailwind CSS",
    "NextAuth.js",
    "Spotify Web API",
    "Vercel",
    "GitHub Copilot",
    "Claude",
    "ChatGPT"
  ]

  const features = [
    "Spotify OAuth Authentication",
    "Top Tracks Analysis",
    "Top Artists Discovery", 
    "Recently Played History",
    "Listening Statistics & Charts",
    "Responsive Design",
    "Production Deployment"
  ]

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Notes from the Developer */}
          <Card className="bg-black/50 border-green-800 mb-8">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <User className="w-5 h-5" />
                Notes from the Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                I use the title &quot;<em>developer</em>&quot; very loosely here. I&apos;ve dabbled in development as a hobby, 
                but I&apos;ve never done it professionally. You could say I know just enough to be dangerous.
              </p>
              <p>
                This project started as an idea to recreate Spotify Wrapped. Originally, it was just a way 
                for me to learn more about coding. Over time, though, the idea faded and was eventually 
                forgotten until recently. With the growing focus on AI, I thought it would be a fun experiment 
                to see if I could build something using AI without writing any code. I never expected it to be this easy. 
                I built this entire project in just a few hours over the weekend 100% with AI.
              </p>
              <p>
                I&apos;ve learned a lot through this process. First, I&apos;ve gained a deep respect for developers. 
                Their work requires immense skill and patience. I also learned how to incorporate AI into both 
                my personal and professional life. For this project, I spent a lot of time establishing the 
                ground rules and designing the architecture to keep Copilot on track. But once Copilot had 
                the right context, it performed the work of several engineers in minutes.
              </p>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Project Overview */}
            <Card className="bg-black/50 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Built with AI in Record Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>Development Time: Weekend Project</span>
                </div>
                <p className="text-gray-300">
                  This entire application was conceived, designed, and built using AI assistance over a single weekend. 
                  From initial concept to production deployment, AI helped accelerate every step of the development process.
                </p>
                <p className="text-gray-300">
                  The project demonstrates the power of modern AI tools in rapid prototyping and full-stack development, 
                  enabling complex features like OAuth integration, data visualization, and responsive design in minimal time.
                </p>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="bg-black/50 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span 
                      key={tech} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-800 text-green-400 border border-green-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* GitHub Repository Link */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <a 
                    href="https://github.com/Rcgriffin94/spotify-rewrapped" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300 rounded-lg border border-gray-600 hover:border-green-600 transition-all duration-200 group"
                  >
                    <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">View Source Code</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Implemented */}
          <Card className="bg-black/50 border-green-800 mb-8">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Features Implemented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Development Process */}
          <Card className="bg-black/50 border-green-800 mb-8">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Database className="w-5 h-5" />
                AI-Assisted Development Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Planning & Architecture</h4>
                  <p className="text-gray-300 text-sm">
                    AI helped design the application architecture, plan the component structure, 
                    and set up the development environment with best practices.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Code Generation</h4>
                  <p className="text-gray-300 text-sm">
                    Complex features like OAuth flows, API integrations, and data visualization 
                    components were generated and refined with AI assistance.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Debugging & Optimization</h4>
                  <p className="text-gray-300 text-sm">
                    AI helped identify and resolve TypeScript errors, ESLint issues, 
                    and performance bottlenecks throughout development.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Deployment & Production</h4>
                  <p className="text-gray-300 text-sm">
                    From environment configuration to Vercel deployment, AI guided 
                    the entire production setup and troubleshooting process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Built by Ryan Griffin, June 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
