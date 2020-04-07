import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button'

const Settings = ({ user }) => {
	const [state, setState] = React.useState({
		isLoaded: false,
		settings: {},
	})

	const handleSettingChange = (key, value) => {
		setState((prev) => ({
			...prev,
			settings: { ...prev.settings, [key]: value },
		}))
	}

	return (
		<div className="bg-gray-100 overflow-auto h-full flex-1 px-2 pt-8 pb-24 text-gray-900">
			<div className=" container mx-auto">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl font-bold leading-none">Settings</h1>

					{!user && (
						<div className="flex items-center">
							<Link to="/auth/register" className="ml-2 text-indigo-500 underline">
								Register
							</Link>
							<Link to="/auth/login" className="ml-2 text-indigo-500">
								<Button>Login</Button>
							</Link>
						</div>
					)}
					{user && (
						<p>
							Logged in as <strong>{user.username}</strong>
						</p>
					)}
				</div>

				<div className="bg-white px-8 py-8 rounded shadow">
					<div className="flex justify-between">
						<div>
							<p className="text-xl text-bold">Cloud Sync</p>
							<p className="text-gray-600">Enable Cloud Sync to access your notes from anywhere!</p>
						</div>

						<div className="relative">
							<select
								value={state.settings.syncMode}
								onChange={(e) => {
									handleSettingChange('syncMode', e.target.value)
								}}
								className="block appearance-none bg-white border-2 border-gray-200 text-gray-700 py-3 px-8 pr-12 rounded focus:outline-none focus:bg-white focus:border-gray-500"
							>
								<option value="local">Disabled</option>
								<option value="cloud">Enabled</option>
							</select>

							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
								<svg
									className="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Settings
