"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/shared/notification";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";
import { createNews } from "@/lib/api/services/news";
import { getProvinces, getCitiesByProvinceId } from "@/lib/api/services/locations";
import { NewsTypes, NewsLocalityTypes, NewsContentBlockType } from "@/lib/api/types";
import type { Province, City } from "@/lib/api/types";
import { ContentBlockEditor, type ContentBlock } from "@/components/features/content-block-editor";
import { useAuth } from "@/lib/contexts/auth-context";

interface NewsFormData {
  title: string;
  slug: string;
  shortDescription: string;
  dateTime: string; // ISO datetime string from datetime-local input
  thumbImage: File | null;
  type: NewsTypes;
  locality: NewsLocalityTypes;
  relatedCityId: string;
  isPinned: boolean;
}

// Map NewsTypes to Persian labels
const newsTypeLabels: Record<NewsTypes, string> = {
  [NewsTypes.News]: "خبر",
  [NewsTypes.Announcement]: "اطلاعیه",
};

// Map NewsLocalityTypes to Persian labels
const localityLabels: Record<NewsLocalityTypes, string> = {
  [NewsLocalityTypes.National]: "ملی",
  [NewsLocalityTypes.Provincial]: "استانی",
  [NewsLocalityTypes.City]: "شهری",
};

/**
 * Generate slug from title
 */
function normalizePersian(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, " ")
    .replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}

