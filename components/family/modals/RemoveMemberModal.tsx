import Modal from "./Modal";

const RemoveMemberModal = ({
	isOpen,
	onClose,
	onConfirm,
	memberName,
	memberUId,
	currentUId,
	adminUId,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	memberName: string;
	memberUId: string;
	currentUId: string;
	adminUId: string;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">
				{currentUId != memberUId ? `Remove Member` : "Leave Family"}
			</h2>
			{currentUId == adminUId ? (
				<h1>
					You must change the admin to another member or delete the family
				</h1>
			) : (
				<>
					<p>
						{currentUId != memberUId
							? `Are you sure you want to remove ${memberName} from the family?`
							: "Are you sure you want to leave the family?"}
					</p>
					<div className="flex justify-end mt-4">
						<button
							className="bg-red-500 text-white px-4 py-2 rounded mr-2"
							onClick={onConfirm}
						>
							{currentUId != memberUId ? `Remove` : "Leave"}
						</button>
						<button
							className="bg-gray-500 text-white px-4 py-2 rounded"
							onClick={onClose}
						>
							Cancel
						</button>
					</div>
				</>
			)}
		</Modal>
	);
};

export default RemoveMemberModal;
