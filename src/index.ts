import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser"
import express from "express"
import type { Express } from "express"
import { authRouter, pingRouter, questionsRouter } from "./routes"

export const prisma = new PrismaClient()

const PORT = 3003

const app: Express = express()

app.use(bodyParser.json())

app.use(pingRouter)
app.use(authRouter)
app.use(questionsRouter)

app.listen(PORT, () => {
	console.info(`⚡️ Server is running at https://localhost:${PORT}`)
})
