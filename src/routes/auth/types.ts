export interface LoginRequestBody {
	login: string
	password: string
}

export interface LoginRejectBody {
	timestamp: Date
	error: string
	message: string
	code: number
}
