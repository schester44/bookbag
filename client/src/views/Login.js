import React from 'react'
import { PrimaryButton } from '../components/Button'

import { useMutation } from '@apollo/client'
import { loginMutation } from '../mutations'
import { userQuery } from 'queries'

const Login = () => {
	const [login] = useMutation(loginMutation)

	const [state, setState] = React.useState({
		isSubmitting: false,
		values: {
			username: '',
			password: '',
		},
	})

	const handleLogin = async () => {
		await login({
			variables: state.values,
			refetchQueries: [{ query: userQuery }],
		})

		localStorage.setItem('logged-in', true)
	}

	const setValues = (key, value) => {
		setState((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }))
	}

	const handleInput = ({ target: { name, value } }) => setValues(name, value)
	return (
		<div className="flex items-center justify-center w-full h-full bg-gray-300">
			<div className="bg-white shadow-lg rounded p-8 w-full" style={{ maxWidth: 500 }}>
				<div className="py-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playerName">
						Username
					</label>

					<input
						name="username"
						type="text"
						onChange={handleInput}
						value={state.values.username}
						placeholder="Username"
						className="appearance-none rounded-none relative rounded block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
					/>
				</div>

				<div className="py-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playerName">
						Password
					</label>

					<input
						name="password"
						type="password"
						onChange={handleInput}
						value={state.values.password}
						placeholder="Password"
						className="appearance-none rounded-none relative rounded block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
					/>
				</div>

				<PrimaryButton
					isLoading={state.isSubmitting}
					isDisabled={state.values.username.length === 0 || state.values.password.length < 2}
					className="block mt-4 w-full"
					onClick={handleLogin}
				>
					Login
				</PrimaryButton>
			</div>
		</div>
	)
}

export default Login
