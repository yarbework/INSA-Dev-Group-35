
// IMPORTANT: i am gessing this limit numbers so if you can and know please modify them but untile the (:


import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
    windowMs: 5*60*1000, // 5 minutes, it counts in miliseconds, this the window in which the login atempts are limited in
    limit: 5, // the amount of limit per mindow
    statusCode: 429,
    message: {message: "Too many login attempts, please try again later"}
})

export const signUpLimiter = rateLimit({
    windowMs: 5*60*1000,
    limit: 10,
    statusCode: 429,
    message: {message: "Too many signUp attempts, please try again later"}
    
})