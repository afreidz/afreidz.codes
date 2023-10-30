<script lang="ts">
  import colors from "tailwindcss/colors";
  import Chart, { type ChartTypeRegistry } from "chart.js/auto";

  let chart;
  let canvas: HTMLCanvasElement;

  const colorPalette = [
    colors.indigo[500],
    colors.rose[500],
    colors.amber[500],
    colors.violet[500],
    colors.fuchsia[500],
  ];

  type $$Props = {
    labels: string[];
    values: number[];
    type: keyof ChartTypeRegistry;
  };

  const doughnutOpts = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: false,
  };

  const doughnutDatasetOpts = {
    borderWidth: 0,
    backgroundColor: colorPalette,
    hoverBackgroundColor: colorPalette,
  };

  const radarOpts = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: false,
    scales: {
      r: {
        grid: {
          circular: true,
          color: "rgba(255,255,255,0.1)",
          tickBorderDash: [20, 20],
        },
        angleLines: {
          color: "rgba(255,255,255,0.1)",
        },
        pointLabels: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const radarDatasetOpts = {
    fill: true,
    borderWidth: 1,
    pointRadius: 10,
    pointHitRadius: 10,
    pointBorderWidth: 0,
    pointHoverRadius: 10,
    pointHoverBorderWidth: 0,
    borderColor: "rgba(255,255,255,1)",
    pointBackgroundColor: colorPalette,
    pointHoverBackgroundColor: colorPalette,
    backgroundColor: "rgba(255,255,255,0.3)",
  };

  $: if (labels && values && canvas && type) {
    const options =
      type === "radar" ? radarOpts : type === "doughnut" ? doughnutOpts : {};
    const datasetOpts =
      type === "radar"
        ? radarDatasetOpts
        : type === "doughnut"
        ? doughnutDatasetOpts
        : {};

    chart = new Chart(canvas, {
      type,
      options,
      data: {
        labels,
        datasets: [
          {
            data: values,
            ...datasetOpts,
          },
        ],
      },
    });
  }

  export let labels: $$Props["labels"];
  export let values: $$Props["values"];
  export let type: $$Props["type"] = "radar";
</script>

<section class="flex-1 w-full">
  <slot name="heading" />
  <div
    class="flex w-full flex-col border border-default-100/10 p-8 gap-2 bg-gradient-to-b from-default-100/5 to-transparent rounded-md font-mono"
  >
    <div class="relative m-auto w-full max-w-xs">
      <canvas bind:this={canvas} />
    </div>
    <ul>
      {#each labels as feeling, i}
        <li
          class="px-4 py-3 border-b border-default-100/10 font-semibold flex justify-between last-of-type:border-b-0"
        >
          <span class="flex gap-4 items-center">
            <i
              class="rounded-full w-3 h-3"
              style="background-color: {colorPalette[i]}"
            />
            {feeling}
          </span>
          <strong>{values[i]}</strong>
        </li>
      {/each}
    </ul>
  </div>
</section>
