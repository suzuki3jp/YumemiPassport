"use client";
import { PopulationChartContainer } from "@/features/population/components/population-chart-container";
import { PopulationTypeSelector } from "@/features/population/components/population-type-selector";
import { PopulationTypesProvider } from "@/features/population/contexts/population-types";

export function PopulationSection() {
  return (
    <section className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <PopulationTypesProvider>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700 text-lg">人口推移</h2>
          <PopulationTypeSelector />
        </div>

        <PopulationChartContainer />
      </PopulationTypesProvider>
    </section>
  );
}
