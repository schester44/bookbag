import React from 'react'
import clsx from 'classnames'

const Noop = props => <div {...props} />

export const MenuItem = ({ as: Component = Noop, clickable = true, className, ...props }) => {
	return (
		<Component
			{...props}
			className={clsx('block px-4 py-2 text-sm text-gray-700', {
				'cursor-pointer hover:bg-gray-100': !!clickable,
				[className]: !!className
			})}
		/>
	)
}
