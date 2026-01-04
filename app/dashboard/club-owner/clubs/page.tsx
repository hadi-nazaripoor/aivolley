"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClubsTable } from "@/components/features/clubs-table";
import { getClubsPaginated } from "@/lib/api/services/clubs";
import { usePagination } from "@/lib/hooks/use-pagination";
import type { ClubResponse } from "@/lib/api/types";
import { ClubTypes } from "@/lib/api/types";
import { getImageUrl } from "@/lib/utils/image-url";
import { useAuth } from "@/lib/contexts/auth-context";

interface Club {
  id: string;
  name: string;
  type: string;
  cityName?: string;
  phoneNumber: string | null;
  websiteUrl: string | null;
  address: string | null;
  logo: string | null;
  approvalStatus: any;
}

// Map ClubTypes to Persian labels
const clubTypeLabels: Record<ClubTypes, string> = {
  [ClubTypes.Public]: "عمومی",
  [ClubTypes.Private]: "خصوصی",
  [ClubTypes.Academy]: "آکادمی",
  [ClubTypes.University]: "دانشگاهی",
};

export default function ClubsPage() {
  const router = useRouter();
  const { hasRole, isLoading: authLoading } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination(10);
  const { pagination: paginationState, setPageNumber, setTotalCount } = pagination;

  // Check if user has ClubOwner role
  useEffect(() => {
    if (!authLoading) {
      if (!hasRole("ClubOwner")) {
        router.push("/dashboard");
      }
    }
  }, [hasRole, authLoading, router]);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getClubsPaginated(
        paginationState.pageNumber,
        paginationState.pageSize
      );
      
      // Map API data to component Club interface
      const mappedClubs: Club[] = result.items.map((club: ClubResponse) => ({
        id: club.id,
        name: club.name,
        type: clubTypeLabels[club.type] || club.type,
        cityName: undefined, // TODO: Fetch city name if needed
        phoneNumber: club.phoneNumber,
        websiteUrl: club.websiteUrl,
        address: club.address,
        logo: club.logo ? getImageUrl(club.logo) : null,
        approvalStatus: club.approvalStatus,
      }));
      
      setClubs(mappedClubs);
      setTotalCount(result.totalCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load clubs";
      setError(errorMessage);
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  }, [paginationState.pageNumber, paginationState.pageSize, setTotalCount]);

  useEffect(() => {
    if (hasRole("ClubOwner")) {
      fetchClubs();
    }
  }, [fetchClubs, hasRole]);

  const handleAddClick = () => {
    router.push("/dashboard/club-owner/clubs/new");
  };

  // Don't render if user doesn't have ClubOwner role
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRole("ClubOwner")) {
    return null;
  }

  return (
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
        <ClubsTable
          clubs={clubs}
          onAddClick={handleAddClick}
          pagination={{
            pageNumber: paginationState.pageNumber,
            pageSize: paginationState.pageSize,
            totalCount: paginationState.totalCount,
            onPageChange: setPageNumber,
          }}
        />
      )}
    </div>
  );
}

