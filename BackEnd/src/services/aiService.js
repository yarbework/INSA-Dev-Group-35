const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function askGemini(payload) {
    try {
        const { instruction, questions, user_answers } = payload;
        
        let prompt = `${instruction}\n\nQuestions and Answers:\n`;
        
        let correctCount = 0;
        let totalCount = questions.length;
        
        questions.forEach((q, index) => {
            const questionText = q.questionText || q.text;
            const correctIndex = q.correctAnswerIndex;
            const userAnswer = user_answers[index];
            
            prompt += `\nQuestion ${index + 1}: ${questionText}`;
            prompt += `\nCorrect answer: ${correctIndex}`;
            prompt += `\nYour answer: ${userAnswer}`;
            
            // Check if answer is correct
            if (correctIndex === userAnswer) {
                prompt += " ✓";
                correctCount++;
            } else {
                prompt += " ✗";
            }
            
            prompt += `\n---`;
        });
        
        prompt += `\n\nOverall performance: ${correctCount}/${totalCount} correct`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return text;
    } catch (error) {
        console.error('AI service error:', error);
        throw new Error('AI assessment failed');
    }
}

module.exports = { askGemini };