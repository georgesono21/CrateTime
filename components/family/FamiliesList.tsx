"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
	acceptFamilyInvitation,
	changeFamilyAdmin,
	createNewFamily,
	deleteFamily,
	getUserInvitations,
	rejectFamilyInvitation,
	removeMemberFromFamily,
	retrieveFamilyMembers,
	retrieveUserFamilies,
	sendFamilyInvitation,
	updateFamilyName, // Import the new function for updating family name
} from "@/app/api/family/actions";
import { Family, User } from "@prisma/client";
import { getUserIdFromEmail } from "@/app/api/user/actions";

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
	invitations: Family[];
	onAccept: any;
	onDecline: any;
}) => {
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

const ChangeAdminModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyMembers,
	currentAdminId,
	setNewAdminId,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyMembers: User[];
	currentAdminId: string;
	setNewAdminId: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Change Admin</h2>
			<p className="mb-4">Select a new admin from existing family members:</p>
			<select
				className="border p-2 mb-4 w-full"
				onChange={(e) => setNewAdminId(e.target.value)}
			>
				<option value="">Select a new admin</option>
				{familyMembers
					.filter((member) => member.id !== currentAdminId)
					.map((member) => (
						<option key={member.id} value={member.id}>
							{member.name} ({member.email})
						</option>
					))}
			</select>
			<div className="flex justify-end mt-4">
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
					onClick={async () => {
						await onConfirm();
						onClose();
					}}
				>
					Change Admin
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

const FamilyList = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [editingFamily, setEditingFamily] = useState<Family | null>(null);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);

	const [newAdminId, setNewAdminId] = useState<string>("");
	const [newFamilyName, setNewFamilyName] = useState<string>("");
	const [isCreateModalOpen, setCreateModalOpen] = useState(false);
	const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
	const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
	const [isDeleteFamilyModalOpen, setDeleteFamilyModalOpen] = useState(false);
	const [isChangeAdminModalOpen, setChangeAdminModalOpen] = useState(false);
	const [newMemberEmail, setNewMemberEmail] = useState<string>("");
	const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
	const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
	const [familyToDelete, setFamilyToDelete] = useState<Family | null>(null);
	const [isViewInvitationsModalOpen, setViewInvitationsModalOpen] =
		useState(false);
	const [invitations, setInvitations] = useState<Family[]>([]);

	const { data: session } = useSession();

	const getFamilyFromSelectedFamilyId = (): Family | undefined => {
		if (!selectedFamilyId) {
			return undefined;
		}

		return families.find((family) => family.id === selectedFamilyId);
	};

	const getAdminIdFromFamilyFromSelectedFamilyId = (): string => {
		const family = getFamilyFromSelectedFamilyId();
		if (family) {
			return family.adminId;
		}
		return "";
	};

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

	const fetchInvitations = async () => {
		if (session?.user?.id) {
			try {
				const userInvitations = await getUserInvitations(session.user.id);
				setInvitations(userInvitations);
			} catch (error) {
				console.error("Failed to retrieve invitations:", error);
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
	const handleAdminChange = async () => {
		console.log("newAdminId: ", newAdminId);
		if (session?.user?.id && newAdminId) {
			try {
				await changeFamilyAdmin(
					newAdminId,
					session?.user?.id,
					selectedFamilyId || ""
				);
				await fetchFamilies();
				setNewAdminId("");
			} catch (error) {
				console.error("Failed to change admin:", error);
			}
		}
	};

	const handleAddMember = async () => {
		if (newMemberEmail.trim() !== "") {
			try {
				// Assuming you have a method to retrieve userId from email, replace this logic accordingly
				const userId = await getUserIdFromEmail(newMemberEmail);

				if (!userId) {
					throw new Error(`User with email ${newMemberEmail} not found.`);
				}

				// Check if userId already exists in familyMembers
				if (
					familyMembers[selectedFamilyId || ""].some(
						(member) => member.id === userId
					)
				) {
					// User already exists in the family, close the modal
					setNewMemberEmail("");
					setAddMemberModalOpen(false);
					setSelectedFamilyId(null);
					return;
				}

				// Send invitation to the family
				await sendFamilyInvitation(selectedFamilyId!, userId);

				// Reset state and close modal
				setNewMemberEmail("");
				setAddMemberModalOpen(false);
				setSelectedFamilyId(null);

				// Optionally refresh family members after adding new member
				await fetchFamilyMembers(selectedFamilyId!);
			} catch (error) {
				console.error("Failed to add member to family:", error);
			}
		}
	};

	const handleRemoveMember = async () => {
		if (memberToRemove && selectedFamilyId) {
			try {
				// Assuming you have a method to remove a member from a family in your API
				await removeMemberFromFamily(
					memberToRemove.id,
					selectedFamilyId,
					session?.user.id || ""
				);

				// Update local state to reflect the removal
				setFamilyMembers((prevMembers) => ({
					...prevMembers,
					[selectedFamilyId]: prevMembers[selectedFamilyId]?.filter(
						(member) => member.id !== memberToRemove.id
					),
				}));

				// Close the modal after successful removal
				setRemoveMemberModalOpen(false);

				if (memberToRemove.id == session?.user?.id) {
					setFamilies(
						families.filter((family) => family.id !== selectedFamilyId)
					);
				}
			} catch (error) {
				console.error("Failed to remove member from family:", error);
			}
		}
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
		try {
			await acceptFamilyInvitation(session?.user?.id || "", familyId);
			setInvitations(
				invitations.filter((invitation) => invitation.id != familyId)
			);
			await fetchFamilies(); // Optionally refresh families after accepting invitation
		} catch (error) {
			console.error("Failed to accept invitation:", error);
		}
	};

	const handleDeclineInvitation = async (familyId: string) => {
		try {
			await rejectFamilyInvitation(session?.user?.id || "", familyId);
			setInvitations(
				invitations.filter((invitation) => invitation.id != familyId)
			);
		} catch (error) {
			console.error("Failed to decline invitation:", error);
		}
	};

	const closeModal = () => {
		setEditingFamily(null);
		setCreateModalOpen(false);
		setAddMemberModalOpen(false);
		setRemoveMemberModalOpen(false);
		setDeleteFamilyModalOpen(false);
		setViewInvitationsModalOpen(false);
		setChangeAdminModalOpen(false);
	};

	return (
		<div className="m-8 flex-col justify-center">
			<div className="flex justify-center items-center gap-4">
				<button
					className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
					onClick={() => setCreateModalOpen(true)}
				>
					Create New Family
				</button>
				<button
					className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
					onClick={async () => {
						await fetchFamilies();
						setViewInvitationsModalOpen(true);
					}}
				>
					View Family Invitations
				</button>
			</div>

			<div className="flex-wrap gap-3">
				{families.length == 0 ? <h1> No Famiies Yet...</h1> : null}
				{families.map((family) => (
					<div
						className=" border border-color p-4 mb-4 rounded-lg shadow-sm"
						key={family.id}
						// style={{ width: "500px" }}
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

									{member.id === session?.user.id ? (
										<button
											className="text-blue-500"
											onClick={() => {
												setSelectedFamilyId(family.id);
												setMemberToRemove(member);
												setRemoveMemberModalOpen(true);
											}}
										>
											Leave
										</button>
									) : (
										family.adminId === session?.user.id && (
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
										)
									)}
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

							{family.adminId == session?.user.id ? (
								<button
									className="btn btn-secondary"
									onClick={() => {
										setSelectedFamilyId(family.id);
										setChangeAdminModalOpen(true);
									}}
								>
									Change Admin
								</button>
							) : null}
						</div>
					</div>
				))}
			</div>
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
				currentUId={session?.user.id || ""}
				adminUId={getAdminIdFromFamilyFromSelectedFamilyId()}
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
			<ChangeAdminModal
				isOpen={isChangeAdminModalOpen}
				onClose={closeModal}
				familyMembers={familyMembers[selectedFamilyId!] || []}
				currentAdminId={getAdminIdFromFamilyFromSelectedFamilyId()}
				currentUId={session?.user.id || ""}
				onConfirm={handleAdminChange}
				// newAdminId={newAdminId}
				setNewAdminId={setNewAdminId}
			/>
		</div>
	);
};

export default FamilyList;
