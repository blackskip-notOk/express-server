import { Router } from "express"
import { API_QUESTIONS } from "../../constants/api"
import { getQuestions } from "./questions.controller"

export const questionsRouter = Router()

questionsRouter.get(API_QUESTIONS, getQuestions)
