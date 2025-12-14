"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PlayersTable } from "@/components/features/players-table";
import { CreateMemberDialog } from "@/components/features/create-member-dialog";
import { getPlayers } from "@/lib/api/services/members";
import type { ApiMember } from "@/lib/api/types";
import { getImageUrl } from "@/lib/utils/image-url";

interface Player {
  id: number;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  teamName: string;
  position: string;
  insuranceExpiryDate: string;
  isInsuranceValid: boolean;
}

export default function PlayersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPlayers();
        // Map API data to component Player interface
        const mappedPlayers: Player[] = data.map((member: ApiMember) => ({
          id: member.id,
          fullName: member.firstName + " " + member.lastName,
          phoneNumber: member.phoneNumber,
          avatar: getImageUrl(member.avatar),
          teamName: member.teamName,
          position: member.position,
          insuranceExpiryDate: member.insuranceExpiryDate,
          isInsuranceValid: member.isInsuranceValid,
        }));
        setPlayers(mappedPlayers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load players";
        setError(errorMessage);
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  const handleAddClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMemberCreated = (newMember: ApiMember) => {
    // Map the new member to Player format and add to the list
    const newPlayer: Player = {
      id: newMember.id,
      fullName: newMember.firstName + " " + newMember.lastName,
      phoneNumber: newMember.phoneNumber,
      avatar: getImageUrl(newMember.avatar),
      teamName: newMember.teamName,
      position: newMember.position,
      insuranceExpiryDate: newMember.insuranceExpiryDate,
      isInsuranceValid: newMember.isInsuranceValid,
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ps-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-10">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">در حال بارگذاری...</p>
                </div>
              </div>
            ) : error ? (
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <p className="text-sm text-red-600">
                    خطا در بارگذاری داده‌ها: {error}
                  </p>
                </div>
              </div>
            ) : (
              <PlayersTable players={players} onAddClick={handleAddClick} />
            )}
          </div>
        </main>
      </div>
      <CreateMemberDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleMemberCreated}
      />
    </div>
  );
}

