import { spawn } from "child_process";

export const runPythonModel = (payload) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["python/clinical_processor.py"]);

    let output = "";
    let error = "";

    python.stdin.write(JSON.stringify(payload));
    python.stdin.end();

    python.stdout.on("data", data => {
      output += data.toString();
    });

    python.stderr.on("data", data => {
      error += data.toString();
    });

    python.on("close", code => {
      if (code !== 0 || error) {
        console.error("Python error:", error);
        return reject(error);
      }
      resolve(JSON.parse(output));
    });
  });
};
