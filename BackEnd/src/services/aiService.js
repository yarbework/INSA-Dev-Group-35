const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    generationConfig: {
        responseMimeType: "application/json"
} });



exports.askGemini = async (req, res) => {
    try {
        const { prompt } = req.body;

    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
        }   
    catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ error: "Gemini API request failed" });
    }
}



