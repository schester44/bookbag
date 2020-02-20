import React from 'react'
import { useOutsideClick } from './useOutsideClick'

const ContextMenu = ({ children, menu }) => {
	const [state, setState] = React.useState({ visible: false, x: 0, y: 0 })
	const ref = React.useRef()

	useOutsideClick(
		ref,
		() => {
			setState({ visible: false, x: 0, y: 0 })
		},
		state.visible
	)

	const handleRightClick = e => {
		e.preventDefault()
		setState({ visible: true, x: e.clientX, y: e.clientY })
	}

	const handleClose = () => {
		setState({ visible: false, x: 0, y: 0 })
	}

	return (
		<>
			{state.visible && (
				<div
					ref={ref}
					className="z-50"
					style={{ position: 'absolute', top: state.y, left: state.x }}
				>
					{React.cloneElement(menu, { handleClose })}
				</div>
			)}

			{React.cloneElement(children, { onContextMenu: handleRightClick })}
		</>
	)
}

export default ContextMenu

export const Menu = ({ children, handleClose }) => {
	const handleMenuItemClick = (child, e) => {
		handleClose()

		if (child.props.onClick) {
			child.props.onClick(e)
		}
	}

	return (
		<div
			className="shadow overflow-hidden bg-white rounded z-50 shadow-lg"
			style={{ minWidth: 150 }}
		>
			{React.Children.map(children, child =>
				React.cloneElement(child, {
					onClick: e => handleMenuItemClick(child, e)
				})
			)}
		</div>
	)
}

export const MenuItem = ({ children, icon, ...rest }) => {
	return (
		<div
			{...rest}
			className="px-3 py-2 text-sm text-gray-700 flex items-center hover:text:gray-900 hover:bg-gray-100 cursor-pointer"
		>
			{icon && icon}
			<span className={icon ? `ml-2` : ''}>{children}</span>
		</div>
	)
}
