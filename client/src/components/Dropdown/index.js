import React from 'react'
import Trigger from 'rc-trigger'
import placements from './placements'

const Dropdown = ({
	children,
	content,
	onVisibleChange,
	closeOnClick = true,
	trigger = ['click'],
	placement = 'bottomLeft',
	align,
}) => {
	const [triggerVisible, setTriggerVisible] = React.useState(false)

	const onClick = (e) => {
		const overlayProps = content.props

		if (overlayProps.onClick) {
			overlayProps.onClick(e)
		}

		if (closeOnClick) {
			setTriggerVisible(false)
		}
	}

	const getMenuElement = () => {
		const overlayElement = content

		const extraOverlayProps = {
			onClick,
		}

		return React.cloneElement(overlayElement, extraOverlayProps)
	}

	const handleVisibleChange = (visible) => {
		setTriggerVisible(visible)

		if (typeof onVisibleChange === 'function') {
			onVisibleChange(visible)
		}
	}

	return (
		<Trigger
			action={trigger}
			popup={getMenuElement()}
			onPopupVisibleChange={handleVisibleChange}
			popupVisible={triggerVisible}
			popupAlign={align || placements[placement]}
		>
			{children}
		</Trigger>
	)
}

export default Dropdown
