const model = require("../geminiClient");


  exports.askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gemini API request failed" });
  }
}

model.exp