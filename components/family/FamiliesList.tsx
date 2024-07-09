"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
	createNewFamily,
	deleteFamily,
	retrieveFamilyMembers,
	retrieveUserFamilies,
	updateFamilyName, // Import the new function for updating family name
} from "@/app/api/family/actions";
import { Family, User } from "@prisma/client";

// Modal Component
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
				<div className="bg-base-100 p-6 rounded-lg shadow-lg relative w-96">
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

const EditFamilyModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyName,
	setFamilyName,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyName: string;
	setFamilyName: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Edit Family</h2>
			<input
				type="text"
				value={familyName}
				onChange={(e) => setFamilyName(e.target.value)}
				className="border p-2 mb-4 w-full"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={onConfirm}
			>
				Save
			</button>
		</Modal>
	);
};

const CreateFamilyModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyName,
	setFamilyName,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyName: string;
	setFamilyName: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Create New Family</h2>
			<input
				type="text"
				value={familyName}
				onChange={(e) => setFamilyName(e.target.value)}
				className="border p-2 mb-4 w-full"
				placeholder="Family Name"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={onConfirm}
			>
				Create
			</button>
		</Modal>
	);
};

const AddMemberModal = ({
	isOpen,
	onClose,
	onConfirm,
	memberEmail,
	setMemberEmail,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	memberEmail: string;
	setMemberEmail: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Add New Member</h2>
			<input
				type="email"
				value={memberEmail}
				onChange={(e) => setMemberEmail(e.target.value)}
				className="border p-2 mb-4 w-full"
				placeholder="Member Email"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={onConfirm}
			>
				Send Invitation
			</button>
		</Modal>
	);
};

