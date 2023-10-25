import { useState, useContext, FC, Dispatch, SetStateAction } from "react";
import "./index.scss";
import { ThemeContext } from "../../contexts/theme";
import ModeToggleButton from "./components/ModeToggleButton";
import UsersTable from "./components/UsersTable";

import Button from "../../components/Button";
import { logout } from "../../services/ApiCalls";
type Page = "login";
interface DashboardPageProps {
	navigateTo: (page: Page) => void;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const DashboardPage: FC<DashboardPageProps> = ({
	navigateTo,
	setIsLoggedIn,
}) => {
	const context = useContext(ThemeContext);
	const [isEditor, setIsEditor] = useState(false);
	const theme = context?.theme;

	const PageStyle = {
		backgroundColor: `var(--primary-bg-${theme})`,
		color: `var(--primary-text-${theme})`,
		height: "100%",
	};

	const headerStyle = {
		backgroundColor: `var(--secondary-bg-${theme})`,
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		logout();
	};

	return (
		<div style={PageStyle} className="dashboard">
			<header className="shadowed" style={headerStyle}>
				<div className="container flex justify-between">
					<ModeToggleButton isEditor={isEditor} setIsEditor={setIsEditor} />
					<div>
						<Button onClick={handleLogout} label="Logout &nbsp;>" />
					</div>
				</div>
			</header>
			<div>
				<UsersTable isEditor={isEditor} />
			</div>
		</div>
	);
};

export default DashboardPage;
