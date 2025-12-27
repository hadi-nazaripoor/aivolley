"use client";

import { useState, useEffect, useCallback } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Filter, ChevronDown, ChevronsUpDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getProvinces, getCitiesByProvinceId } from "@/lib/api/services/locations";
import type { Province, City } from "@/lib/api/types";

export interface MembersFilterValues {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  gender?: string;
  bornCityId?: string;
}

interface ProvinceSelectProps {
  provinces: Province[];
  selected: Province | null;
  onSelect: (province: Province | null) => void;
}

interface CitySelectProps {
  cities: City[];
  selected: City | null;
  onSelect: (city: City | null) => void;
  disabled?: boolean;
}

function ProvinceSelect({ provinces, selected, onSelect }: ProvinceSelectProps) {
  return (
    <Listbox value={selected} onChange={onSelect}>
      <UILabel className="block text-sm/6 font-medium text-gray-900">استان</UILabel>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-right text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 truncate pr-6">
            {selected?.name || "انتخاب استان"}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-start text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          <ListboxOption
            value={null}
            className="group relative cursor-default py-2 pr-8 pl-4 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
          >
            <span className="block truncate font-normal group-data-selected:font-semibold">
              همه استان‌ها
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-1.5 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
              <Check aria-hidden="true" className="size-5" />
            </span>
          </ListboxOption>
          {provinces.map((province) => (
            <ListboxOption
              key={province.id}
              value={province}
              className="group relative cursor-default py-2 pr-8 pl-4 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
            >
              <span className="block truncate font-normal group-data-selected:font-semibold">
                {province.name}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-1.5 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                <Check aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function CitySelect({ cities, selected, onSelect, disabled }: CitySelectProps) {
  return (
    <Listbox value={selected} onChange={onSelect} disabled={disabled}>
      <UILabel className="block text-sm/6 font-medium text-gray-900">شهر</UILabel>
      <div className="relative mt-2">
        <ListboxButton
          disabled={disabled}
          className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-right text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed sm:text-sm/6"
        >
          <span className="col-start-1 row-start-1 truncate pr-6">
            {selected?.name || "انتخاب شهر"}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-start text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          <ListboxOption
            value={null}
            className="group relative cursor-default py-2 pr-8 pl-4 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
          >
            <span className="block truncate font-normal group-data-selected:font-semibold">
              همه شهرها
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-1.5 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
              <Check aria-hidden="true" className="size-5" />
            </span>
          </ListboxOption>
          {cities.map((city) => (
            <ListboxOption
              key={city.id}
              value={city}
              className="group relative cursor-default py-2 pr-8 pl-4 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
            >
              <span className="block truncate font-normal group-data-selected:font-semibold">
                {city.name}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-1.5 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                <Check aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface MembersFilterProps {
  onFilterChange: (filters: MembersFilterValues) => void;
  onClear: () => void;
}

export function MembersFilter({ onFilterChange, onClear }: MembersFilterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [gender, setGender] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Load provinces on mount
  useEffect(() => {
    setLoadingProvinces(true);
    getProvinces()
      .then((data) => {
        setProvinces(data);
      })
      .catch((err) => {
        console.error("Error fetching provinces:", err);
      })
      .finally(() => {
        setLoadingProvinces(false);
      });
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      setLoadingCities(true);
      setSelectedCity(null);
      setCities([]);
      getCitiesByProvinceId(selectedProvince.id)
        .then((data) => {
          setCities(data);
        })
        .catch((err) => {
          console.error("Error fetching cities:", err);
        })
        .finally(() => {
          setLoadingCities(false);
        });
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedProvince]);

  // Calculate active filter count
  useEffect(() => {
    let count = 0;
    if (firstName.trim()) count++;
    if (lastName.trim()) count++;
    if (nationalCode.trim()) count++;
    if (gender) count++;
    if (selectedCity) count++;
    setActiveFilterCount(count);
  }, [firstName, lastName, nationalCode, gender, selectedCity]);

  const handleSearch = useCallback(() => {
    const filters: MembersFilterValues = {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      nationalCode: nationalCode.trim() || undefined,
      gender: gender || undefined,
      bornCityId: selectedCity?.id || undefined,
    };
    onFilterChange(filters);
  }, [firstName, lastName, nationalCode, gender, selectedCity, onFilterChange]);

  const handleClear = useCallback(() => {
    setFirstName("");
    setLastName("");
    setNationalCode("");
    setGender("");
    setSelectedProvince(null);
    setSelectedCity(null);
    setCities([]);
    onClear();
  }, [onClear]);

  const sortOptions = [
    { name: "جدیدترین", href: "#", current: true },
    { name: "قدیمی‌ترین", href: "#", current: false },
    { name: "نام الفبایی", href: "#", current: false },
  ];

  return (
    <Disclosure
      as="section"
      aria-labelledby="filter-heading"
      className="grid items-center border-t border-b border-gray-200"
    >
      <h2 id="filter-heading" className="sr-only">
        فیلترها
      </h2>
      <div className="relative col-start-1 row-start-1 py-4">
        <div className="mx-auto flex max-w-7xl divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
          <div className="pl-6">
            <DisclosureButton className="group flex items-center font-medium text-gray-700">
              <Filter
                aria-hidden="true"
                className="ml-2 size-5 flex-none text-gray-400 group-hover:text-gray-500"
              />
              {activeFilterCount > 0 ? `${activeFilterCount} فیلتر` : "فیلترها"}
            </DisclosureButton>
          </div>
          <div className="pr-6">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700"
            >
              پاک کردن همه
            </button>
          </div>
        </div>
      </div>
      <DisclosurePanel className="border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <UILabel htmlFor="filter-firstName">نام</UILabel>
                <div className="mt-2">
                  <Input
                    id="filter-firstName"
                    type="text"
                    placeholder="نام"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <UILabel htmlFor="filter-lastName">نام خانوادگی</UILabel>
                <div className="mt-2">
                  <Input
                    id="filter-lastName"
                    type="text"
                    placeholder="نام خانوادگی"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <UILabel htmlFor="filter-nationalCode">کد ملی</UILabel>
                <div className="mt-2">
                  <Input
                    id="filter-nationalCode"
                    type="text"
                    placeholder="کد ملی"
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <UILabel htmlFor="filter-gender">جنسیت</UILabel>
                <div className="mt-2">
                  <select
                    id="filter-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="Male">مرد</option>
                    <option value="Female">زن</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <ProvinceSelect
                  provinces={provinces}
                  selected={selectedProvince}
                  onSelect={setSelectedProvince}
                />
              </div>

              <div className="sm:col-span-3">
                <CitySelect
                  cities={cities}
                  selected={selectedCity}
                  onSelect={setSelectedCity}
                  disabled={!selectedProvince || loadingCities}
                />
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="button"
                onClick={handleSearch}
                disabled={loadingProvinces || loadingCities}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 sm:mr-3 sm:w-auto"
              >
                جستجو
              </Button>
            </div>
          </div>
        </div>
      </DisclosurePanel>
      <div className="col-start-1 row-start-1 py-4">
        <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
          <Menu as="div" className="relative inline-block">
            <div className="flex">
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                مرتب‌سازی
                <ChevronDown
                  aria-hidden="true"
                  className="-ml-1 mr-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                {sortOptions.map((option) => (
                  <MenuItem key={option.name}>
                    <a
                      href={option.href}
                      className={classNames(
                        option.current ? "font-medium text-gray-900" : "text-gray-500",
                        "block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden"
                      )}
                    >
                      {option.name}
                    </a>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </Disclosure>
  );
}

