import { Prisma } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import * as bcrypt from "bcrypt"
import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../../index"
import { LoginRequestBody } from "./types"

export interface SignupRequest {
	firstName?: string
	lastName?: string
	login?: string
	password?: string
	isAdmin: boolean
}

export const jwtConstants = {
	secret: process.env.JWT_SECRET,
	accessToken: process.env.ACCESS_TOKEN_SECRET,
}

export async function signup(req: Request<unknown, unknown, Prisma.UserCreateInput>, res: Response) {
	const signupRequestDto = req.body
	try {
		const { isAdmin } = signupRequestDto

		if (isAdmin) {
			const hashedPassword = await bcrypt.hash(signupRequestDto.password, 10)

			const newUser = await prisma.user.create({
				data: {
					login: signupRequestDto.login,
					password: hashedPassword,
					isAdmin,
				},
			})

			res.status(201).json({ isAdmin, login: newUser.login, id: newUser.id, createdAt: newUser.createdAt })
		} else {
			const newUser = await prisma.user.create({
				data: signupRequestDto,
			})

			res.status(201).json({
				isAdmin,
				id: newUser.id,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				createdAt: newUser.createdAt,
			})
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			res.status(409).json({
				message: `User with login: ${
					signupRequestDto.isAdmin ? signupRequestDto.login : signupRequestDto.firstName
				} already exist`,
				error,
			})
		}

		res.status(400).json({ message: "Error creating user", error })
	}
}

export async function login(req: Request<unknown, void, LoginRequestBody>, res: Response) {
	const { login, password } = req.body

	if (!login || !password) {
		res.status(400).json(`Need to send ${login ? "password" : "username"}`)
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				login,
			},
		})

		bcrypt
			.compare(password, user.password)
			.then((passwordCheck) => {
				if (!passwordCheck) {
					return res.status(400).send({
						message: "Passwords does not match",
					})
				}

				const { secret } = jwtConstants

				const token = jwt.sign(
					{
						userId: user.id,
						userLogin: user.login,
					},
					secret,
					{ expiresIn: "24h" }
				)

				res.status(200).json({
					message: "Login Successful",
					login,
					token,
				})
			})
			.catch((error) => {
				res.status(400).send({
					message: "Passwords does not match",
					error,
				})
			})
	} catch (error) {
		res.status(404).json({ message: `Can't find user with login: ${login}`, error })
	}
}
