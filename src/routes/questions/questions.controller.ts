import { Prisma, Question } from "@prisma/client"
import type { Request, Response } from "express"
import { RequestError } from "../../commonTypes"
import { prisma } from "../../index"

interface QuestionsResponse {
	questions: Omit<Question, "createdAt" | "updatedAt">[]
	page: number
	totalCount: number
}

export async function createQuestion(req: Request, res: Response<Question | RequestError>) {
	const createQuestionRequestDto = req.body

	const answersData = createQuestionRequestDto.answers?.map((answer: Prisma.AnswerCreateInput) => answer)

	try {
		const question = await prisma.question.create({
			include: {
				answers: true,
			},
			data: {
				title: createQuestionRequestDto.title,
				type: createQuestionRequestDto.type,
				correctAnswers: createQuestionRequestDto.correctAnswers,
				answers: {
					createMany: {
						data: answersData,
						skipDuplicates: true,
					},
				},
			},
		})

		res.status(201).json(question)
	} catch (error) {
		res.status(400).json({ message: "Can't create questions", error })
	}
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

export async function getQuestion(req: Request<{ questionId: string }>, res: Response<Question | RequestError>) {
	const { questionId } = req.params

	try {
		const question = await prisma.question.findUnique({
			where: {
				id: questionId,
			},
			include: {
				answers: true,
			},
		})

		res.json(question)
	} catch (error) {
		res.status(400).json({ message: "Can't find question", error })
	}
}

export async function updateQuestion(req: Request, res: Response<Question | RequestError>) {
	const updateQuestionRequestDto = req.body

	try {
		const question = await prisma.question.update({
			where: {
				id: updateQuestionRequestDto.id,
			},
			data: {
				title: updateQuestionRequestDto.title,
				// TODO implement answers and correctAnswers update
				// type: updateQuestionRequestDto.type,
				// correctAnswers: updateQuestionRequestDto.correctAnswers,
				// answers: updateQuestionRequestDto.answers,
			},
			include: {
				answers: true,
			},
		})

		res.json(question)
	} catch (error) {
		res.status(400).json({ message: "Can't update question", error })
	}
}

export async function deleteQuestion(req: Request, res: Response) {
	const deleteQuestionRequestDto = req.body

	try {
		const deleteAnswers = prisma.answer.deleteMany({
			where: {
				questionId: deleteQuestionRequestDto.id,
			},
		})

		const deleteQuestion = prisma.question.delete({
			where: {
				id: deleteQuestionRequestDto.id,
			},
		})

		const transaction = await prisma.$transaction([deleteAnswers, deleteQuestion])

		res.status(204).json(transaction)
	} catch (error) {
		res.status(400).json({ message: "Can't delete question", error })
	}
}
