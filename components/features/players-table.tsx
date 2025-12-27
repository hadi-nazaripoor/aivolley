"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/shared/pagination";

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

interface PlayersTableProps {
  players: Player[];
  onAddClick?: () => void;
  pagination?: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };
}

export function PlayersTable({ players, onAddClick, pagination }: PlayersTableProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">لیست بازیکنان</h1>
          <p className="mt-2 text-sm text-gray-700">
            فهرست تمام بازیکنان شامل نام، شماره تلفن، تیم و وضعیت بیمه.
          </p>
        </div>
        {onAddClick && (
          <div className="mt-4 sm:mt-0 sm:mr-16 sm:flex-none">
            <button
              type="button"
              onClick={onAddClick}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              افزودن
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
                    اطلاعات بازیکن
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    اطلاعات ورزشی
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    وضعیت بیمه
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                    <span className="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
                      <div className="flex items-center">
                        <div className="size-11 shrink-0">
                          <img
                            alt=""
                            src={player.avatar}
                            className="size-11 rounded-full"
                          />
                        </div>
                        <div className="mr-4">
                          <div className="font-medium text-gray-900">{player.fullName}</div>
                          <div className="mt-1 text-gray-500">{player.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                      <div className="text-gray-900">{player.teamName}</div>
                      <div className="mt-1 text-gray-500">{player.position}</div>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap">
                      <div className="mb-2 text-gray-900">{player.insuranceExpiryDate}</div>
                      <StatusBadge isValid={player.isInsuranceValid} />
                    </td>
                    <td className="relative py-5 pr-4 pl-3 text-left text-sm font-medium whitespace-nowrap sm:pr-0">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        مشاهده<span className="sr-only">, {player.fullName}</span>
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

