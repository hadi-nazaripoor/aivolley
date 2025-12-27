"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker/persian";
import { format } from "date-fns-jalali";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function toLatinDigits(str: string): string {
  const faNums = "۰۱۲۳۴۵۶۷۸۹";
  return str.replace(/[۰-۹]/g, (d) => String(faNums.indexOf(d)));
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

interface CalendarComponentProps {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  components?: Record<string, React.ComponentType<any>>;
  [key: string]: any;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: userComponents,
  ...props
}: CalendarComponentProps) {
  const defaultClassNames: Record<string, string> = {};

  const formatters = {
    formatDay: (date: Date) => {
      const dayStr = format(date, "d");
      return toLatinDigits(dayStr);
    },
  };

  const mergedClassNames: Record<string, string> = { ...defaultClassNames, ...classNames };

  const defaultComponents = {
    Chevron: (props: {
      className?: string;
      size?: number;
      disabled?: boolean;
      orientation?: "left" | "right" | "up" | "down";
    }) => {
      if (props.orientation === "left") {
        return <ChevronLeft size={16} {...props} aria-hidden="true" />;
      }
      return <ChevronRight size={16} {...props} aria-hidden="true" />;
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit", className)}
      classNames={mergedClassNames}
      components={mergedComponents}
      formatters={formatters}
      {...props}
    />
  );
}

interface DatePickerProps {
  className?: string;
  placeholder?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

function handleCalendarChange(
  _value: string | number,
  _e: React.ChangeEventHandler<HTMLSelectElement>
) {
  const _event = {
    target: {
      value: String(_value),
    },
  } as React.ChangeEvent<HTMLSelectElement>;
  _e(_event);
}

export default function DatePicker({ className, placeholder = "انتخاب تاریخ", value, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value || undefined);
  const [month, setMonth] = React.useState<Date>(() => value || new Date());
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const popoverRef = React.useRef<{ close: () => void } | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (value !== undefined) {
      setDate(value || undefined);
      // Update month to show the selected date's month
      if (value) {
        setMonth(value);
      }
    }
  }, [value]);

  // Update month when popup opens to show selected date's month or current month
  React.useEffect(() => {
    if (isOpen) {
      if (date) {
        setMonth(date);
      } else {
        setMonth(new Date());
      }
    }
  }, [isOpen, date]);

  const handleDateChange = (newDate: Date | undefined) => {
    // Don't clear if selecting the same date
    if (newDate && date && newDate.getTime() === date.getTime()) {
      return;
    }
    setDate(newDate);
    if (onChange) {
      onChange(newDate || null);
    }
    // Close popover after selection
    if (popoverRef.current) {
      popoverRef.current.close();
    }
  };

  const calendarContent = (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateChange}
      month={month}
      onMonthChange={setMonth}
      className="rounded-md w-full"
      classNames={{
        root: "w-fit", 
        months: "flex gap-4 flex-col md:flex-row relative",
        month: "flex flex-col w-full gap-4", 
        nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
        button_previous: "size-8 aria-disabled:opacity-50 p-0 select-none",
        button_next: "size-8 aria-disabled:opacity-50 p-0 select-none",
        month_caption: "flex items-center justify-center h-8 w-full px-2",
        dropdowns: "w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5",
        dropdown_root: "relative focus-within:border-indigo-600 border border-gray-300 dark:border-gray-600 shadow-sm focus-within:ring-indigo-600/50 focus-within:ring-2 rounded-md",
        dropdown: "absolute inset-0 opacity-0", 
        caption_label: "select-none font-medium rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-gray-500 dark:[&>svg]:text-gray-400 [&>svg]:size-3.5",
        table: "w-full border-collapse",
        weekdays: "flex py-2 rounded-md bg-gray-100", 
        weekday: "text-sm text-center text-gray-600 flex justify-center dark:text-gray-400 rounded-md flex-1 font-normal select-none",
        week: "flex w-full my-0", 
        week_number_header: "select-none w-8",
        week_number: "text-[0.8rem] select-none text-gray-500 dark:text-gray-400",
        day: "relative w-full h-full p-0 text-center text-sm rounded-md group/day aspect-square hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 flex justify-center items-center data-[selected=true]:bg-indigo-600 dark:data-[selected=true]:bg-indigo-600 data-[selected=true]:text-white data-[selected=true]:font-semibold data-[selected=true]:hover:bg-indigo-700 dark:data-[selected=true]:hover:bg-indigo-500 [&>button]:w-full [&>button]:h-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:cursor-pointer [&>button]:rounded-md",
        today: "bg-gray-100 dark:bg-gray-800 text-indigo-900 dark:text-indigo-100 rounded-md data-[selected=true]:bg-indigo-600 data-[selected=true]:text-white data-[selected=true]:rounded-md",
        outside: "text-gray-500 dark:text-gray-400 aria-selected:text-gray-500 dark:aria-selected:text-gray-400",
        disabled: "text-gray-500 dark:text-gray-400 opacity-50 [&>button]:cursor-not-allowed [&>button]:pointer-events-none"
      }}
      captionLayout="dropdown"
      startMonth={new Date(1980, 6)}
      hideNavigation
      components={{
        DropdownNav: (props: any) => {
          return <div className="grid grid-cols-2 gap-2 w-full">{props.children}</div>;
        },
        Dropdown: (props: any) => {
          // Check if this is a month dropdown by checking if options are month numbers (0-11, 0-based)
          const isMonthDropdown = props.options?.some((opt: any) => {
            const val = Number(opt.value);
            return val >= 0 && val <= 11;
          });

          // Filter and deduplicate month options to ensure exactly 12 months (0-11)
          const getMonthOptions = () => {
            if (!isMonthDropdown || !props.options) return props.options;
            
            // Create a map to track seen months and ensure uniqueness
            const seen = new Set<number>();
            const validOptions: any[] = [];
            
            // First, collect all valid month options (0-11) in order
            for (let month = 0; month <= 11; month++) {
              const option = props.options.find((opt: any) => Number(opt.value) === month);
              if (option && !seen.has(month)) {
                seen.add(month);
                validOptions.push(option);
              }
            }
            
            // If we still have gaps, add any remaining valid options
            props.options.forEach((opt: any) => {
              const val = Number(opt.value);
              if (val >= 0 && val <= 11 && !seen.has(val)) {
                seen.add(val);
                validOptions.push(opt);
              }
            });
            
            // Sort by value to ensure correct order
            return validOptions.sort((a, b) => Number(a.value) - Number(b.value));
          };

          const monthOptions = isMonthDropdown ? getMonthOptions() : props.options;

          // Get current display label (react-day-picker uses 0-based month indexes)
          const getDisplayLabel = () => {
            if (isMonthDropdown && props.value !== undefined && props.value !== null) {
              const monthIndex = Number(props.value);
              if (monthIndex >= 0 && monthIndex < PERSIAN_MONTHS.length) {
                return PERSIAN_MONTHS[monthIndex];
              }
            }
            return props.label || String(props.value);
          };

          // Get option display label (react-day-picker uses 0-based month indexes)
          const getOptionLabel = (option: any) => {
            if (isMonthDropdown) {
              const monthIndex = Number(option.value);
              if (monthIndex >= 0 && monthIndex < PERSIAN_MONTHS.length) {
                return PERSIAN_MONTHS[monthIndex];
              }
            }
            return option.label;
          };

          return (
            <div className="relative w-full">
              <Listbox
                value={String(props.value)}
                onChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}
              >
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white dark:bg-gray-800 py-1.5 pr-2 pl-3 text-right text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6">
                  <span className="col-start-1 row-start-1 truncate pr-6">{getDisplayLabel()}</span>
                  <ChevronsUpDown
                    aria-hidden="true"
                    className="col-start-1 row-start-1 size-5 self-center justify-self-start text-gray-500 dark:text-gray-400 sm:size-4"
                  />
                </ListboxButton>
                <ListboxOptions
                  transition
                  className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base ring-1 shadow-lg ring-black/5 dark:ring-gray-700 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                  {monthOptions?.map((option: any) => (
                    <ListboxOption
                      key={option.value}
                      value={String(option.value)}
                      disabled={option.disabled}
                      className="group relative cursor-default py-2 pr-8 pl-4 text-gray-900 dark:text-gray-100 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                    >
                      <span className="block truncate font-normal group-data-selected:font-semibold">
                        {getOptionLabel(option)}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-1.5 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                        <Check aria-hidden="true" className="size-5" />
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </div>
          );
        },
      }}
    />
  );

  const portalRef = React.useRef<HTMLDivElement | null>(null);
  const openRef = React.useRef(false);

  // Create portal container on mount
  React.useEffect(() => {
    if (!mounted) return;

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
    portalRef.current = container;

    return () => {
      if (container.parentNode) {
        container.remove();
      }
      portalRef.current = null;
    };
  }, [mounted]);

  // Update portal position when open state changes
  React.useEffect(() => {
    if (!openRef.current || !portalRef.current || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current || !portalRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      portalRef.current.style.top = `${rect.bottom + 8}px`;
      portalRef.current.style.left = `${rect.left}px`;
      portalRef.current.style.width = `${rect.width}px`;
    };

    updatePosition();
    const intervalId = setInterval(updatePosition, 100);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [mounted]);

  return (
    <div className={cn("relative", className)}>
      <Popover>
        {({ open, close }) => {
          // Store close function for date selection handler
          popoverRef.current = { close };

          // Update ref for position tracking
          openRef.current = open;
          setIsOpen(open);

          // Update position immediately when open changes
          if (open && portalRef.current && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            portalRef.current.style.top = `${rect.bottom + 8}px`;
            portalRef.current.style.left = `${rect.left}px`;
            portalRef.current.style.width = `${rect.width}px`;
          }

          return (
            <>
              <PopoverButton 
                ref={buttonRef}
                className="flex w-full items-center justify-between rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
              >
                <span className={cn("truncate text-right", !date && "text-gray-400 dark:text-gray-500")}>
                  {date ? format(date, "yyyy/MM/dd") : placeholder}
                </span>
                <CalendarIcon
                  className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </PopoverButton>
              {mounted && open && portalRef.current && createPortal(
                <PopoverPanel
                  transition
                  static
                  className="w-full max-w-full origin-top-end rounded-md bg-white dark:bg-gray-800 p-2 ring-1 shadow-lg ring-gray-900/5 dark:ring-gray-700 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[closed]:hidden data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in rtl:origin-top-start"
                  style={{ maxHeight: '90vh', overflowY: 'auto' }}
                >
                  {calendarContent}
                </PopoverPanel>,
                portalRef.current
              )}
            </>
          );
        }}
      </Popover>
    </div>
  );
}

export { Calendar };
