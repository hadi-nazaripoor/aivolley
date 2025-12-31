"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/shared/notification";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";
import { getClubsPaginated, getClubById, createClub, updateClub } from "@/lib/api/services/clubs";
import { getProvinces, getCitiesByProvinceId } from "@/lib/api/services/locations";
import { ClubTypes, ApprovalStatus } from "@/lib/api/types";
import type { Province, City, ClubResponse } from "@/lib/api/types";
import { getImageUrl } from "@/lib/utils/image-url";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils/cn";

interface ClubFormData {
  name: string;
  cityId: string;
  type: ClubTypes;
  websiteUrl: string;
  phoneNumber: string;
  address: string;
  logo: File | null;
}

// Map ClubTypes to Persian labels
const clubTypeLabels: Record<ClubTypes, string> = {
  [ClubTypes.Public]: "عمومی",
  [ClubTypes.Private]: "خصوصی",
  [ClubTypes.Academy]: "آکادمی",
  [ClubTypes.University]: "دانشگاهی",
};

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

function CitySelect({ cities, selected, onSelect, disabled }: { cities: City[]; selected: City | null; onSelect: (city: City) => void; disabled?: boolean }) {
  return (
    <Listbox value={selected} onChange={onSelect} disabled={disabled}>
      <div className="relative">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm/6">
          <span className="block truncate">
            {selected ? selected.name : "شهر را انتخاب کنید"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <ChevronsUpDown aria-hidden="true" className="size-5 text-gray-400" />
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:transform data-[closed]:opacity-0 data-[enter]:transition data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in sm:text-sm"
        >
          {cities.map((city) => (
            <ListboxOption
              key={city.id}
              value={city}
              className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                    {city.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                      <Check aria-hidden="true" className="size-5" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function ClubTypeSelect({ selected, onSelect }: { selected: ClubTypes; onSelect: (type: ClubTypes) => void }) {
  return (
    <Listbox value={selected} onChange={onSelect}>
      <div className="relative">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
          <span className="block truncate">{clubTypeLabels[selected]}</span>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <ChevronsUpDown aria-hidden="true" className="size-5 text-gray-400" />
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:transform data-[closed]:opacity-0 data-[enter]:transition data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in sm:text-sm"
        >
          {Object.values(ClubTypes).map((type) => (
            <ListboxOption
              key={type}
              value={type}
              className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                    {clubTypeLabels[type]}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                      <Check aria-hidden="true" className="size-5" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export default function ClubFormPage() {
  const router = useRouter();
  const params = useParams();
  const { hasRole, isLoading: authLoading } = useAuth();
  const clubId = params?.id as string | undefined;
  const isEditMode = clubId && clubId !== "new";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [clubData, setClubData] = useState<ClubResponse | null>(null);
  
  // Province/City state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Logo state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ClubFormData>({
    defaultValues: {
      name: "",
      cityId: "",
      type: ClubTypes.Public,
      websiteUrl: "",
      phoneNumber: "",
      address: "",
      logo: null,
    },
  });

  const selectedType = watch("type");

  // Check if user has ClubOwner role
  useEffect(() => {
    if (!authLoading && !hasRole("ClubOwner")) {
      router.push("/");
    }
  }, [hasRole, authLoading, router]);

  // Load provinces on mount
  useEffect(() => {
    setLoadingProvinces(true);
    getProvinces()
      .then((data) => {
        setProvinces(data);
      })
      .catch((err) => {
        console.error("Error fetching provinces:", err);
        setNotification({
          type: "error",
          message: "خطا در بارگذاری استان‌ها",
        });
      })
      .finally(() => {
        setLoadingProvinces(false);
      });
  }, []);

  // Load club data in edit mode
  useEffect(() => {
    if (isEditMode && clubId) {
      setLoading(true);
      getClubById(clubId)
        .then((data) => {
          setClubData(data);
          // Set form values
          reset({
            name: data.name,
            cityId: data.cityId,
            type: data.type,
            websiteUrl: data.websiteUrl || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            logo: null,
          });
          
          // Set logo preview if exists
          if (data.logo) {
            setLogoPreview(getImageUrl(data.logo));
          }
          
          // Find province from cityId by loading cities for each province
          // This is a workaround - ideally the API would return provinceId with the club
          if (data.cityId && provinces.length > 0) {
            const findProvinceForCity = async () => {
              for (const province of provinces) {
                try {
                  const cities = await getCitiesByProvinceId(province.id);
                  const city = cities.find((c) => c.id === data.cityId);
                  if (city) {
                    setSelectedProvince(province);
                    setSelectedCity(city);
                    setValue("cityId", city.id);
                    break;
                  }
                } catch (err) {
                  console.error(`Error loading cities for province ${province.id}:`, err);
                }
              }
            };
            findProvinceForCity();
          }
        })
        .catch((err) => {
          console.error("Error fetching club:", err);
          setNotification({
            type: "error",
            message: "خطا در بارگذاری اطلاعات باشگاه",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEditMode, clubId, reset, provinces, setValue]);

  // Load cities when province is selected
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    setLoadingCities(true);
    setSelectedCity(null);
    
    getCitiesByProvinceId(selectedProvince.id)
      .then((data) => {
        setCities(data);
        
        // If in edit mode and we have clubData, try to find the city
        if (isEditMode && clubData?.cityId) {
          const city = data.find((c) => c.id === clubData.cityId);
          if (city) {
            setSelectedCity(city);
            setValue("cityId", city.id);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setNotification({
          type: "error",
          message: "خطا در بارگذاری شهرها",
        });
      })
      .finally(() => {
        setLoadingCities(false);
      });
  }, [selectedProvince, isEditMode, clubData, setValue]);

  // Update cityId when city is selected
  useEffect(() => {
    if (selectedCity) {
      setValue("cityId", selectedCity.id, { shouldValidate: true });
    }
  }, [selectedCity, setValue]);

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setNotification({
        type: "error",
        message: "لطفاً یک فایل تصویری انتخاب کنید",
      });
      return;
    }

    // Check file size (2MB = 2097152 bytes)
    if (file.size > 2097152) {
      setNotification({
        type: "error",
        message: "حجم فایل نباید بیشتر از 2 مگابایت باشد",
      });
      return;
    }

    setSelectedLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ClubFormData) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      if (!selectedCity) {
        setNotification({
          type: "error",
          message: "لطفاً شهر را انتخاب کنید",
        });
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        id: isEditMode ? clubId : undefined,
        name: data.name,
        cityId: selectedCity.id,
        type: data.type,
        websiteUrl: data.websiteUrl || null,
        phoneNumber: data.phoneNumber || null,
        address: data.address || null,
        logo: selectedLogoFile || undefined,
      };

      if (isEditMode) {
        await updateClub(requestData);
        setNotification({
          type: "success",
          message: "باشگاه با موفقیت به‌روزرسانی شد",
        });
      } else {
        await createClub(requestData);
        setNotification({
          type: "success",
          message: "باشگاه با موفقیت ایجاد شد",
        });
      }

      // Redirect to clubs list after a short delay
      setTimeout(() => {
        router.push("/clubs");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ثبت باشگاه";
      setNotification({
        type: "error",
        message: errorMessage,
      });
      console.error("Error saving club:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:ps-72">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main>
            <div className="max-w-7xl mx-auto">
              <div className="px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                  <p className="text-sm text-gray-500">در حال بارگذاری...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!hasRole("ClubOwner")) {
    return null;
  }

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ps-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>
          <div className="max-w-7xl mx-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {isEditMode ? "ویرایش باشگاه" : "ایجاد باشگاه جدید"}
                </h1>
                {isEditMode && clubData && (
                  <div className="mt-2">
                    <ApprovalStatusBadge status={clubData.approvalStatus} />
                  </div>
                )}
              </div>

              {notification && (
                <div className="mb-6">
                  <Notification
                    type={notification.type}
                    message={notification.message}
                    onDismiss={() => setNotification(null)}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                  {/* Name */}
                  <div className="sm:col-span-3">
                    <Label htmlFor="name">نام باشگاه *</Label>
                    <div className="mt-2">
                      <Input
                        id="name"
                        type="text"
                        {...register("name", { required: "نام باشگاه الزامی است" })}
                        className={errors.name ? "ring-red-600" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="sm:col-span-3">
                    <Label htmlFor="city">شهر *</Label>
                    <div className="mt-2 space-y-2">
                      <Listbox value={selectedProvince} onChange={setSelectedProvince} disabled={loadingProvinces}>
                        <div className="relative">
                          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm/6">
                            <span className="block truncate">
                              {selectedProvince ? selectedProvince.name : "استان را انتخاب کنید"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                              <ChevronsUpDown aria-hidden="true" className="size-5 text-gray-400" />
                            </span>
                          </ListboxButton>
                          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {provinces.map((province) => (
                              <ListboxOption
                                key={province.id}
                                value={province}
                                className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                      {province.name}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                                        <Check aria-hidden="true" className="size-5" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      </Listbox>
                      <CitySelect
                        cities={cities}
                        selected={selectedCity}
                        onSelect={setSelectedCity}
                        disabled={!selectedProvince || loadingCities}
                      />
                      {!selectedCity && selectedProvince && (
                        <p className="text-sm text-red-600">لطفاً شهر را انتخاب کنید</p>
                      )}
                    </div>
                  </div>

                  {/* Club Type */}
                  <div className="sm:col-span-3">
                    <Label htmlFor="type">نوع باشگاه *</Label>
                    <div className="mt-2">
                      <ClubTypeSelect selected={selectedType} onSelect={(type) => setValue("type", type)} />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-3">
                    <Label htmlFor="phoneNumber">شماره تلفن</Label>
                    <div className="mt-2">
                      <Input
                        id="phoneNumber"
                        type="tel"
                        {...register("phoneNumber")}
                      />
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="sm:col-span-3">
                    <Label htmlFor="websiteUrl">آدرس وب‌سایت</Label>
                    <div className="mt-2">
                      <Input
                        id="websiteUrl"
                        type="url"
                        {...register("websiteUrl")}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-6">
                    <Label htmlFor="address">آدرس</Label>
                    <div className="mt-2">
                      <Input
                        id="address"
                        type="text"
                        {...register("address")}
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="sm:col-span-6">
                    <Label htmlFor="logo">لوگو باشگاه</Label>
                    <div className="mt-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleLogoClick}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        {logoPreview ? "تغییر تصویر" : "انتخاب تصویر"}
                      </button>
                      {logoPreview && (
                        <div className="mt-4">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-32 w-32 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 sm:mr-3 sm:w-auto"
                  >
                    {isSubmitting ? "در حال ذخیره..." : isEditMode ? "ذخیره تغییرات" : "ایجاد باشگاه"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.push("/clubs")}
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    انصراف
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

