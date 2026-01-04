"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/shared/pagination";
import { ApprovalStatus, ClubTypes } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

// Map ClubTypes to Persian labels
const clubTypeLabels: Record<ClubTypes, string> = {
  [ClubTypes.Public]: "عمومی",
  [ClubTypes.Private]: "خصوصی",
  [ClubTypes.Academy]: "آکادمی",
  [ClubTypes.University]: "دانشگاهی",
};

interface Club {
  id: string;
  name: string;
  type: string;
  cityName?: string;
  phoneNumber: string | null;
  websiteUrl: string | null;
  logo: string | null;
  approvalStatus: ApprovalStatus;
}

interface ClubsTableProps {
  clubs: Club[];
  onAddClick?: () => void;
  pagination?: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };
}

function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const statusConfig = {
    [ApprovalStatus.Pending]: {
      label: "در انتظار بررسی",
      className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    },
    [ApprovalStatus.Approved]: {
      label: "تایید شده",
      className: "bg-green-50 text-green-700 ring-green-600/20",
    },
    [ApprovalStatus.Rejected]: {
      label: "رد شده",
      className: "bg-red-50 text-red-700 ring-red-600/20",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function ClubsTable({ clubs, onAddClick, pagination }: ClubsTableProps) {
  const router = useRouter();

  const handleClubClick = (clubId: string) => {
    router.push(`/dashboard/club-owner/clubs/${clubId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">باشگاه‌های من</h1>
          <p className="mt-2 text-sm text-gray-700">
            فهرست تمام باشگاه‌های شما شامل نام، نوع، شهر و وضعیت تأیید.
          </p>
        </div>
        {onAddClick && (
          <div className="mt-4 sm:mt-0 sm:mr-16 sm:flex-none">
            <button
              type="button"
              onClick={onAddClick}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              افزودن باشگاه
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-right text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    اطلاعات باشگاه
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    نوع و شهر
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    تماس
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    وضعیت تأیید
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                    <span className="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {clubs.map((club) => (
                  <tr key={club.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleClubClick(club.id)}>
                    <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
                      <div className="flex items-center">
                        {club.logo ? (
                          <div className="size-11 shrink-0">
                            <img
                              alt={club.name}
                              src={club.logo}
                              className="size-11 rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-11 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-500">
                              {club.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="mr-4">
                          <div className="font-medium text-gray-900">{club.name}</div>
                          {club.address && (
                            <div className="mt-1 text-gray-500">{club.address}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                      <div className="text-gray-900">{club.type}</div>
                      {club.cityName && (
                        <div className="mt-1 text-gray-500">{club.cityName}</div>
                      )}
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                      {club.phoneNumber && (
                        <div className="text-gray-900">{club.phoneNumber}</div>
                      )}
                      {club.websiteUrl && (
                        <div className="mt-1">
                          <a
                            href={club.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            وب‌سایت
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap">
                      <ApprovalStatusBadge status={club.approvalStatus} />
                    </td>
                    <td className="relative py-5 pr-4 pl-3 text-left text-sm font-medium whitespace-nowrap sm:pr-0">
                      <a
                        href={`/dashboard/club-owner/clubs/${club.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClubClick(club.id);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        مشاهده<span className="sr-only">, {club.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {pagination && (
        <Pagination
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          totalCount={pagination.totalCount}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}

