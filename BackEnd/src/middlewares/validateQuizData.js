
const Joi = require("joi");

const optionSchema = Joi.object({
  text: Joi.string().required(),
});

const questionSchema = Joi.object({
  questionText: Joi.string().required(),
  options: Joi.array().items(optionSchema).min(2).required(),
  correctAnswerIndex: Joi.number().min(0).required(),
});

const quizSchema = Joi.object({
  title: Joi.string().required(),
  subject: Joi.string().required(),
  difficulty: Joi.string().valid("Easy", "Medium", "Hard").required(),
  timeLimit: Joi.number().required(),
  privacy: Joi.string().valid("public", "private").required(),
  password: Joi.string().optional(),
  questions: Joi.array().items(questionSchema).min(1).required(),
  questionCount: Joi.number().required(),
});

module.exports = function validateQuizData(req, res, next) {
  const { error } = quizSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(d => d.message) });
  }
  next();
};

