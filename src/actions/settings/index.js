import api from '../../api'

export const fetchSettings = () => {
	return api.settings.get()
}

export const saveSettings = settings => {
	return api.settings.save(settings)
}
