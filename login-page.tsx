import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { BsPersonVcard } from 'react-icons/bs'
import { MdOutlineVisibility } from 'react-icons/md'
import { MdOutlineVisibilityOff } from 'react-icons/md'

import { useAuth } from 'hooks/useAuth'
import VivetLogo from 'assets/VivetLogo'
import Button from 'components/common/Button'
import FormInput from 'components/form/FormInput'
import useLocalStorage from 'hooks/useLocalStorage'
import { useLoginForm, Form, FormData } from 'forms/useLoginForm'

export default function Login() {
	const navigate = useNavigate()
	const formMethods = useLoginForm()
	const { signIn, error, loading } = useAuth()
	const [username] = useLocalStorage('username')

	const [showPassword, setShowPassword] = useState(false)

	async function login(data: FormData) {
		signIn(data).then(() => {
			navigate('/')
		})
	}

	function toggleShowPassword() {
		setShowPassword(!showPassword)
	}

	return (
		<div className='flex flex-1 items-center pb-20'>
			<div className='flex-1'></div>

			<div className='w-80'>
				<h1 className='mb-8'>Login</h1>

				<Form formMethods={formMethods} onSubmit={login}>
					<FormInput
						name='username'
						label='Username'
						helperText='&nbsp;'
						autoFocus={!username}
						icon={<BsPersonVcard />}
					/>

					<FormInput
						name='password'
						label='Password'
						helperText='&nbsp;'
						autoFocus={!!username}
						type={showPassword ? 'text' : 'password'}
						icon={
							showPassword ? (
								<MdOutlineVisibilityOff className='cursor-pointer' onClick={toggleShowPassword} />
							) : (
								<MdOutlineVisibility className='cursor-pointer' onClick={toggleShowPassword} />
							)
						}
					/>

					<div className='mb-1.5 text-center font-semibold text-red-600'>
						{(error?.response.status === 400 || error?.response.status === 401) &&
							'Incorrect username or password'}{' '}
						&nbsp;
					</div>

					<Button fullWidth type='submit' loading={loading}>
						Log In
					</Button>
				</Form>

				<Link to='/reset-password' className='mt-6 block text-center'>
					Reset your password?
				</Link>
			</div>

			<div className='flex-[2]'></div>

			<div className='mb-16 flex-[4]'>
				<div className='w-[400px] [&_.dash-line]:animate-[logoDash_6s_linear_infinite] [&_.logo-title]:fill-slate-800 dark:[&_.logo-title]:fill-slate-100'>
					<VivetLogo />
				</div>
			</div>
		</div>
	)
}
