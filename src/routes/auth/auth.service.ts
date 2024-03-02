import jwt from "jsonwebtoken"

export const jwtConstants = {
	secret: process.env.JWT_SECRET,
	accessToken: process.env.ACCESS_TOKEN_SECRET,
}

// export async function createAccessToken(id: string) {
// 	const { accessToken, secret } = jwtConstants;
// 	const idToken = await this.jwtService.signAsync(
// 		{ userId: id, secret },
// 		{ expiresIn: "7d", algorithm: "HS256" }
// 	)

// 	const newAccess= await this.jwtService.signAsync(
// 		{
// 			userId: id,
// 			accessToken: jwt.,
// 		},
// 		{ expiresIn: "60s", algorithm: "HS256" }
// 	)

// 	return { idToken, accessToken }
// }
