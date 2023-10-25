import { FC, useContext } from "react";
import { ThemeContext } from "../../contexts/theme";
import "./index.scss";

interface ThemedButtonProps {
	onClick: () => void;
	label?: string;
	type?: "button" | "submit" | "reset";
}

const Button: FC<ThemedButtonProps> = ({ onClick, label, type }) => {
	const context = useContext(ThemeContext);
	const theme = context?.theme;
	const bgColorVar =
		theme === "light"
			? "--primary-component-bg-light"
			: "--primary-component-bg-dark";
	const textColorVar =
		theme === "light"
			? "--primary-component-text-light"
			: "--primary-component-text-dark";
	const borderColorVar =
		theme === "light"
			? "--primary-border-color-light"
			: "--primary-border-color-dark";

	return (
		<button
			type={type}
			onClick={onClick}
			style={
				{
					"--button-bg": `var(${bgColorVar})`,
					"--button-text": `var(${textColorVar})`,
					"--button-hover-border": `var(${borderColorVar})`,
				} as React.CSSProperties
			}
			className="primary-button rounded-full"
		>
			{label}
		</button>
	);
};

export default Button;