export function generateSlug(title: string): string {
  return normalizePersian(title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateNewsPage() {
  const router = useRouter();
  const { hasRole, isLoading: authLoading } = useAuth();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [thumbImagePreview, setThumbImagePreview] = useState<string | null>(null);
  const [selectedThumbImage, setSelectedThumbImage] = useState<File | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const thumbImageInputRef = useRef<HTMLInputElement>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewsFormData>({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      dateTime: new Date().toISOString().slice(0, 16),
      thumbImage: null,
      type: NewsTypes.News,
      locality: NewsLocalityTypes.National,
      relatedCityId: "",
      isPinned: false,
    },
  });

  const watchedTitle = watch("title");
  const watchedLocality = watch("locality");
  const watchedSlug = watch("slug");

  // Auto-generate slug from title
  useEffect(() => {
    if (!watchedTitle || isSlugManuallyEdited) return;
  
    const generatedSlug = generateSlug(watchedTitle);
    setValue("slug", generatedSlug, { shouldDirty: true });
  }, [watchedTitle, isSlugManuallyEdited, setValue]);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Load cities when province is selected
  useEffect(() => {
    if (selectedProvince) {
      const loadCities = async () => {
        try {
          setLoadingCities(true);
          const data = await getCitiesByProvinceId(selectedProvince.id);
          setCities(data);
        } catch (error) {
          console.error("Error loading cities:", error);
        } finally {
          setLoadingCities(false);
        }
      };
      loadCities();
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedProvince]);

  // Check if user has NewsPublisher role
  useEffect(() => {
    if (!authLoading) {
      if (!hasRole("NewsPublisher")) {
        router.push("/dashboard");
      }
    }
  }, [hasRole, authLoading, router]);

  const handleThumbImageClick = () => {
    thumbImageInputRef.current?.click();
  };

  const handleThumbImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedThumbImage(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setThumbImagePreview(preview);
      setValue("thumbImage", file);
    } else {
      setThumbImagePreview(null);
      setValue("thumbImage", null);
    }
  };

  const onSubmit = async (data: NewsFormData) => {
    if (!selectedThumbImage) {
      setNotification({
        type: "error",
        message: "لطفاً تصویر شاخص را انتخاب کنید",
      });
      return;
    }

    if (data.locality === NewsLocalityTypes.City && !selectedCity) {
      setNotification({
        type: "error",
        message: "لطفاً شهر را انتخاب کنید",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setNotification(null);

      // Convert content blocks to API format
      const blocks = contentBlocks.map((block) => {
        const emptyGuid = "00000000-0000-0000-0000-000000000000";
        const apiBlock: any = {
          Id: emptyGuid,
          Type: block.type,
          Order: block.order,
        };

        // Only add the relevant field per block type
        if (block.type === NewsContentBlockType.Text && block.text) {
          apiBlock.Text = block.text;
        } else if (block.type === NewsContentBlockType.Image && block.imageFile) {
          apiBlock.ImageFile = block.imageFile;
        } else if (block.type === NewsContentBlockType.Video && block.videoFile) {
          apiBlock.VideoFile = block.videoFile;
        }

        return apiBlock;
      });

      // Format date to ISO string (datetime-local returns YYYY-MM-DDTHH:mm format)
      const dateTime = data.dateTime
        ? new Date(data.dateTime).toISOString()
        : new Date().toISOString();

      await createNews({
        Title: data.title,
        Slug: data.slug,
        ShortDescription: data.shortDescription,
        DateTime: dateTime,
        ThumbImage: selectedThumbImage,
        Type: data.type,
        Locality: data.locality,
        RelatedCityId: data.locality === NewsLocalityTypes.City ? selectedCity?.id || null : null,
        IsPinned: data.isPinned,
        Blocks: blocks,
      });

      setNotification({
        type: "success",
        message: "خبر با موفقیت ایجاد شد",
      });

      // Redirect to news list after a short delay
      setTimeout(() => {
        router.push("/dashboard/news-publisher/news");
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در ایجاد خبر";
      setNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!hasRole("NewsPublisher")) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-base font-semibold text-gray-900">ایجاد خبر جدید</h1>
          <p className="mt-2 text-sm text-gray-700">
            فرم زیر را پر کنید تا خبر جدیدی ایجاد شود.
          </p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* SECTION A - News General Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">اطلاعات عمومی خبر</h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              {/* Title */}
              <div className="sm:col-span-6">
                <Label htmlFor="title">عنوان *</Label>
                <div className="mt-2">
                  <Input
                    id="title"
                    type="text"
                    {...register("title", { required: "عنوان الزامی است" })}
                    className={errors.title ? "ring-red-600" : ""}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
              </div>

              {/* Slug */}
              <div className="sm:col-span-6">
                <Label htmlFor="slug">نامک (Slug)</Label>
                <div className="mt-2">
                <Input
                  id="slug"
                  type="text"
                  placeholder="به صورت خودکار از عنوان تولید می‌شود"
                  {...register("slug", {
                    onChange: () => {
                      setIsSlugManuallyEdited(true);
                    },
                  })}
                />
                </div>
              </div>

              {/* Short Description */}
              <div className="sm:col-span-6">
                <Label htmlFor="shortDescription">توضیحات کوتاه</Label>
                <div className="mt-2">
                  <textarea
                    id="shortDescription"
                    {...register("shortDescription")}
                    rows={4}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              {/* DateTime */}
              <div className="sm:col-span-3">
                <Label htmlFor="dateTime">تاریخ و زمان انتشار</Label>
                <div className="mt-2">
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    {...register("dateTime")}
                  />
                </div>
              </div>

              {/* Type */}
              <div className="sm:col-span-3">
                <Label htmlFor="type">نوع خبر *</Label>
                <div className="mt-2">
                  <Listbox
                    value={watch("type")}
                    onChange={(value) => setValue("type", value)}
                  >
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
                        <span className="block truncate">
                          {newsTypeLabels[watch("type")]}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                          <ChevronsUpDown aria-hidden={true} className="size-5 text-gray-400" />
                        </span>
                      </ListboxButton>
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {Object.values([NewsTypes.News, NewsTypes.Announcement]).map((type) => (
                          <ListboxOption
                            key={type}
                            value={type}
                            className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                  {newsTypeLabels[type]}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                                    <Check aria-hidden={true} className="size-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
              </div>

              {/* Locality */}
              <div className="sm:col-span-3">
                <Label htmlFor="locality">محدوده انتشار *</Label>
                <div className="mt-2">
                  <Listbox
                    value={watch("locality")}
                    onChange={(value) => {
                      setValue("locality", value);
                      if (value !== NewsLocalityTypes.City) {
                        setSelectedProvince(null);
                        setSelectedCity(null);
                        setValue("relatedCityId", "");
                      }
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
                        <span className="block truncate">
                          {localityLabels[watch("locality")]}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                          <ChevronsUpDown aria-hidden={true} className="size-5 text-gray-400" />
                        </span>
                      </ListboxButton>
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {Object.values(NewsLocalityTypes).map((locality) => (
                          <ListboxOption
                            key={locality}
                            value={locality}
                            className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                  {localityLabels[locality]}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                                    <Check aria-hidden={true} className="size-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
              </div>

              {/* RelatedCityId - Only visible if Locality === City */}
              {watchedLocality === NewsLocalityTypes.City && (
                <>
                  <div className="sm:col-span-3">
                    <Label htmlFor="province">استان</Label>
                    <div className="mt-2">
                      <Listbox
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        disabled={loadingProvinces}
                      >
                        <div className="relative">
                          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm/6">
                            <span className="block truncate">
                              {selectedProvince ? selectedProvince.name : "استان را انتخاب کنید"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                              <ChevronsUpDown aria-hidden={true} className="size-5 text-gray-400" />
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
                                        <Check aria-hidden={true} className="size-5" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      </Listbox>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label htmlFor="city">شهر *</Label>
                    <div className="mt-2">
                      <Listbox
                        value={selectedCity}
                        onChange={(city) => {
                          setSelectedCity(city);
                          setValue("relatedCityId", city?.id || "");
                        }}
                        disabled={!selectedProvince || loadingCities}
                      >
                        <div className="relative">
                          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm/6">
                            <span className="block truncate">
                              {selectedCity ? selectedCity.name : "شهر را انتخاب کنید"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                              <ChevronsUpDown aria-hidden={true} className="size-5 text-gray-400" />
                            </span>
                          </ListboxButton>
                          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {cities.map((city) => (
                              <ListboxOption
                                key={city.id}
                                value={city}
                                className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                      {city.name}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                                        <Check aria-hidden={true} className="size-5" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      </Listbox>
                      {watchedLocality === NewsLocalityTypes.City && !selectedCity && (
                        <p className="mt-1 text-sm text-red-600">لطفاً شهر را انتخاب کنید</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ThumbImage */}
              <div className="sm:col-span-6">
                <Label htmlFor="thumbImage">تصویر شاخص *</Label>
                <div className="mt-2">
                  <input
                    ref={thumbImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleThumbImageClick}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {selectedThumbImage ? "تغییر تصویر" : "انتخاب تصویر"}
                  </button>
                  {thumbImagePreview && (
                    <div className="mt-4">
                      <img
                        src={thumbImagePreview}
                        alt="Thumbnail preview"
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* IsPinned */}
              <div className="sm:col-span-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    {...register("isPinned")}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <Label htmlFor="isPinned" className="text-sm font-medium text-gray-900">
                    سنجاق کردن خبر
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B - Content Blocks */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <ContentBlockEditor
              blocks={contentBlocks}
              onBlocksChange={setContentBlocks}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-row-reverse gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "در حال ایجاد..." : "ایجاد خبر"}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/dashboard/news-publisher/news")}
              className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

