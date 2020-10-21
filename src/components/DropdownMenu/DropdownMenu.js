import React from 'react'

export const DropdownMenu = ({ style, children, onClick }) => {
	return (
		<div className="mt-2 w-48 rounded-md shadow-lg z-10" style={style}>
			<div className="rounded-md bg-white shadow-xs">
				{React.Children.map(children, (child) => {
					return React.cloneElement(child, {
						onClick: (...args) => {
							if (typeof child.props.onClick === 'function') {
								child.props.onClick(...args)
							}

							if (typeof onClick === 'function') {
								onClick(child.props)
							}
						},
					})
				})}
			</div>
		</div>
	)
}
