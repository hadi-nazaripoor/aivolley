"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createMember } from "@/lib/api/services/members";
import { getProvinces, getCitiesByProvinceId } from "@/lib/api/services/locations";
import type { Province, City, CreateMemberRequest } from "@/lib/api/types";
import { getImageUrl } from "@/lib/utils/image-url";
import DatePicker from "../ui/date-picker";

interface CreateMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (member: any) => void;
}

interface ProvinceSelectProps {
  provinces: Province[];
  selected: Province | null;
  onSelect: (province: Province) => void;
}

interface CitySelectProps {
  cities: City[];
  selected: City | null;
  onSelect: (city: City) => void;
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

export function CreateMemberDialog({
  open,
  onClose,
  onSuccess,
}: CreateMemberDialogProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateMemberRequest & { gender: string }>();

  // Fetch provinces on mount
  useEffect(() => {
    if (open) {
      setLoadingProvinces(true);
      getProvinces()
        .then((data) => {
          setProvinces(data);
          if (data.length > 0) {
            setSelectedProvince(data[0]);
          }
        })
        .catch((err) => {
          console.error("Error fetching provinces:", err);
          setError("خطا در بارگذاری استان‌ها");
        })
        .finally(() => {
          setLoadingProvinces(false);
        });
    } else {
      // Reset form when dialog closes
      reset();
      setSelectedProvince(null);
      setSelectedCity(null);
      setCities([]);
      setError(null);
    }
  }, [open, reset]);

  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      setLoadingCities(true);
      setSelectedCity(null);
      setCities([]);
      getCitiesByProvinceId(selectedProvince.id)
        .then((data) => {
          setCities(data);
          if (data.length > 0) {
            setSelectedCity(data[0]);
            setValue("bornCityId", data[0].id);
          }
        })
        .catch((err) => {
          console.error("Error fetching cities:", err);
          setError("خطا در بارگذاری شهرها");
        })
        .finally(() => {
          setLoadingCities(false);
        });
    }
  }, [selectedProvince, setValue]);

  // Update bornCityId when city changes
  useEffect(() => {
    if (selectedCity) {
      setValue("bornCityId", selectedCity.id);
    }
  }, [selectedCity, setValue]);

  const onSubmit = async (data: CreateMemberRequest & { gender: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedCity) {
        throw new Error("لطفاً شهر را انتخاب کنید");
      }

      const request: CreateMemberRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        nationalCode: data.nationalCode,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        avatar: data.avatar || null,
        bornCityId: selectedCity.id,
      };

      const newMember = await createMember(request);
      onSuccess(newMember);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ایجاد عضو جدید";
      setError(errorMessage);
      console.error("Error creating member:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-right shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-2xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="absolute top-0 left-0 pt-4 pl-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
              >
                <span className="sr-only">بستن</span>
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-right w-full">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  افزودن عضو جدید
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    اطلاعات عضو جدید را وارد کنید.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <UILabel htmlFor="firstName">نام</UILabel>
                  <div className="mt-2">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="نام"
                      autoComplete="given-name"
                      {...register("firstName", {
                        required: "نام الزامی است",
                        minLength: { value: 2, message: "نام باید حداقل 2 کاراکتر باشد" },
                      })}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <UILabel htmlFor="lastName">نام خانوادگی</UILabel>
                  <div className="mt-2">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="نام خانوادگی"
                      autoComplete="family-name"
                      {...register("lastName", {
                        required: "نام خانوادگی الزامی است",
                        minLength: { value: 2, message: "نام خانوادگی باید حداقل 2 کاراکتر باشد" },
                      })}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <UILabel htmlFor="fatherName">نام پدر</UILabel>
                  <div className="mt-2">
                    <Input
                      id="fatherName"
                      type="text"
                      placeholder="نام پدر"
                      {...register("fatherName", {
                        required: "نام پدر الزامی است",
                        minLength: { value: 2, message: "نام پدر باید حداقل 2 کاراکتر باشد" },
                      })}
                    />
                    {errors.fatherName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fatherName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <UILabel htmlFor="nationalCode">کد ملی</UILabel>
                  <div className="mt-2">
                    <Input
                      id="nationalCode"
                      type="text"
                      placeholder="کد ملی"
                      {...register("nationalCode", {
                        required: "کد ملی الزامی است",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "کد ملی باید 10 رقم باشد",
                        },
                      })}
                    />
                    {errors.nationalCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nationalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <UILabel htmlFor="dateOfBirth">تاریخ تولد</UILabel>
                  <div className="mt-2">
                  <DatePicker className="col-span-2" placeholder="تاریخ تولد"/>

                    {/* <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth", {
                        required: "تاریخ تولد الزامی است",
                      })}
                    /> */}
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <UILabel htmlFor="gender">جنسیت</UILabel>
                  <div className="mt-2">
                    <select
                      id="gender"
                      {...register("gender", {
                        required: "جنسیت الزامی است",
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="Male">مرد</option>
                      <option value="Female">زن</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender.message}
                      </p>
                    )}
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

                <div className="col-span-full">
                  <UILabel htmlFor="avatar">تصویر آواتار (اختیاری)</UILabel>
                  <div className="mt-2">
                    <Input
                      id="avatar"
                      type="text"
                      placeholder="آدرس تصویر"
                      {...register("avatar")}
                    />
                    {errors.avatar && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.avatar.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  type="submit"
                  disabled={isSubmitting || loadingProvinces || loadingCities}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 sm:mr-3 sm:w-auto"
                >
                  {isSubmitting ? "در حال ایجاد..." : "ایجاد"}
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  انصراف
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

