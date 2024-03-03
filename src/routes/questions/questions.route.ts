import { Router } from "express"
import {
	API_CREATE_QUESTION,
	API_GET_QUESTION,
	API_GET_QUESTIONS,
	API_GET_QUESTION_DELETE,
	API_GET_QUESTION_UPDATE,
} from "../../constants/api"
import { createQuestion, deleteQuestion, getQuestion, getQuestions, updateQuestion } from "./questions.controller"

export const questionsRouter = Router()

questionsRouter.post(API_CREATE_QUESTION, createQuestion)
questionsRouter.get(API_GET_QUESTIONS, getQuestions)
questionsRouter.get(API_GET_QUESTION, getQuestion)
questionsRouter.put(API_GET_QUESTION_UPDATE, updateQuestion)
questionsRouter.delete(API_GET_QUESTION_DELETE, deleteQuestion)
