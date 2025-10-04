const axios = require("axios").default;
const { CookieJar } = require("tough-cookie");

const BASE_URL = "http://localhost:3001";

const TEST_USER = {
    email: "john@examplee.com",
    password: "Password123!"
};

async function testRoutes() {
    try {
        // ✅ Import ESM module dynamically
        const { wrapper } = await import("axios-cookiejar-support");

        // Create axios instance with cookie jar
        const jar = new CookieJar();
        const axiosInstance = wrapper(axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
            jar,
            validateStatus: () => true,
        }));

        console.log("🚀 Starting route tests...\n");

        const checkResponse = (route, res) => {
            console.log(`🔹 ${route}`);
            console.log("Status:", res.status);
            if (res.status !== 200 && res.status !== 201) {
                console.error("❌ Error:", res.data);
            } else {
                console.log("✅ Success:", res.data);
            }
        };

        // 1. Login
        let loginRes = await axiosInstance.post("/api/auth/login", TEST_USER);
        checkResponse("POST /api/auth/login", loginRes);

        if (loginRes.status !== 200) {
            console.error("Login failed. Stopping tests.");
            return;
        }

        // Now cookies are stored and sent automatically
        let res = await axiosInstance.get("/api/quizzes");
        checkResponse("GET /api/quizzes", res);

        const newQuiz = {
            "title": "Basic Math Quiz",
            "subject": "Math",
            "author": "644d9b8e2a6f1a6b5c8d1234",
            "difficulty": "Easy",
            "timeLimit": 10,
            "privacy": "public",
            "questions": [
                {
                    "questionText": "What is 2+2?",
                    "options": [
                        { "text": "3" },
                        { "text": "4" },
                        { "text": "5" }
                    ],
                    "correctAnswerIndex": 1
                },
                {
                    "questionText": "What is 5-3?",
                    "options": [
                        { "text": "1" },
                        { "text": "2" },
                        { "text": "3" }
                    ],
                    "correctAnswerIndex": 1
                }
            ],
            "questionCount": 2
        }

        res = await axiosInstance.post("/api/quizzes", newQuiz);
        checkResponse("POST /api/quizzes", res);

        const quizId = res.data?._id;
        if (!quizId) {
            console.error("Quiz creation failed. Stopping tests.");
            return;
        }

        res = await axiosInstance.get(`/api/quizzes/${quizId}`);
        checkResponse("GET /api/quizzes/:id", res);

        res = await axiosInstance.post(`/api/quizzes/${quizId}/submit`, { answers: [1] });
        checkResponse("POST /api/quizzes/:id/submit", res);

        res = await axiosInstance.post(`/api/quizzes/${quizId}/ai-assessment`, { answers: [1] });
        checkResponse("POST /api/quizzes/:id/ai-assessment", res);

        res = await axiosInstance.put(`/api/quizzes/${quizId}`, {
            "title": "Basic Math Quiz",
                "subject": "Math",
                "author": "644d9b8e2a6f1a6b5c8d1234",
                "difficulty": "Easy",
                "timeLimit": 10,
                "privacy": "public",
                "questions": [
                {
                    "questionText": "What is 2+2?",
                    "options": [
                        { "text": "3" },
                        { "text": "4" },
                        { "text": "5" }
                    ],
                    "correctAnswerIndex": 1
                },
                {
                    "questionText": "What is 5-3?",
                    "options": [
                        { "text": "1" },
                        { "text": "2" },
                        { "text": "3" }
                    ],
                    "correctAnswerIndex": 1
                }
            ],
                "questionCount": 2
        });
        checkResponse("PUT /api/quizzes/:id", res);

        res = await axiosInstance.get("/api/quizzes/myQuizzes");
        checkResponse("GET /api/quizzes/myQuizzes", res);

        res = await axiosInstance.delete(`/api/quizzes/${quizId}`);
        checkResponse("DELETE /api/quizzes/:id", res);

        res = await axiosInstance.post("/api/auth/logout");
        checkResponse("POST /api/auth/logout", res);

        console.log("\n✅ All route tests completed.");
    } catch (err) {
        console.error("❌ Fatal error:", err.message);
    }
}

testRoutes();
