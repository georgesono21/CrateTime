import FamilyList from "@/components/family/FamiliesList";
import FamilyActionsDisplay from "@/components/family/FamilyActionsDisplay";
import React, { Suspense } from "react";

export default function family() {
	return (
		<div className="bg-base-300 flex min-h-screen flex-col items-center p-10">
			<h1 className="text-3xl font-semibold mb-1 ">Family Overview</h1>
			<FamilyList />
		</div>
	);
}
