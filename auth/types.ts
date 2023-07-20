export interface LoginResponse {
	userId: string
	tokenType: string
	businessId: string
	accessToken: string
	userLastName: string
	userFirstName: string
	expiresInSeconds: number
}

export interface User {
	userLastName: string
	userFirstName: string
}
