import { useEffect, useRef } from "react";
import "./index.scss";

interface ModalDialogProps {
	isOpen: boolean;
	title: string;
	description: string;
	onClose: () => void;
}

const ModalDialog: React.FC<ModalDialogProps> = ({
	isOpen,
	title,
	description,
	onClose,
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
			<div className="modal-content">
				<h2>{title}</h2>
				<p>{description}</p>
				<button onClick={onClose} aria-label="close" className="x">
					❌
				</button>
			</div>
		</dialog>
	);
};

export default ModalDialog;
