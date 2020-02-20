import { useEffect, useRef, useCallback } from 'react'

function useOutsideClick(ref, handler, when = true) {
	const savedHandler = useRef(handler)

	const memoizedCallback = useCallback(e => {
		if (ref && ref.current && !ref.current.contains(e.target)) {
			savedHandler.current(e)
		}
	}, [])

	useEffect(() => {
		savedHandler.current = handler
	})

	useEffect(() => {
		if (when) {
			document.addEventListener('contextmenu', memoizedCallback)
			document.addEventListener('click', memoizedCallback)
			document.addEventListener('ontouchstart', memoizedCallback)
			return () => {
				document.removeEventListener('contextmenu', memoizedCallback)
				document.removeEventListener('click', memoizedCallback)
				document.removeEventListener('ontouchstart', memoizedCallback)
			}
		}
	}, [ref, handler, when])
}

export { useOutsideClick }
