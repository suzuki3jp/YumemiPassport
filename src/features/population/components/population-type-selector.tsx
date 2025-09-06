"use client";

import { useId } from "react";
import {
  usePopulationTypes,
  useSetPopulationTypes,
} from "../contexts/population-types";

export function PopulationTypeSelector() {
  const populationTypes = usePopulationTypes();
  const selectedPopulationType = populationTypes?.selected;
  const setPopulationTypes = useSetPopulationTypes();

  const selectId = useId();

  const setSelectedPopulationType = (type: string) => {
    if (!populationTypes) return;
    setPopulationTypes({ ...populationTypes, selected: type });
  };

  if (!populationTypes || !selectedPopulationType) {
    return null; // TODO: エラーをスローして error boundary でキャッチするようにする
  }

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={selectId} className="font-medium text-gray-700 text-sm">
        人口区分:
      </label>
      <select
        id={selectId}
        value={selectedPopulationType}
        onChange={(e) => setSelectedPopulationType(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {populationTypes.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
