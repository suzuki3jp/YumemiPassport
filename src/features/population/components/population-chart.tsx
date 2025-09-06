"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";

type PopulationChartProps = {
  series: Array<{
    name: string;
    data: Array<{ x: number; y: number }>;
  }>;
};

export function PopulationChart({ series }: PopulationChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: "",
    },

    yAxis: {
      title: {
        text: "人口",
      },
    },

    xAxis: {
      title: { text: "年度" },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    series: series.map((s) => ({ ...s, type: "line" })),

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            xAxis: { title: { text: "" } },
            yAxis: { title: { text: "" } },
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );
}
