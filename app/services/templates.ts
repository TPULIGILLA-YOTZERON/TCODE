import { ProjectFile, ProjectTemplate } from "@/app/types/project";
import { generateId } from "@/app/utils/id";

const now = () => Date.now();

const file = (name: string, path: string, language: ProjectFile["language"], content: string): ProjectFile => ({
  id: generateId(),
  name,
  path,
  language,
  content,
  createdAt: now(),
  updatedAt: now()
});

export const templateFiles = (template: ProjectTemplate): ProjectFile[] => {
  switch (template) {
    case "python-script":
      return [
        file("main.py", "main.py", "python", "print('Hello from CodeFusion Python runtime')")
      ];
    case "react-static":
      return [
        file(
          "index.html",
          "index.html",
          "html",
          "<div id='root'></div><script type='module' src='app.js'></script>"
        ),
        file(
          "app.js",
          "app.js",
          "javascript",
          "const root = document.getElementById('root'); root.innerHTML = `<h1>CodeFusion React-style starter</h1>`;"
        )
      ];
    case "html-basic":
    default:
      return [
        file("index.html", "index.html", "html", "<h1>Hello CodeFusion</h1>"),
        file("styles.css", "styles.css", "css", "body { font-family: sans-serif; color: #fff; background: #121212; }"),
        file("main.js", "main.js", "javascript", "console.log('CodeFusion ready');")
      ];
  }
};
