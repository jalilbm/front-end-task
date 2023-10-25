import { useState, useEffect, useRef } from "react";
import "./index.scss";
import { fetchWithAuth } from "../../../../services/ApiCalls";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import UserModalDialog from "../UserModal";
import menu from "../../../../assets/menu.png";

interface UsersTableProps {
	isEditor: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({ isEditor }) => {
	const [users, setUsers] = useState<any[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState<string>("firstName");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [searchKeyword, setSearchKeyword] = useState<string>("");
	const userIdsRef = useRef(new Set<number>());
	const [isModalOpen, setModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"add" | "delete" | "edit">("add");
	const [modalImage, setModalImage] = useState<File | null>(null);
	const [modalFirstName, setModalFirstName] = useState<string>("");
	const [modalLastName, setModalLastName] = useState<string>("");
	const [modalEmail, setModalEmail] = useState<string>("");
	const [modalFormErrors, setModalFormErrors] = useState<{
		[key: string]: string;
	}>({});
	const [openMenuUserId, setOpenMenuUserId] = useState<number | null>(null);
	const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
	const [userToEdit, setUserToEdit] = useState<any | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpenMenuUserId(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const itemsPerPage = 6;
		const calculatedPages = Math.ceil(users.length / itemsPerPage);
		setTotalPages((prevTotalPages) =>
			Math.max(calculatedPages, prevTotalPages)
		);
	}, [users]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchWithAuth(
					`/users?page=${currentPage}`,
					"GET",
					null
				);

				setTotalPages(Number(data.total_pages));

				// Filter out duplicate users based on the ref
				const newUsers = data.data.filter(
					(user: any) => !userIdsRef.current.has(user.id)
				);

				// Update the ref
				newUsers.forEach((user: any) => userIdsRef.current.add(user.id));

				// Update the state
				setUsers((prevUsers) => [...prevUsers, ...newUsers]);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [currentPage]);

	useEffect(() => {
		if (sortField) {
			const sortedUsers = [...users].sort((a, b) => {
				if (a[sortField] < b[sortField])
					return sortDirection === "asc" ? -1 : 1;
				if (a[sortField] > b[sortField])
					return sortDirection === "asc" ? 1 : -1;
				return 0;
			});
			setUsers(sortedUsers);
		}
	}, [sortField, sortDirection]);

	const handleSort = (field: string) => {
		setSortDirection(
			sortField === field && sortDirection === "asc" ? "desc" : "asc"
		);
		setSortField(field);
	};
	const renderSortArrow = (field: string) => {
		if (sortField === field) {
			return sortDirection === "asc" ? "↓" : "↑";
		}
		return null;
	};

	const handleAddUser = () => {
		setModalType("add");
		setModalOpen(true);
	};
	const handleEditUser = (userId: number) => {
		const user = users.find((u) => u.id === userId);
		setUserToEdit(user);
		setModalType("edit");
		setModalOpen(true);
		setOpenMenuUserId(null); // Close the menu

		// Initialize modal states
		if (user) {
			setModalFirstName(user.first_name);
			setModalLastName(user.last_name);
			setModalEmail(user.email);
			setModalImage(user.avatar);
		}
	};
	const handleDeleteUser = (userId: number) => {
		setModalType("delete");
		setModalOpen(true);
		setUserIdToDelete(userId); // Set the userId to delete
		setOpenMenuUserId(null); // Close the menu
	};

	const handleModalSave = async () => {
		let errors: { [key: string]: string } = {};
		// Clear the modal fields and userToEdit
		if (modalType === "add") {
			if (!modalImage) errors["modalImage"] = "Image is required";
			if (!modalFirstName) errors["modalFirstName"] = "First name is required";
			if (!modalLastName) errors["modalLastName"] = "Last name is required";
			if (!modalEmail) errors["modalEmail"] = "Email is required";

			if (Object.keys(errors).length > 0) {
				setModalFormErrors(errors);
				return;
			}

			// Find the last user's id and increment it by 1 for the new user
			const lastUserId = users.length > 0 ? users[users.length - 1].id : 0;
			const newUserId = lastUserId + 1;

			// Create a new user object
			const newUser = {
				id: newUserId,
				avatar: modalImage ? URL.createObjectURL(modalImage) : "",
				first_name: modalFirstName,
				last_name: modalLastName,
				email: modalEmail,
			};

			// Add the new user to the users array
			setUsers((prevUsers) => [newUser, ...prevUsers]);

			// Clear the modal fields
			setModalImage(null);
			setModalFirstName("");
			setModalLastName("");
			setModalEmail("");

			// API call to add user
			await fetchWithAuth(`/users`, "POST", newUser);
		} else if (modalType === "delete") {
			try {
				// API call to delete user
				await fetchWithAuth(`/users/${userIdToDelete}`, "DELETE", null);

				// Remove the deleted user from the state
				setUsers((prevUsers) =>
					prevUsers.filter((user) => user.id !== userIdToDelete)
				);
			} catch (error) {
				console.error("Error deleting user:", error);
			}
			setUserIdToDelete(null); // Reset the userIdToDelete
		} else if (modalType === "edit" && userToEdit) {
			// Update the user in the state
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === userToEdit.id
						? {
								...userToEdit,
								first_name: modalFirstName,
								last_name: modalLastName,
								email: modalEmail,
								avatar: modalImage
									? URL.createObjectURL(modalImage)
									: userToEdit.avatar,
						  }
						: user
				)
			);

			// API call to update user
			const updatedUser = {
				first_name: modalFirstName,
				last_name: modalLastName,
				email: modalEmail,
				avatar: modalImage,
			};
			await fetchWithAuth(`/users/${userToEdit.id}`, "PUT", updatedUser);
		}

		// Clear the modal fields and userToEdit
		setModalImage(null);
		setModalFirstName("");
		setModalLastName("");
		setModalEmail("");
		setUserToEdit(null);

		setModalFormErrors({});
		setModalOpen(false);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearError("modalImage");
		const file = e.target.files?.[0];
		if (file) {
			setModalImage(file);
		}
	};

