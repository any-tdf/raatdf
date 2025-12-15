interface LogoProps {
	size?: number;
	color?: string;
}

/**
 * 系统 Logo SVG 组件
 * @param size - Logo 尺寸，默认 24
 * @param color - Logo 颜色，默认使用主题色
 */
export function Logo({ size = 24, color = 'var(--ant-color-primary)' }: LogoProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
			<title>Logo</title>
			<path
				d="M30 80H10V60H30V80ZM78.7393 30C79.5619 33.1962 80 36.547 80 40C80 62.0914 62.0914 80 40 80V60C51.0457 60 60 51.0457 60 40C60 36.3571 59.0259 32.9417 57.3242 30H78.7393ZM40 30C45.5228 30 50 34.4772 50 40C50 45.5228 45.5228 50 40 50H33.333L20 30L10 45V30H40ZM40 0C54.8054 0 67.7312 8.04427 74.6475 20H33.333L20 0L6.66699 20H0V0H40Z"
				fill={color}
			/>
			<mask id="logo-mask-1" fill="white">
				<path d="M40 30H0L20 0L40 30Z" />
			</mask>
			<path
				d="M40 30V31H41.8685L40.8321 29.4453L40 30ZM0 30L-0.83205 29.4453L-1.86852 31H0V30ZM20 0L20.8321 -0.5547L20 -1.80278L19.1679 -0.5547L20 0ZM40 30V29H0V30V31H40V30ZM0 30L0.83205 30.5547L20.8321 0.5547L20 0L19.1679 -0.5547L-0.83205 29.4453L0 30ZM20 0L19.1679 0.5547L39.1679 30.5547L40 30L40.8321 29.4453L20.8321 -0.5547L20 0Z"
				fill={color}
				mask="url(#logo-mask-1)"
			/>
			<mask id="logo-mask-2" fill="white">
				<path d="M40 60H0L20 30L40 60Z" />
			</mask>
			<path
				d="M40 60V61H41.8685L40.8321 59.4453L40 60ZM0 60L-0.83205 59.4453L-1.86852 61H0V60ZM20 30L20.8321 29.4453L20 28.1972L19.1679 29.4453L20 30ZM40 60V59H0V60V61H40V60ZM0 60L0.83205 60.5547L20.8321 30.5547L20 30L19.1679 29.4453L-0.83205 59.4453L0 60ZM20 30L19.1679 30.5547L39.1679 60.5547L40 60L40.8321 59.4453L20.8321 29.4453L20 30Z"
				fill={color}
				mask="url(#logo-mask-2)"
			/>
		</svg>
	);
}
