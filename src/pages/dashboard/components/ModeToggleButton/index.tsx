import "./index.scss";
import Button from "../../../../components/Button";

interface ModeToggleButtonProps {
	isEditor: boolean;
	setIsEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModeToggleButton: React.FC<ModeToggleButtonProps> = ({
	isEditor,
	setIsEditor,
}) => {
	const toggleMode = () => {
		setIsEditor(!isEditor);
	};

	return (
		<Button onClick={toggleMode} label={isEditor ? "👷‍♂️ Editor" : "🧑 Viewer"} />
	);
};

export default ModeToggleButton;
