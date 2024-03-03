export const API_BASE_URL = "/api"

const PING = "ping"
const SIGNUP = "signup"
const LOGIN = "login"
const AUTH = "auth"
const CREATE = "create"
const UPDATE = "update"
const DELETE = "delete"
const QUESTIONS = "questions"
const QUESTION_ID = "questionId"

export const API_PING = `${API_BASE_URL}/${PING}`
export const API_SINGUP = `${API_BASE_URL}/${SIGNUP}`
export const API_LOGIN = `${API_BASE_URL}/${LOGIN}`
export const API_AUTH = `${API_BASE_URL}/${AUTH}`
export const API_CREATE_QUESTION = `${API_BASE_URL}/${QUESTIONS}/${CREATE}`
export const API_GET_QUESTIONS = `${API_BASE_URL}/${QUESTIONS}`
export const API_GET_QUESTION = `${API_BASE_URL}/${QUESTIONS}/:${QUESTION_ID}`
export const API_GET_QUESTION_UPDATE = `${API_BASE_URL}/${QUESTIONS}/${UPDATE}`
export const API_GET_QUESTION_DELETE = `${API_BASE_URL}/${QUESTIONS}/${DELETE}`
