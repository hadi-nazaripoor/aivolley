"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronsUpDown, Check, CheckCircle, XCircle } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/api/services/profile";
import { getProvinces, getCitiesByProvinceId } from "@/lib/api/services/locations";
import type { Province, City } from "@/lib/api/types";
import { getImageUrl } from "@/lib/utils/image-url";
import DatePicker from "@/components/ui/date-picker";
import { Notification } from "@/components/shared/notification";

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
    <Listbox value={selected || undefined} onChange={onSelect}>
      <Label className="block text-sm/6 font-medium text-gray-900">استان</Label>
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
    <Listbox value={selected || undefined} onChange={onSelect} disabled={disabled}>
      <Label className="block text-sm/6 font-medium text-gray-900">شهر</Label>
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

export default function ProfilePage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{
    bornProvinceId: string;
    bornCityId: string;
    confirmed: boolean;
    avatar: string | null;
  } | null>(null);
  const isInitialLoadRef = useRef(true);
  const provinceFromProfileRef = useRef(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    firstName: string;
    lastName: string;
    fatherName: string;
    nationalCode: string;
    gender: string;
    avatar: string;
  }>({
    defaultValues: {
      firstName: "",
      lastName: "",
      fatherName: "",
      nationalCode: "",
      gender: "",
      avatar: "",
    },
  });

  // Load provinces on page load
  useEffect(() => {
    setLoadingProvinces(true);
    getProvinces()
      .then((data) => {
        setProvinces(data);
      })
      .catch((err) => {
        console.error("Error fetching provinces:", err);
        setError("خطا در بارگذاری استان‌ها");
      })
      .finally(() => {
        setLoadingProvinces(false);
      });
  }, []);

  // Fetch profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const profile = await getProfile();
        console.log(profile);
        setProfileData({
          bornProvinceId: profile.bornProvinceId,
          bornCityId: profile.bornCityId,
          confirmed: profile.confirmed,
          avatar: profile.avatar,
        });
        
        setValue("firstName", profile.firstName);
        setValue("lastName", profile.lastName);
        setValue("fatherName", profile.fatherName);
        setValue("nationalCode", profile.nationalCode);
        setValue("gender", profile.gender);
        setValue("avatar", profile.avatar || "");
        
        if (profile.dateOfBirth) {
          setDateOfBirth(new Date(profile.dateOfBirth));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("خطا در بارگذاری اطلاعات پروفایل");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  // Auto-select province from profile when both profile and provinces are ready
  useEffect(() => {
    if (!isInitialLoadRef.current) return;
    
    if (profileData && provinces.length > 0 && !loadingProvinces && !loadingProfile) {
      if (profileData.bornProvinceId && !selectedProvince) {
        const province = provinces.find((p) => p.id === profileData.bornProvinceId);
        if (province) {
          provinceFromProfileRef.current = true;
          setSelectedProvince(province);
        } else {
          isInitialLoadRef.current = false;
        }
      } else if (!profileData.bornProvinceId) {
        isInitialLoadRef.current = false;
      }
    }
  }, [profileData, provinces, selectedProvince, loadingProvinces, loadingProfile]);

  // Load cities when province is selected
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    setLoadingCities(true);
    setSelectedCity(null);
    setCities([]);
    
    getCitiesByProvinceId(selectedProvince.id)
      .then((data) => {
        setCities(data);
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setError("خطا در بارگذاری شهرها");
      })
      .finally(() => {
        setLoadingCities(false);
      });
  }, [selectedProvince]);

  // Auto-select city from profile when cities are loaded and province matches profile
  useEffect(() => {
    if (!isInitialLoadRef.current) return;
    
    if (
      provinceFromProfileRef.current &&
      cities.length > 0 &&
      !loadingCities &&
      selectedProvince?.id === profileData?.bornProvinceId
    ) {
      if (profileData?.bornCityId && !selectedCity) {
        const city = cities.find((c) => c.id === profileData.bornCityId);
        if (city) {
          setSelectedCity(city);
        }
      }
      isInitialLoadRef.current = false;
      provinceFromProfileRef.current = false;
    }
  }, [cities, profileData, selectedProvince, selectedCity, loadingCities]);

  // Handle manual province change
  const handleProvinceChange = useCallback((province: Province) => {
    if (!isInitialLoadRef.current) {
      provinceFromProfileRef.current = false;
    }
    setSelectedProvince(province);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("لطفاً یک فایل تصویری انتخاب کنید");
      return;
    }

    if (file.size > 1048576) {
      setError("حجم فایل باید کمتر از 1MB باشد");
      return;
    }

    setSelectedAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    fatherName: string;
    nationalCode: string;
    gender: string;
    avatar: string;
  }) => {
    if (!selectedCity) {
      setNotification({
        type: "error",
        message: "لطفاً شهر را انتخاب کنید",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotification(null);

    try {
      const dateOfBirthStr = dateOfBirth
        ? dateOfBirth.toISOString().split("T")[0]
        : "";

      await updateProfile({
        FirstName: data.firstName,
        LastName: data.lastName,
        FatherName: data.fatherName,
        NationalCode: data.nationalCode,
        DateOfBirth: dateOfBirthStr,
        Gender: data.gender,
        BornProvinceId: selectedProvince!.id,
        BornCityId: selectedCity.id,
        Avatar: selectedAvatarFile || undefined,
      });

      setNotification({
        type: "success",
        message: "اطلاعات پروفایل با موفقیت به‌روزرسانی شد",
      });

      setAvatarPreview(null);
      setSelectedAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در به‌روزرسانی پروفایل";
      setNotification({
        type: "error",
        message: errorMessage,
      });
      console.error("Error updating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">اطلاعات شخصی</h2>
        <p className="mt-1 text-sm/6 text-gray-500">
          این اطلاعات به صورت عمومی نمایش داده می‌شوند، پس مراقب باشید چه چیزی را به اشتراک می‌گذارید.
        </p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {notification && (
            <div className="mb-4">
              <Notification
                type={notification.type}
                message={notification.message}
                onDismiss={() => setNotification(null)}
              />
            </div>
          )}
          {error && !notification && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {profileData && (
            <>
              {profileData.confirmed ? (
                <div className="mb-4 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <CheckCircle aria-hidden="true" className="size-5 text-green-400" />
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-green-800">حساب کاربری تأیید شده</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>حساب کاربری شما تأیید شده است و می‌توانید از تمام امکانات استفاده کنید.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <XCircle aria-hidden="true" className="size-5 text-red-400" />
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-red-800">حساب کاربری تأیید نشده</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>حساب کاربری شما هنوز تأیید نشده است. لطفاً منتظر تأیید بمانید.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              <img
                alt=""
                src={avatarPreview || (profileData?.avatar ? getImageUrl(profileData.avatar) : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")}
                className="size-24 flex-none rounded-lg bg-gray-100 object-cover"
              />
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={handleAvatarClick}>
                  تغییر تصویر پروفایل
                </Button>
                <p className="mt-2 text-xs/5 text-gray-500">JPG، GIF یا PNG. حداکثر 1MB.</p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="firstName">نام</Label>
              <div className="mt-2">
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="نام"
                  {...register("firstName", {
                    required: "نام الزامی است",
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
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <div className="mt-2">
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="نام خانوادگی"
                  {...register("lastName", {
                    required: "نام خانوادگی الزامی است",
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
              <Label htmlFor="fatherName">نام پدر</Label>
              <div className="mt-2">
                <Input
                  id="fatherName"
                  type="text"
                  placeholder="نام پدر"
                  {...register("fatherName", {
                    required: "نام پدر الزامی است",
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
              <Label htmlFor="nationalCode">کد ملی</Label>
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
              <Label htmlFor="dateOfBirth">تاریخ تولد</Label>
              <div className="mt-2">
                <DatePicker 
                  value={dateOfBirth}
                  onChange={(date) => setDateOfBirth(date)}
                  className="col-span-2" 
                  placeholder="تاریخ تولد"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="gender">جنسیت</Label>
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
                onSelect={handleProvinceChange}
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
              <Label htmlFor="username">نام کاربری</Label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pr-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="نام کاربری"
                    className="border-0 outline-0 focus:ring-0 focus:outline-0 flex-1"
                  />
                  <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 me-1">
                    example.com/
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <Button type="submit" disabled={loadingProfile || loadingProvinces || loadingCities || isSubmitting}>
              {isSubmitting ? "در حال ذخیره..." : loadingProfile ? "در حال بارگذاری..." : "ذخیره"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

