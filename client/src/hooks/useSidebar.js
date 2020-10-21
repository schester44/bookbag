import React from 'react'

const Context = React.createContext({ depth: 2 })

export function useSidebar() {
	const [{ depth }, setState] = React.useContext(Context)

	const setDepth = (depth) => {
		setState((prev) => ({
			...prev,
			depth: typeof depth === 'function' ? depth(prev.depth) : prev.depth,
		}))
	}

	return { depth, setDepth }
}

export function SidebarProvider({ children }) {
	const state = React.useState({ depth: 2 })

	return <Context.Provider value={state}>{children}</Context.Provider>
}
