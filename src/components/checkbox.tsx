"use client";
import { useState } from "react";

interface CheckboxProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  title: string;
}

export function Checkbox({
  defaultChecked = false,
  onChange,
  title,
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center space-x-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          setIsChecked(!isChecked);
          onChange?.(!isChecked);
        }}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-gray-700 text-sm">{title}</span>
    </label>
  );
}