	const clearError = (field: string) => {
		if (modalFormErrors[field]) {
			setModalFormErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const filteredUsers = users.filter((user) => {
		return user.first_name.toLowerCase().includes(searchKeyword.toLowerCase());
	});

	// Sort the users based on the sortField and sortDirection
	const sortedUsers = [...filteredUsers].sort((a, b) => {
		if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
		if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
		return 0;
	});

	// Get the 6 users for the current page
	const usersToDisplay = sortedUsers.slice(
		(currentPage - 1) * 6,
		currentPage * 6
	);

	return (
		<div className="table-container">
			<div className="table-users">
				<div className="header flex justify-between items-center">
					<span>Users</span>
					<div className="search-container">
						<span className="search-icon">🔍</span> {/* Unicode search icon */}
						<Input
							type="text"
							id="search-keyword"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
							placeholder="First name..."
						/>
					</div>
				</div>
				<table cellSpacing="0">
					<tr>
						<th>Picture</th>
						<th onClick={() => handleSort("first_name")}>
							First Name {renderSortArrow("first_name")}
						</th>
						<th onClick={() => handleSort("last_name")}>
							Last Name {renderSortArrow("last_name")}
						</th>
						<th onClick={() => handleSort("email")}>
							Email {renderSortArrow("email")}
						</th>
					</tr>
					{/* if there is a sorting field, we show first 6 on the sorted list. Else, 
            we show the list from 0 to 6 then from 7 to 12 in second page then...etc. */}
					{usersToDisplay.map((user, index) => (
						<tr key={index}>
							<td>
								<div
									className={`flex items-center position-relative ${
										!isEditor ? "justify-center" : ""
									}`}
								>
									{isEditor && (
										<img
											src={menu}
											style={{
												height: "30px",
												objectFit: "contain",
												cursor: "pointer",
											}}
											onClick={() => setOpenMenuUserId(user.id)}
										/>
									)}
									{openMenuUserId === user.id && (
										<div className="dropdown-menu" ref={menuRef}>
											<div className="dropdown-arrow"></div>
											<div
												className="dropdown-item"
												onClick={() => handleEditUser(user.id)}
											>
												Edit
											</div>
											<div
												className="dropdown-item"
												onClick={() => handleDeleteUser(user.id)}
											>
												Delete
											</div>
										</div>
									)}
									<img src={user.avatar} alt="" />
								</div>
							</td>
							<td>{user.first_name}</td>
							<td>{user.last_name}</td>
							<td>{user.email}</td>
						</tr>
					))}
				</table>
				<div className="pagination">
					{Array.from({ length: totalPages }, (_, page) => (
						<button
							key={page}
							className={`page-button ${
								currentPage === page + 1 ? "selected" : ""
							}`}
							onClick={() => setCurrentPage(page + 1)}
						>
							{page + 1}
						</button>
					))}
				</div>
			</div>
			{isEditor && (
				<div className="flex justify-center">
					<Button onClick={handleAddUser} label="Add User" />
				</div>
			)}
			<UserModalDialog
				isOpen={isModalOpen}
				title={
					modalType === "add"
						? "Add User"
						: modalType === "edit"
						? "Edit User"
						: "Delete User"
				}
				onClose={() => setModalOpen(false)}
				onSave={handleModalSave}
			>
				{(modalType === "add" || modalType === "edit") && (
					<form>
						<div>
							<label htmlFor="image" className="label">
								Image <span className="label-required">*</span>
							</label>
							<div className="input-container">
								<input
									required
									className="drop-container w-full"
									type="file"
									name="image"
									id="image"
									accept="image/*"
									onChange={handleImageChange}
								/>
								{modalFormErrors["modalImage"] && (
									<span className="error-text">
										{modalFormErrors["modalImage"]}
									</span>
								)}
							</div>

							<label htmlFor="new-user-first-name" className="label">
								First Name <span className="label-required">*</span>
							</label>
							<div className="input-container">
								<Input
									required
									type="text"
									id="user-first-name"
									value={
										modalFirstName || (userToEdit ? userToEdit.first_name : "")
									}
									onChange={(e) => {
										setModalFirstName(e.target.value);
									}}
									placeholder="First name"
								/>
								{modalFormErrors["modalFirstName"] && (
									<span className="error-text">
										{modalFormErrors["modalFirstName"]}
									</span>
								)}
							</div>

							<label htmlFor="new-user-last-name" className="label">
								Last Name <span className="label-required">*</span>
							</label>
							<div className="input-container">
								<Input
									required
									type="text"
									id="new-user-last-name"
									value={
										modalLastName || (userToEdit ? userToEdit.last_name : "")
									}
									onChange={(e) => {
										clearError("modalLastName");
										setModalLastName(e.target.value);
									}}
									placeholder="Last name"
								/>
								{modalFormErrors["modalLastName"] && (
									<span className="error-text">
										{modalFormErrors["modalLastName"]}
									</span>
								)}
							</div>

							<label htmlFor="new-user-email" className="label">
								Email <span className="label-required">*</span>
							</label>
							<div className="input-container">
								<Input
									required
									type="email"
									id="new-user-email"
									value={modalEmail || (userToEdit ? userToEdit.email : "")}
									onChange={(e) => {
										clearError("modalEmailName");
										setModalEmail(e.target.value);
									}}
									placeholder="Email"
								/>
								{modalFormErrors["modalEmail"] && (
									<span className="error-text">
										{modalFormErrors["modalEmail"]}
									</span>
								)}
							</div>
						</div>
					</form>
				)}
				{modalType === "delete" && (
					<p>Are you sure you want to delete this user?</p>
				)}
			</UserModalDialog>
		</div>
	);
};

export default UsersTable;
