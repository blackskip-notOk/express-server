import { ResponseCode } from "../../constants/codes"

export interface LoginRequestBody {
	/** user name or surname */
	username: string
	/** if user is admin - custom password, if user is a candidate - birth date */
	password: string
}

export interface LoginRejectBody {
	timestamp: Date
	error: string
	message: string
	code: (typeof ResponseCode)[keyof typeof ResponseCode]
}
