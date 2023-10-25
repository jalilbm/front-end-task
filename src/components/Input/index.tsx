import React, { FC, ChangeEvent, useContext } from "react";
import "./index.scss";
import { ThemeContext } from "../../contexts/theme";
interface InputProps {
	placeholder?: string;
	type?: string;
	name?: string;
	id?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
}

const Input: FC<InputProps> = ({
	placeholder,
	type,
	name,
	id,
	value,
	onChange,
	required,
}) => {
	const context = useContext(ThemeContext);
	const theme = context?.theme;

	const focusColorVar =
		theme === "light"
			? "--primary-border-color-light"
			: "--primary-border-color-dark";

	return (
		<input
			className="custom-input"
			placeholder={placeholder}
			type={type || "text"}
			name={name}
			id={id}
			value={value}
			onChange={onChange}
			required={required}
			style={
				{
					"--input-focus": `var(${focusColorVar})`,
				} as React.CSSProperties
			}
		/>
	);
};

export default Input;
