import Modal from "@/components/family/modals/Modal";
import { Pet } from "@prisma/client";

const RemovePetModal = ({
	isOpen,
	onClose,
	onConfirm,
	pet,
	currentUId,
	adminUId,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	pet: Pet;
	currentUId: string;
	adminUId: string;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Remove Pet</h2>

			<p>Are you sure you want to remove {pet.name} from the family?</p>
			<div className="flex justify-end mt-4">
				<button
					className="bg-red-500 text-white px-4 py-2 rounded mr-2"
					onClick={() => {
						onConfirm();
						onClose();
					}}
				>
					Remove
				</button>
				<button
					className="bg-gray-500 text-white px-4 py-2 rounded"
					onClick={onClose}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
};

export default RemovePetModal;
