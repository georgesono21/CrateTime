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
} from "@/app/api/family/prismaActions";
import { Family, User } from "@prisma/client";
import { getUserIdFromEmail } from "@/app/api/user/actions";
import RemoveMemberModal from "./modals/RemoveMemberModal";
import EditFamilyModal from "./modals/EditFamilyModal";
import CreateFamilyModal from "./modals/CreateFamilyModal";
import AddMemberModal from "./modals/AddMemberModal";
import DeleteFamilyModal from "./modals/DeleteFamilyModal";
import ViewInvitationsModal from "./modals/ViewInvitationsModal";
import ChangeAdminModal from "./modals/ChangeAdminModal";
import MiniUserProfileView from "@/components/user/MiniUserProfileView";

// Modal Component

const FamilyList = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [editingFamily, setEditingFamily] = useState<Family | null>(null);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);

	const [update, setUpdate] = useState<boolean>(false);

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
				fetchedFamilies.forEach((family: any) => {
					// console.log(`forEach:  ${JSON.stringify(family.familyMembers)}`);
					setFamilyMembers((prevMembers) => ({
						...prevMembers,
						[family.id]: family.familyMembers,
					}));
				});
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

	const fetchData = async () => {
		await fetchFamilies();
		await fetchInvitations();
		// console.log(`fetchData: families: ${JSON.stringify(families)}`);
	};

	useEffect(() => {
		fetchData();
	}, [session?.user.id]);

	// useEffect(() => {
	// 	console.log(`update: ${update}`);
	// }, [update]);

	useEffect(() => {
		const eventSource = new EventSource(`/api/family`);
		eventSource.onopen = (e) => {
			console.log("server open ready");
			// console.log(
			// 	`eventSource onopen: families: ${JSON.stringify(
			// 		families
			// 	)} invites: ${JSON.stringify(
			// 		invitations
			// 	)} familymembers ${JSON.stringify(familyMembers)}`
			// );
			// fetchData();
		};
		eventSource.onmessage = async (e) => {
			console.log("onmessage");

			// console.log(
			// 	`eventSource onMESSAGE: families: ${JSON.stringify(
			// 		families
			// 	)} invites: ${JSON.stringify(
			// 		invitations
			// 	)} familymembers ${JSON.stringify(familyMembers)}`
			// );

			fetchData();
			// setUpdate(!update);
			console.log(`onmessage: ${update}`);
		};

		return () => {
			eventSource.close();
			console.log("EventSource connection closed");
		};
	}, []);

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
		// console.log("newAdminId: ", newAdminId);
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
		<div className="m-8 mx-4 flex-col justify-center">
			<div className="flex-wrap justify-center items-center gap-4 ">
				<button
					className="btn btn-ghost text-xl text-center dark:text-white btn-outline m-2"
					onClick={() => setCreateModalOpen(true)}
				>
					Create New Family
				</button>
				<button
					className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5 m-2"
					onClick={async () => {
						// await fetchFamilies();
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
							<MiniUserProfileView
								user={
									familyMembers[family.id]?.find(
										(member) => member.id === family.adminId
									)
										? familyMembers[family.id].find(
												(member) => member.id === family.adminId
										  )
										: undefined // Provide a default user object if admin is unknown
								}
							/>
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
										{/* {member.name} ({member.email}) */}
										<MiniUserProfileView user={member} />
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
						<div className="flex-wrap mt-4">
							{family.adminId == session?.user.id ? (
								<button
									className="btn btn-primary m-2"
									onClick={() => handleEdit(family)}
								>
									Edit
								</button>
							) : null}

							{family.adminId == session?.user.id ? (
								<button
									className="btn btn-error bg-red-400 m-2"
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
									className="btn btn-secondary m-2"
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
									className="btn btn-secondary m-2"
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
				fetchInvitations={fetchInvitations}
			/>
			<ChangeAdminModal
				isOpen={isChangeAdminModalOpen}
				onClose={closeModal}
				familyMembers={familyMembers[selectedFamilyId!] || []}
				currentAdminId={getAdminIdFromFamilyFromSelectedFamilyId()}
				// currentUId={session?.user.id || ""}
				onConfirm={handleAdminChange}
				// newAdminId={newAdminId}
				setNewAdminId={setNewAdminId}
			/>
		</div>
	);
};

export default FamilyList;