const RemoveMemberModal = ({
	isOpen,
	onClose,
	onConfirm,
	memberName,
	memberUId,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	memberName: string;
	memberUId: string;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Remove Member</h2>
			<p>Are you sure you want to remove {memberName} from the family?</p>
			<div className="flex justify-end mt-4">
				<button
					className="bg-red-500 text-white px-4 py-2 rounded mr-2"
					onClick={onConfirm}
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

const DeleteFamilyModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyName,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyName: string;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Delete Family</h2>
			<p>Are you sure you want to delete the family "{familyName}"?</p>
			<div className="flex justify-end mt-4">
				<button
					className="bg-red-500 text-white px-4 py-2 rounded mr-2"
					onClick={() => {
						onConfirm(); // Call onConfirm to handle deletion
						onClose(); // Close the modal after deletion
					}}
				>
					Delete
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
const ViewInvitationsModal = ({
	isOpen,
	onClose,
	invitations,
	onAccept,
	onDecline,
}: {
	isOpen: boolean;
	onClose: () => void;
	invitations: {
		familyName: string;
		inviterName: string;
		inviterEmail: string;
		familyId: string;
	}[];
	onAccept: (familyId: string) => void;
	onDecline: (familyId: string) => void;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Family Invitations</h2>
			<ul>
				{invitations.map((invitation) => (
					<li key={invitation.familyId} className="mb-4">
						<p>
							You have been invited to join the family "{invitation.familyName}"
							by {invitation.inviterName} ({invitation.inviterEmail}).
						</p>
						<div className="flex justify-end mt-4">
							<button
								className="bg-green-500 text-white px-4 py-2 rounded mr-2"
								onClick={() => onAccept(invitation.familyId)}
							>
								Accept
							</button>
							<button
								className="bg-red-500 text-white px-4 py-2 rounded"
								onClick={() => onDecline(invitation.familyId)}
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

const FamilyList = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [editingFamily, setEditingFamily] = useState<Family | null>(null);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [newFamilyName, setNewFamilyName] = useState<string>("");
	const [isCreateModalOpen, setCreateModalOpen] = useState(false);
	const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
	const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
	const [isDeleteFamilyModalOpen, setDeleteFamilyModalOpen] = useState(false);
	const [newMemberEmail, setNewMemberEmail] = useState<string>("");
	const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
	const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
	const [familyToDelete, setFamilyToDelete] = useState<Family | null>(null);
	const [isViewInvitationsModalOpen, setViewInvitationsModalOpen] =
		useState(false);
	const [invitations, setInvitations] = useState<
		{
			familyName: string;
			inviterName: string;
			inviterEmail: string;
			familyId: string;
		}[]
	>([]);

	const { data: session } = useSession();

	const fetchFamilies = async () => {
		if (session?.user?.id) {
			try {
				const fetchedFamilies = await retrieveUserFamilies(session.user.id);
				setFamilies(fetchedFamilies);
			} catch (error) {
				console.error("Failed to retrieve families:", error);
			}
		}
	};

	const fetchFamilyMembers = async (familyId: string) => {
		try {
			const members = await retrieveFamilyMembers(familyId);
			setFamilyMembers((prevMembers) => ({
				...prevMembers,
				[familyId]: members,
			}));
		} catch (error) {
			console.error(
				`Failed to retrieve members for family ${familyId}:`,
				error
			);
		}
	};

	const fetchInvitations = async () => {
		if (session?.user?.id) {
			try {
				const userInvitations = await fetchFamilyInvitations(session.user.id);
				setInvitations(userInvitations);
			} catch (error) {
				console.error("Failed to retrieve invitations:", error);
			}
		}
	};

	useEffect(() => {
		families.forEach((family) => {
			fetchFamilyMembers(family.id);
		});
	}, [families]);

	useEffect(() => {
		fetchFamilies();
		fetchInvitations();
	}, [session?.user?.id]);

	const handleDelete = async (id: string) => {
		await deleteFamily(id);
		setFamilies(families.filter((family) => family.id !== id));
	};

	const handleEdit = (family: Family) => {
		setEditingFamily(family);
		setNewFamilyName(family.name);
	};

	const handleCreate = async () => {
		if (session?.user?.id && newFamilyName) {
			try {
				await createNewFamily(session.user.id, newFamilyName);
				await fetchFamilies();
				setCreateModalOpen(false);
				setNewFamilyName("");
			} catch (error) {
				console.error("Failed to create family:", error);
			}
		}
	};

	const handleAddMember = async () => {
		// Implement add member functionality if needed
	};

	const handleRemoveMember = async () => {
		// Implement remove member functionality if needed
	};

	const handleUpdate = async () => {
		if (editingFamily && newFamilyName) {
			try {
				await updateFamilyName(editingFamily.id, newFamilyName);
				await fetchFamilies();
				setEditingFamily(null);
				setNewFamilyName("");
			} catch (error) {
				console.error("Failed to update family name:", error);
			}
		}
	};

	const handleAcceptInvitation = async (familyId: string) => {
		// try {
		// 	await setInvitations(session?.user?.id, familyId);
		// 	setInvitations(
		// 		invitations.filter((invitation) => invitation.familyId !== familyId)
		// 	);
		// 	await fetchFamilies();
		// } catch (error) {
		// 	console.error("Failed to accept invitation:", error);
		// }
	};

	const handleDeclineInvitation = async (familyId: string) => {
		// try {
		// 	await declineInvitation(session?.user?.id, familyId);
		// 	setInvitations(
		// 		invitations.filter((invitation) => invitation.familyId !== familyId)
		// 	);
		// } catch (error) {
		// 	console.error("Failed to decline invitation:", error);
		// }
	};

	const closeModal = () => {
		setEditingFamily(null);
		setCreateModalOpen(false);
		setAddMemberModalOpen(false);
		setRemoveMemberModalOpen(false);
		setDeleteFamilyModalOpen(false);
		setViewInvitationsModalOpen(false);
	};

	return (
		<div className="m-8 w-3/4">
			<div className="flex gap-4">
				<button
					className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
					onClick={() => setCreateModalOpen(true)}
				>
					Create New Family
				</button>
				<button
					className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
					onClick={() => setViewInvitationsModalOpen(true)}
				>
					View Family Invitations
				</button>
			</div>

			<ul className="flex gap-3">
				{families.map((family) => (
					<li
						className="w-1/2 border p-4 mb-4 rounded-lg shadow-sm"
						key={family.id}
					>
						<h2 className="text-xl font-semibold mb-2">{family.name}</h2>
						<p className="text-sm mb-2">
							Admin:{" "}
							{familyMembers[family.id]?.find(
								(member) => member.id === family.adminId
							)
								? `${
										familyMembers[family.id].find(
											(member) => member.id === family.adminId
										)?.name
								  } (${
										familyMembers[family.id].find(
											(member) => member.id === family.adminId
										)?.email
								  })`
								: "Unknown"}
						</p>
						<p className="text-sm mb-2">
							Created At: {new Date(family.createdAt).toLocaleString()}
						</p>
						<p className="text-sm mb-4">
							Updated At: {new Date(family.updatedAt).toLocaleString()}
						</p>
						<h3 className="font-semibold mb-2">Members:</h3>
						<ul>
							{familyMembers[family.id]?.map((member) => (
								<li key={member.id} className="flex gap-4">
									<p>
										{member.name} ({member.email})
									</p>
									{family.adminId == session?.user.id ? (
										<button
											className="text-red-500"
											onClick={() => {
												setSelectedFamilyId(family.id);
												setMemberToRemove(member);
												setRemoveMemberModalOpen(true);
											}}
										>
											Remove
										</button>
									) : null}
								</li>
							))}
						</ul>
						<div className="flex gap-4 mt-4">
							{family.adminId == session?.user.id ? (
								<button
									className="btn btn-primary"
									onClick={() => handleEdit(family)}
								>
									Edit
								</button>
							) : null}

							{family.adminId == session?.user.id ? (
								<button
									className="btn btn-error bg-red-400"
									onClick={() => {
										setFamilyToDelete(family);
										setDeleteFamilyModalOpen(true);
									}}
								>
									Delete
								</button>
							) : null}

							{family.adminId == session?.user.id ? (
								<button
									className="btn btn-secondary"
									onClick={() => {
										setSelectedFamilyId(family.id);
										setAddMemberModalOpen(true);
									}}
								>
									Add Member
								</button>
							) : null}
						</div>
					</li>
				))}
			</ul>
			<EditFamilyModal
				isOpen={!!editingFamily}
				onClose={closeModal}
				onConfirm={handleUpdate}
				familyName={newFamilyName}
				setFamilyName={setNewFamilyName}
			/>
			<CreateFamilyModal
				isOpen={isCreateModalOpen}
				onClose={closeModal}
				onConfirm={handleCreate}
				familyName={newFamilyName}
				setFamilyName={setNewFamilyName}
			/>
			<AddMemberModal
				isOpen={isAddMemberModalOpen}
				onClose={closeModal}
				onConfirm={handleAddMember}
				memberEmail={newMemberEmail}
				setMemberEmail={setNewMemberEmail}
			/>
			<RemoveMemberModal
				isOpen={isRemoveMemberModalOpen}
				onClose={closeModal}
				onConfirm={handleRemoveMember}
				memberName={memberToRemove?.name || ""}
				memberUId={memberToRemove?.id || ""}
			/>
			<DeleteFamilyModal
				isOpen={isDeleteFamilyModalOpen}
				onClose={closeModal}
				onConfirm={() => handleDelete(familyToDelete?.id || "")}
				familyName={familyToDelete?.name || ""}
			/>
			<ViewInvitationsModal
				isOpen={isViewInvitationsModalOpen}
				onClose={closeModal}
				invitations={invitations}
				onAccept={handleAcceptInvitation}
				onDecline={handleDeclineInvitation}
			/>
		</div>
	);
};

export default FamilyList;
