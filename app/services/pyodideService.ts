declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string; stdout?: (msg: string) => void; stderr?: (msg: string) => void }) => Promise<any>;
  }
}

let pyodide: any;
let pyodideLoadingPromise: Promise<any> | null = null;

const PYODIDE_SCRIPT = "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js";

const appendScript = () =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src='${PYODIDE_SCRIPT}']`)) return resolve();
    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });

export const pyodideService = {
  async init(stdout: (msg: string) => void, stderr: (msg: string) => void) {
    if (pyodide) return pyodide;
    if (!pyodideLoadingPromise) {
      pyodideLoadingPromise = (async () => {
        await appendScript();
        pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/",
          stdout,
          stderr
        });
        return pyodide;
      })();
    }
    return pyodideLoadingPromise;
  },

  async run(code: string, onStdout: (msg: string) => void, onStderr: (msg: string) => void) {
    const runtime = await this.init(onStdout, onStderr);
    try {
      const result = await runtime.runPythonAsync(code);
      if (result !== undefined) onStdout(String(result));
    } catch (error) {
      onStderr(error instanceof Error ? error.message : String(error));
    }
  }
};
