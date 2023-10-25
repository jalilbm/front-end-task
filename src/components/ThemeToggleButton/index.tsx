import { useTheme } from "../../contexts/theme";
import "./index.scss";

const ThemeToggleButton: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div
			className={`btn-container ${
				theme === "dark" ? "dark-preview" : "white-preview"
			}`}
		>
			<label className="switch btn-color-mode-switch">
				<input
					type="checkbox"
					name="color_mode"
					id="color_mode"
					value="1"
					checked={theme === "dark"}
					onChange={() => toggleTheme()}
				/>
				<label
					htmlFor="color_mode"
					data-on="Dark"
					data-off="Light"
					className="btn-color-mode-switch-inner"
				></label>
			</label>
		</div>
	);
};

export default ThemeToggleButton;
