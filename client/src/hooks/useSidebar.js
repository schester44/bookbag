import React from 'react'

const Context = React.createContext([{ depth: 2 }, () => {}])

export function useSidebar() {
	const [state, setState] = React.useContext(Context)

	const setDepth = React.useCallback(
		(value) => {
			setState((prev) => {
				let depth = typeof value === 'function' ? value(prev.depth) : value

				if (depth > 2) depth = 2
				if (depth < 0) depth = 0

				localStorage.setItem('depth', depth)

				return {
					...prev,
					depth,
				}
			})
		},
		[setState]
	)

	return { depth: state.depth, setDepth }
}

export function SidebarProvider({ children }) {
	const state = React.useState(() => {
		const depth = parseInt(localStorage.getItem('depth'))

		return {
			depth: !isNaN(depth) ? depth : 2,
		}
	})

	return <Context.Provider value={state}>{children}</Context.Provider>
}
