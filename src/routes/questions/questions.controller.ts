import { Question } from "@prisma/client"
import type { Request, Response } from "express"
import { prisma } from "src"
import { RequestError } from "src/commonTypes"

interface QuestionsResponse {
	questions: Omit<Question, "createdAt" | "updatedAt">[]
	page: number
	totalCount: number
}

export async function getQuestions(
	req: Request<unknown, unknown, unknown, { page: number; size: number }>,
	res: Response<QuestionsResponse | RequestError>
) {
	const { page, size } = req.query

	try {
		const take = size || 20
		const skip = page > 1 ? page * size : 0

		const results = await prisma.question.findMany({
			take,
			skip,
			select: {
				id: true,
				title: true,
				type: true,
				answers: true,
				correctAnswers: true,
			},
			orderBy: {
				updatedAt: "asc",
			},
		})

		const totalCount = await prisma.question.count()

		res.json({
			questions: results,
			totalCount,
			page,
		})
	} catch (error) {
		res.status(400).json({ message: "Can't find questions", error })
	}
}
