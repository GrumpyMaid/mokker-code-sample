import { useState, useEffect, useContext, createContext } from 'react'

import { LoginResponse, User } from './types'
import useLocalStorage from '../useLocalStorage'
import { useQuery } from '@tanstack/react-query'
import fetchClient, { ApiError } from 'lib/fetchClient'

const authContext = createContext({})

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = useProvideAuth()
	return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => useContext(authContext) as ReturnType<typeof useProvideAuth>

function useProvideAuth() {
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const [error, setError] = useState<ApiError | null>(null)
	const [token, setToken] = useLocalStorage('jwt', null)
	const [, setUsername] = useLocalStorage('username', null)

	const tokenCheck = useQuery({
		enabled: !!token,
		queryKey: ['token'],
		staleTime: 1000 * 60 * 60,
		queryFn: () => fetchClient('/auth/tokencheck'),
	})

	useEffect(() => {
		if (!tokenCheck.isInitialLoading && tokenCheck.isError) {
			setToken(undefined)
		}
	}, [tokenCheck.isInitialLoading, tokenCheck.isError])

	useEffect(() => {
		const handleTokenUpdated = (event: any) => {
			setToken(event.detail.token)
		}

		window.addEventListener('token-changed', event => handleTokenUpdated(event))
		return () => window.removeEventListener('token-changed', handleTokenUpdated)
	}, [setToken])

	const signIn = async ({ username, password }: { username: string; password: string }) => {
		try {
			setLoading(true)

			const response: LoginResponse = await fetchClient('/auth/login', {
				method: 'POST',
				body: { username, password },
			})

			setError(null)
			setUsername(username)
			setToken(response.accessToken)
			setUser({ userFirstName: response.userFirstName, userLastName: response.userLastName })
		} catch (apierror: any) {
			setError(apierror)
		} finally {
			setLoading(false)
		}
	}

	const signOut = () => {
		setToken(null)
	}

	return {
		user,
		error,
		token,
		signIn,
		signOut,
		tokenCheck,
		loading: loading || tokenCheck.isFetching,
	}
}
