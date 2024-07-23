import React from "react";

const Modal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: any;
	onClose: any;
	children: React.ReactNode;
}) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
				<div className="bg-base-100 p-6 rounded-lg shadow-lg relative ">
					<button
						className="absolute top-2 right-2 text-xl font-bold"
						onClick={onClose}
					>
						&times;
					</button>
					{children}
				</div>
			</div>
		)
	);
};

export default Modal;
