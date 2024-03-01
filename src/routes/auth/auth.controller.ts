import type { Response, Request } from "express"
import { LoginRejectBody, LoginRequestBody } from "./types"
import { ADMIN, ResponseCode } from "../../constants/codes"
import { prisma } from "../../index"
import { Prisma } from "@prisma/client"
import * as bcrypt from "bcrypt"

export async function signup(req: Request<unknown, unknown, Prisma.UserCreateInput>, res: Response) {
	const signupRequestDto = req.body
	try {
		const passwordHash = await bcrypt.hash(signupRequestDto.password, 10)
		signupRequestDto.password = passwordHash

		const newUser = await this.userService.create(signupRequestDto)

		const { idToken } = await this.createAccessToken(newUser.id)

		res.cookie(process.env.COOKIE_NAME, idToken, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			path: "/",
		})

		res.json(newUser)
	} catch (error) {
		throw new Error(`Create user failed cause: ${error}`)
	}
}

export const loginRejectBody: LoginRejectBody = {
	timestamp: new Date(),
	error: "Unauthorized",
	message: "Incorrect password for the ADMIN",
	code: ResponseCode.UNAUTHORIZED,
}

export function login(req: Request<unknown, void, LoginRequestBody>, res: Response) {
	const { username, password } = req.body

	if (!username || !password) {
		res.clearCookie("ADMIN-AUTH")
		res.clearCookie("CANDIDATE-AUTH")
		res.status(ResponseCode.BAD_REQUEST).json(`Need to send ${username ? "password" : "username"}`)
	}

	if (username === ADMIN && password !== ADMIN) {
		res.clearCookie("ADMIN-AUTH")
		res.clearCookie("CANDIDATE-AUTH")

		res.status(ResponseCode.UNAUTHORIZED).json(loginRejectBody)
	}

	if (username === ADMIN && password === ADMIN) {
		res.cookie("ADMIN-AUTH", username, { httpOnly: true })
		res.clearCookie("CANDIDATE-AUTH")
		res.sendStatus(ResponseCode.NO_CONTENT)
	}

	if (username !== ADMIN && password !== ADMIN) {
		res.cookie("CANDIDATE-AUTH", username, { httpOnly: true })
		res.clearCookie("ADMIN-AUTH")
		res.sendStatus(ResponseCode.NO_CONTENT)
	}
}

export function logout(_req: Request, res: Response) {
	res.clearCookie("ADMIN-AUTH")
	res.clearCookie("CANDIDATE-AUTH")

	res.sendStatus(ResponseCode.NO_CONTENT)
}

// app.post(`/signup`, async (req, res) => {
// 	const { name, email, posts } = req.body

// 	const postData = posts?.map((post: Prisma.PostCreateInput) => {
// 	  return { title: post?.title, content: post?.content }
// 	})

// 	const result = await prisma.user.create({
// 	  data: {
// 		name,
// 		email,
// 		posts: {
// 		  create: postData,
// 		},
// 	  },
// 	})
// 	res.json(result)
//   })

//   app.post(`/post`, async (req, res) => {
// 	const { title, content, authorEmail } = req.body
// 	const result = await prisma.post.create({
// 	  data: {
// 		title,
// 		content,
// 		author: { connect: { email: authorEmail } },
// 	  },
// 	})
// 	res.json(result)
//   })

//   app.put('/post/:id/views', async (req, res) => {
// 	const { id } = req.params

// 	try {
// 	  const post = await prisma.post.update({
// 		where: { id: Number(id) },
// 		data: {
// 		  viewCount: {
// 			increment: 1,
// 		  },
// 		},
// 	  })

// 	  res.json(post)
// 	} catch (error) {
// 	  res.json({ error: `Post with ID ${id} does not exist in the database` })
// 	}
//   })

//   app.put('/publish/:id', async (req, res) => {
// 	const { id } = req.params

// 	try {
// 	  const postData = await prisma.post.findUnique({
// 		where: { id: Number(id) },
// 		select: {
// 		  published: true,
// 		},
// 	  })

// 	  const updatedPost = await prisma.post.update({
// 		where: { id: Number(id) || undefined },
// 		data: { published: !postData?.published },
// 	  })
// 	  res.json(updatedPost)
// 	} catch (error) {
// 	  res.json({ error: `Post with ID ${id} does not exist in the database` })
// 	}
//   })

//   app.delete(`/post/:id`, async (req, res) => {
// 	const { id } = req.params
// 	const post = await prisma.post.delete({
// 	  where: {
// 		id: Number(id),
// 	  },
// 	})
// 	res.json(post)
//   })

//   app.get('/users', async (req, res) => {
// 	const users = await prisma.user.findMany()
// 	res.json(users)
//   })

//   app.get('/user/:id/drafts', async (req, res) => {
// 	const { id } = req.params

// 	const drafts = await prisma.user
// 	  .findUnique({
// 		where: {
// 		  id: Number(id),
// 		},
// 	  })
// 	  .posts({
// 		where: { published: false },
// 	  })

// 	res.json(drafts)
//   })

//   app.get(`/post/:id`, async (req, res) => {
// 	const { id }: { id?: string } = req.params

// 	const post = await prisma.post.findUnique({
// 	  where: { id: Number(id) },
// 	})
// 	res.json(post)
//   })

//   app.get('/feed', async (req, res) => {
// 	const { searchString, skip, take, orderBy } = req.query

// 	const or: Prisma.PostWhereInput = searchString
// 	  ? {
// 		  OR: [
// 			{ title: { contains: searchString as string } },
// 			{ content: { contains: searchString as string } },
// 		  ],
// 		}
// 	  : {}

// 	const posts = await prisma.post.findMany({
// 	  where: {
// 		published: true,
// 		...or,
// 	  },
// 	  include: { author: true },
// 	  take: Number(take) || undefined,
// 	  skip: Number(skip) || undefined,
// 	  orderBy: {
// 		updatedAt: orderBy as Prisma.SortOrder,
// 	  },
// 	})

// 	res.json(posts)
//   })
