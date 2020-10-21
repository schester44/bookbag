import React from 'react'
import clsx from 'classnames'
import { AiOutlineLoading } from 'react-icons/ai'

const classNames = {
	default:
		'inline-flex justify-center rounded border border-gray-300 px-4 py-3 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5',
	primary:
		'inline-flex justify-center rounded border border-indigo-500 px-4 py-3 bg-indigo-500 text-base leading-6 font-medium text-gray-100 shadow-sm hover:text-white hover:bg-indigo-600 hover:border-indigo-700 focus:outline-none focus:border-indigo-900 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5',
	secondary:
		'inline-flex justify-center rounded border border-gray-800 px-4 py-3 bg-gray-800 text-base leading-6 font-medium text-gray-100 shadow-sm hover:text-white hover:bg-gray-700 hover:border-gray-700 focus:outline-none focus:border-indigo-900 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5'
}

// TODO: Handle disabled states
const Button = ({
	children,
	type = 'default',
	className,
	isLoading = false,
	isDisabled = false,
	...props
}) => {
	return (
		<button
			type="button"
			{...props}
			className={clsx(classNames[type] || classNames.default, {
				[className]: !!className,
				'cursor-not-allowed': isDisabled || isLoading
			})}
		>
			{isLoading ? <AiOutlineLoading className="button-loader text-lg" /> : children}
		</button>
	)
}

export default Button

export const PrimaryButton = props => <Button type="primary" {...props} />
export const SecondaryButton = props => <Button type="secondary" {...props} />

export const ButtonGroup = ({ children }) => {
	const getChildren = () => {
		if (children.length <= 1) return children

		return React.Children.map(children, (child, index) => {
			if (child.type.name !== 'Button') {
				return React.cloneElement(child, {
					ref: undefined
				})
			}

			const childProps = {
				...child.props,
				className: `${child.props.className || ''} ${
					index === 0
						? 'rounded-r-none rounded-l-md border-r-0'
						: index === children.length - 1
						? children.length === 2
							? 'rounded-l-none rounded-r-md'
							: 'rounded-l-none rounded-r border-l-0'
						: 'rounded-l-none rounded-r-none'
				} `
			}

			return React.cloneElement(child, childProps)
		})
	}

	return (
		<div className="flex justify-center rounded cursor-not-allowed" role="group">
			{getChildren()}
		</div>
	)
}
