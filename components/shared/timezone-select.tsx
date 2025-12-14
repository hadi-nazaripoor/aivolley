"use client";

import { useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const timezones = [
  { id: 1, name: "تهران (GMT+3:30)" },
  { id: 2, name: "اصفهان (GMT+3:30)" },
  { id: 3, name: "مشهد (GMT+3:30)" },
  { id: 4, name: "شیراز (GMT+3:30)" },
  { id: 5, name: "تبریز (GMT+3:30)" },
  { id: 6, name: "کرمان (GMT+3:30)" },
  { id: 7, name: "اهواز (GMT+3:30)" },
  { id: 8, name: "رشت (GMT+3:30)" },
];

interface TimezoneSelectProps {
  value?: { id: number; name: string };
  onChange?: (value: { id: number; name: string }) => void;
  label?: string;
  className?: string;
}

export function TimezoneSelect({
  value,
  onChange,
  label = "منطقه زمانی",
  className,
}: TimezoneSelectProps) {
  const [selected, setSelected] = useState(value || timezones[0]);

  const handleChange = (newValue: { id: number; name: string }) => {
    setSelected(newValue);
    onChange?.(newValue);
  };

  return (
    <Listbox value={selected} onChange={handleChange} className={className}>
      <Label className="block text-sm/6 font-medium text-gray-900">{label}</Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-right text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 truncate pr-6">{selected.name}</span>
          <ChevronsUpDown
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-start text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {timezones.map((timezone) => (
            <ListboxOption
              key={timezone.id}
              value={timezone}
              className="group relative cursor-default py-2 pr-8 pl-4 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
            >
              <span className="block truncate font-normal group-data-selected:font-semibold">
                {timezone.name}
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

