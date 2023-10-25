type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
const BACKEND_BASE_URL = "https://reqres.in/api";

export const fetchOptions = (
	method: HttpMethod,
	data: any = null,
	token: string | null = null
): RequestInit => {
	const options: RequestInit = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	if (token) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	return options;
};

export const login = async (email: string, password: string) => {
	const response = await fetch(
		`${BACKEND_BASE_URL}/login`,
		fetchOptions("POST", { email, password })
	);
	const data = await response.json();

	if (response.ok) {
		// Store the token in sessionStorage
		sessionStorage.setItem("authToken", data.token);
		return true;
	} else {
		throw new Error(data.error);
	}
};

export const logout = () => {
	// Remove the token from sessionStorage
	sessionStorage.removeItem("authToken");
};

export const fetchWithAuth = async (
	url: string,
	method: HttpMethod,
	data: any,
	token: string | null = null
): Promise<any> => {
	const authToken = token || sessionStorage.getItem("authToken");
	const fullUrl = `${BACKEND_BASE_URL}${url}`;
	const response = await fetch(fullUrl, fetchOptions(method, data, authToken));

	if (response.status === 204) {
		return null; // No content to parse
	}

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		if (response.status === 401) {
			sessionStorage.removeItem("authToken");
		}
		throw new Error(result.error);
	}
};
