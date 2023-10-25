import "./App.css";
import Routes from "./routes/Routes";
import { ThemeProvider } from "./contexts/theme";
import ThemeToggleButton from "./components/ThemeToggleButton";

function App() {
	return (
		<ThemeProvider>
			<div className="App">
				<Routes />
				<div className="toggle-button-container">
					<ThemeToggleButton />
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
