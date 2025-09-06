"use client";

import { useId } from "react";

import {
  usePopulationTypes,
  useSetPopulationTypes,
} from "../contexts/population-types";

export function PopulationTypeSelector() {
  const selectId = useId();
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={selectId} className="font-medium text-gray-700 text-sm">
        人口区分:
      </label>
      <PopulationTypeSelectMenu id={selectId} />
    </div>
  );
}

function PopulationTypeSelectMenu({ id }: { id: string }) {
  const populationTypes = usePopulationTypes();
  const selectedPopulationType = populationTypes?.selected;
  const setPopulationTypes = useSetPopulationTypes();

  if (!populationTypes || !selectedPopulationType) {
    return (
      <div className="h-7 w-30 rounded border border-gray-200 bg-gray-50 p-2" /> // キャッシュにまだデータがない場合のスケルトン
    );
  }

  const setSelectedPopulationType = (type: string) => {
    setPopulationTypes({ ...populationTypes, selected: type });
  };

  return (
    <select
      id={id}
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
  );
}
