import { Family } from "@prisma/client";
import Modal from "./Modal";

const ViewInvitationsModal = ({
	isOpen,
	onClose,
	invitations,
	onAccept,
	onDecline,
	fetchInvitations,
}: {
	isOpen: boolean;
	onClose: () => void;
	invitations: Family[];
	onAccept: any;
	onDecline: any;
	fetchInvitations: any;
}) => {
	// useEffect(() => {
	// 	fetchInvitations();
	// });
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Family Invitations</h2>
			{invitations.length == 0 ? <h1> No invitatiations yet...</h1> : null}
			<ul>
				{invitations.map((invitation) => (
					<li key={invitation.id} className="mb-4">
						<p>You have been invited to join the family "{invitation.name}"</p>
						<div className="flex justify-end mt-4">
							<button
								className="bg-green-500 text-white px-4 py-2 rounded mr-2"
								onClick={() => onAccept(invitation.id)}
							>
								Accept
							</button>
							<button
								className="bg-red-500 text-white px-4 py-2 rounded"
								onClick={() => onDecline(invitation.id)}
							>
								Decline
							</button>
						</div>
					</li>
				))}
			</ul>
		</Modal>
	);
};

export default ViewInvitationsModal;
