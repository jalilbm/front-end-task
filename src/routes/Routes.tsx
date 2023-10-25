import { useState, useEffect } from "react";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";

type Page = "login" | "dashboard";

const Routes: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<Page>("login");
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const checkSessionStorage = (event?: StorageEvent) => {
		// If event is defined, check if it's related to sessionStorage
		if (event && event.storageArea !== sessionStorage) {
			return;
		}

		const token = sessionStorage.getItem("authToken");
		if (token) {
			setIsLoggedIn(true);
			setCurrentPage("dashboard");
		} else {
			setIsLoggedIn(false);
			setCurrentPage("login");
		}
	};

	useEffect(() => {
		// Initial check
		checkSessionStorage();

		// Listen for changes from other windows/tabs
		window.addEventListener("storage", checkSessionStorage);

		return () => {
			// Cleanup
			window.removeEventListener("storage", checkSessionStorage);
		};
	}, [isLoggedIn]);

	const navigateTo = (page: Page) => {
		if (page === "dashboard" && !isLoggedIn) {
			setCurrentPage("login");
		} else {
			setCurrentPage(page);
		}
	};

	return (
		<div style={{ height: "100%" }}>
			{currentPage === "login" && (
				<LoginPage navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} />
			)}
			{currentPage === "dashboard" && isLoggedIn && (
				<DashboardPage navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} />
			)}
		</div>
	);
};

export default Routes;
