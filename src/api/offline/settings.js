import localforage from 'localforage'

const defaultSettings = {
	syncMode: 'local'
}

export default {
	save: async settings => {
		if (settings.syncMode === 'cloud') {
			// TOOD: Sync with cloud
		}

		return localforage.setItem('settings', settings)
	},
	get: async () => {
		const settings = await localforage.getItem('settings')

		// TODO: if settings.syncMode == 'cloud', fetch cloud settings
		return settings || defaultSettings
	}
}
