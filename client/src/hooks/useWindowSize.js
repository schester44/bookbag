import React from 'react'

export const useWindowSize = () => {
	const [state, setState] = React.useState({ width: window.innerWidth, height: window.innerHeight })

	React.useEffect(() => {
		function listener() {
			setState({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener('resize', listener)

		return () => {
			window.removeEventListener('resize', listener)
		}
	}, [])

	return state
}
