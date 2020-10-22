import React from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import Button from 'components/Button'
import { useQuery, useMutation } from '@apollo/client'
import { bookbagQuery } from 'queries'
import { updateNoteMutation } from 'mutations'
import { encrypt } from 'utils/encryption'

const Settings = () => {
	const [settings, setSettings] = React.useState(() => ({
		encryptionKey: localStorage.getItem('encryptionKey') || '',
	}))

	const { loading, data } = useQuery(bookbagQuery)

	const updateNotesTimer = React.useRef()
	const [updateNote] = useMutation(updateNoteMutation)

	function setLocalStorageValue(key, value) {
		localStorage.setItem(key, value)

		setSettings((prev) => ({ ...prev, [key]: value }))

		if (key === 'encryptionKey') {
			window.clearTimeout(updateNotesTimer.current)

			updateNotesTimer.current = window.setTimeout(() => {
				data.notes.forEach((note) => {
					const input = {
						title: encrypt(JSON.stringify({ value: note.title }), value),
						body: encrypt(JSON.stringify(note.body), value),
						snippet: encrypt(JSON.stringify({ value: note.snippet }), value),
					}

					updateNote({
						variables: {
							id: note.id,
							input,
						},
					})
				})
				// foreach note, update decrypt with the current SECRET and encrypt with the new secret
			}, 250)
		}
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
					<div className="text-sm font-medium mb-1">Encryption Key</div>
					<input
						className="rounded bg-white px-2 py-1 border w-full max-w-sm"
						type="text"
						value={settings.encryptionKey}
						onChange={(e) => {
							const value = e.target.value

							setLocalStorageValue('encryptionKey', value)
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default Settings
