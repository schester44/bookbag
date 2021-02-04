import React from 'react'
import clsx from 'classnames'
import { AiOutlineLoading } from 'react-icons/ai'

const classNames = {
	default: {
		base:
			'inline-flex justify-center rounded border border-gray-300 bg-white leading-6 font-medium text-gray-600 shadow-sm transition ease-in-out duration-150 sm:leading-5',
		enabled: 'hover:text-gray-700 focus:border-blue-300',
	},
	primary: {
		base:
			'inline-flex justify-center rounded border border-brand-500 bg-brand-500 leading-6 font-medium text-gray-100 shadow-sm transition ease-in-out duration-150 sm:leading-5',
		enabled: 'hover:text-white hover:bg-brand-600 hover:border-brand-700 focus:border-brand-900',
	},
	secondary: {
		base:
			'inline-flex justify-center rounded border border-gray-500 bg-gray-500 leading-6 font-medium text-gray-100 shadow-sm transition ease-in-out duration-150 sm:leading-5',
		enabled: 'hover:text-white hover:bg-gray-600 hover:border-gray-600 focus:border-brand-900',
	},
}

const SIZE = {
	xs: 'px-1 py-1 text-xs',
	sm: 'px-2 py-1 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-6 py-4 text-lg',
}

// TODO: Handle disabled states
const Button = (
	{
		children,
		type = 'default',
		className,
		isLoading = false,
		isDisabled = false,
		isSubmit = false,
		size = 'md',
		onClick,
		...props
	},
	// Need to define this since we're using React.forwardRef. Using forwardRef to get around an rc-trigger error
	ref
) => {
	const handleClick = (event) => {
		if (isLoading || isDisabled) return

		if (onClick) {
			onClick(event)
		}
	}

	const sizeStyles = SIZE[size] || SIZE.default

	return (
		<button
			{...props}
			type={isSubmit ? 'submit' : 'button'}
			onClick={handleClick}
			className={clsx(classNames[type]?.base || classNames.default.base, sizeStyles, {
				[className]: !!className,
				'focus:shadow-outline': !isDisabled,
				[classNames[type]?.enabled || classNames.default.enabled]: !isDisabled,
				'cursor-not-allowed opacity-50 outline-none focus:outline-none': isDisabled || isLoading,
			})}
		>
			{isLoading ? <AiOutlineLoading className="button-loader text-lg" /> : children}
		</button>
	)
}

export default React.forwardRef(Button)

export const PrimaryButton = React.forwardRef((props, ref) => (
	<Button type="primary" {...props} ref={ref} />
))

export const SecondaryButton = (props) => <Button type="secondary" {...props} />

export const ButtonGroup = ({ children }) => {
	const getChildren = () => {
		if (children.length <= 1) return children

		return React.Children.map(children, (child, index) => {
			if (child.type.name !== 'Button') {
				return React.cloneElement(child, {
					ref: undefined,
				})
			}

			const childProps = {
				...child.props,
				className: `${child.props.className || ''} ${
					index === 0
						? 'rounded-r-none rounded-l border-r-0'
						: index === children.length - 1
						? children.length === 2
							? 'rounded-l-none rounded-r'
							: 'rounded-l-none rounded-r border-l-0'
						: 'rounded-l-none rounded-r-none'
				} `,
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
