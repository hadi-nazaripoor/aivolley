"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, X, FileText, Image as ImageIcon, Video } from "lucide-react";
import { NewsContentBlockType } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";

export interface ContentBlock {
  id: string;
  type: NewsContentBlockType;
  order: number;
  text?: string;
  imageFile?: File | null;
  videoFile?: File | null;
  imagePreview?: string;
  videoPreview?: string;
}

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
}

const blockTypeOptions = [
  { value: NewsContentBlockType.Text, label: "متن", icon: FileText },
  { value: NewsContentBlockType.Image, label: "تصویر", icon: ImageIcon },
  { value: NewsContentBlockType.Video, label: "ویدیو", icon: Video },
];

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function ContentBlockEditor({ blocks, onBlocksChange }: ContentBlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBlock = (type: NewsContentBlockType) => {
    const newBlock: ContentBlock = {
      id: generateBlockId(),
      type,
      order: blocks.length,
      text: type === NewsContentBlockType.Text ? "" : undefined,
      imageFile: null,
      videoFile: null,
    };
    onBlocksChange([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const removeBlock = (blockId: string) => {
    const updatedBlocks = blocks
      .filter((b) => b.id !== blockId)
      .map((b, index) => ({ ...b, order: index }));
    onBlocksChange(updatedBlocks);
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const updatedBlocks = [...blocks];
    [updatedBlocks[index], updatedBlocks[newIndex]] = [
      updatedBlocks[newIndex],
      updatedBlocks[index],
    ];
    
    // Update orders
    updatedBlocks.forEach((b, i) => {
      b.order = i;
    });

    onBlocksChange(updatedBlocks);
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map((b) =>
      b.id === blockId ? { ...b, ...updates } : b
    );
    onBlocksChange(updatedBlocks);
  };

  const handleFileChange = (
    blockId: string,
    file: File | null,
    type: "image" | "video"
  ) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    if (type === "image") {
      const preview = file ? URL.createObjectURL(file) : undefined;
      updateBlock(blockId, {
        imageFile: file,
        imagePreview: preview,
        videoFile: null,
        videoPreview: undefined,
      });
    } else {
      const preview = file ? URL.createObjectURL(file) : undefined;
      updateBlock(blockId, {
        videoFile: file,
        videoPreview: preview,
        imageFile: null,
        imagePreview: undefined,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">بلاک‌های محتوا</h3>
        <div className="relative">
          <Listbox value={null} onChange={(value) => value && addBlock(value)}>
            <ListboxButton
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="relative w-full cursor-default rounded-md bg-white py-2 pr-3 pl-10 text-right text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
            >
              <span className="block truncate">افزودن بلاک جدید</span>
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <ChevronsUpDown aria-hidden={true} className="size-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {blockTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    className="relative cursor-default select-none py-2 pr-10 pl-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                            {option.label}
                          </span>
                        </div>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 data-[focus]:text-white">
                            <Check aria-hidden={true} className="size-5" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </Listbox>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          هیچ بلاکی اضافه نشده است. برای شروع، یک بلاک جدید اضافه کنید.
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    بلاک {index + 1} - {blockTypeOptions.find((o) => o.value === block.type)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveBlock(block.id, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="جابجایی به بالا"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(block.id, "down")}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="جابجایی به پایین"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="حذف بلاک"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {block.type === NewsContentBlockType.Text && (
                <div>
                  <Label htmlFor={`block-${block.id}-text`}>متن</Label>
                  <textarea
                    id={`block-${block.id}-text`}
                    value={block.text || ""}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    rows={6}
                    className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              )}

              {block.type === NewsContentBlockType.Image && (
                <div>
                  <Label htmlFor={`block-${block.id}-image`}>تصویر</Label>
                  <div className="mt-2">
                    <input
                      id={`block-${block.id}-image`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(block.id, file, "image");
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`block-${block.id}-image`}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                    >
                      {block.imageFile ? "تغییر تصویر" : "انتخاب تصویر"}
                    </label>
                    {block.imagePreview && (
                      <div className="mt-4">
                        <img
                          src={block.imagePreview}
                          alt="Preview"
                          className="h-48 w-full rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {block.type === NewsContentBlockType.Video && (
                <div>
                  <Label htmlFor={`block-${block.id}-video`}>ویدیو</Label>
                  <div className="mt-2">
                    <input
                      id={`block-${block.id}-video`}
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(block.id, file, "video");
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`block-${block.id}-video`}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                    >
                      {block.videoFile ? "تغییر ویدیو" : "انتخاب ویدیو"}
                    </label>
                    {block.videoFile && (
                      <div className="mt-4 text-sm text-gray-500">
                        فایل انتخاب شده: {block.videoFile.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

