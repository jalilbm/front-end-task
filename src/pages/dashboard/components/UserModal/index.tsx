import { useEffect, useRef } from "react";
import Button from "../../../../components/Button";
import "./index.scss";

interface ModalDialogProps {
	isOpen: boolean;
	title: string;
	description?: string;
	onClose: () => void;
	onSave: () => void;
	children?: React.ReactNode;
}

const UserModalDialog: React.FC<ModalDialogProps> = ({
	isOpen,
	title,
	description,
	onClose,
	onSave,
	children,
}) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;

		const handleOutsideClick = (event: Event) => {
			if (event.target === dialog) {
				onClose();
			}
		};

		if (dialog) {
			dialog.addEventListener("click", handleOutsideClick);

			if (isOpen) {
				dialog.showModal();
			} else {
				dialog.close();
			}
		}

		return () => {
			if (dialog) {
				dialog.removeEventListener("click", handleOutsideClick);
			}
		};
	}, [isOpen, onClose]);

	return (
		<dialog ref={dialogRef}>
			<div className="user-modal-content">
				<h2>{title}</h2>
				{description && <p>{description}</p>}
				{children}
				<div className="modal-buttons flex justify-center">
					<Button
						onClick={onSave}
						label={title === "Delete User" ? "Yes" : "Save"}
					/>
				</div>
				<button onClick={onClose} aria-label="close" className="x">
					❌
				</button>
			</div>
		</dialog>
	);
};

export default UserModalDialog;
