import {
	useState,
	ChangeEvent,
	useContext,
	FC,
	Dispatch,
	SetStateAction,
} from "react";
import "./index.scss";
import { ThemeContext } from "../../contexts/theme";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { login } from "../../services/ApiCalls";
import ModalDialog from "../../components/MessageModal";

type Page = "dashboard";

interface LoginPageProps {
	navigateTo: (page: Page) => void;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const LoginPage: FC<LoginPageProps> = ({ navigateTo, setIsLoggedIn }) => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState<string>("");
	const [modalDescription, setModalDescription] = useState<string>("");

	const context = useContext(ThemeContext);
	const theme = context?.theme;

	const loginPageStyle = {
		backgroundColor: `var(--primary-bg-${theme})`,
		color: `var(--primary-text-${theme})`,
		height: "100%",
		padding: "0 1rem 0 1rem",
		minHeight: "100vh",
	};

	const loginContainerStyle = {
		backgroundColor: `var(--primary-component-bg-${theme})`,
	};

	const loginFormStyle = {
		backgroundColor: `var(--secondary-bg-${theme})`,
	};

	const welcomeMessageStyle = {
		backgroundColor: `var(--primary-component-bg-${theme})`,
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const validatePassword = (password: string): boolean => {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
		return regex.test(password);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (validatePassword(password)) {
				setIsValid(true);
				// Close the modal if it's open
				setIsModalOpen(false);
				const loggedIn = await login(email, password);
				if (loggedIn) {
					setIsLoggedIn(true);
					navigateTo("dashboard");
				}
			} else {
				setIsValid(false);
				setModalTitle("Invalid password");
				setModalDescription(
					"Password must have at least 8 characters, 1 uppercase, 1 lowercase, and 1 special character."
				);
				setIsModalOpen(true);
			}
		} catch (error) {
			setModalTitle("Login Error");
			setModalDescription("Invalid email or password");
			setIsModalOpen(true);
		}
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	return (
		<div
			className="login flex justify-center items-center"
			style={loginPageStyle}
		>
			<div
				className="login-container shadowed rounded-lg"
				style={loginContainerStyle}
			>
				<div
					className="welcome-container rounded-lg"
					style={welcomeMessageStyle}
				>
					<p className="welcome-message">Welcome</p>
					<p className="welcome-message">Back</p>
					<p className="sign-in-p">Please log-in to continue!</p>
				</div>

				<div className="form-container rounded-lg" style={loginFormStyle}>
					<h1>Login</h1>
					<form onSubmit={handleSubmit}>
						<div className="input-group">
							<Input
								type="email"
								id="email"
								value={email}
								onChange={handleEmailChange}
								placeholder="Email"
								required
							/>
						</div>
						<div className="input-group">
							<Input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								required
							/>
						</div>
						{!isValid && (
							<p className="error-message">
								Password must have at least 8 characters, 1 uppercase, 1
								lowercase, and 1 special character.
							</p>
						)}
						<div className="w-full flex justify-center">
							<Button onClick={() => {}} label="Login" type="submit" />
						</div>
					</form>
				</div>
			</div>
			<ModalDialog
				isOpen={isModalOpen}
				title={modalTitle}
				description={modalDescription}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default LoginPage;
