import React from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import Button from 'components/Button'

const Settings = () => {
	const [settings, setSettings] = React.useState(() => ({}))

	function setLocalStorageValue(key, value) {
		localStorage.setItem(key, value)

		setSettings((prev) => ({ ...prev, [key]: value }))
	}

	return (
		<div className="container mx-auto py-4">
			<Button
				size="sm"
				className="flex items-center"
				onClick={() => {
					window.location.href = '/'
				}}
			>
				<FiChevronLeft className="mr-1 text-lg" /> Back
			</Button>

			<h1 className="font-bold text-xl">Settings</h1>

			<div className="mt-4">
				<div className="rounded bg-gray-100 border p-4">
					<div className="text-sm font-medium mb-1">Setting Thing</div>
					<input className="rounded bg-white px-2 py-1 border w-full max-w-sm" type="text" />
				</div>
			</div>
		</div>
	)
}

export default Settings
