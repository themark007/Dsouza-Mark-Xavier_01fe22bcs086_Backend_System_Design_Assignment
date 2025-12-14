import fs from "fs";
import { runPythonModel } from "../services/python.service.js";

export const healthCheck = (req, res) => {
  res.json({ status: "OK", service: "Clinical NLP API" });
};

export const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = await runPythonModel({ text });
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Text analysis failed" });
  }
};

export const analyzePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const result = await runPythonModel({
      pdfPath: req.file.path
    });

    fs.unlinkSync(req.file.path); // cleanup
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF analysis failed" });
  }
};
