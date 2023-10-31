<script lang="ts">
  import Chart, {
    type ChartOptions,
    type ChartTypeRegistry,
    type Chart as ChartType,
  } from "chart.js/auto";
  import colors from "tailwindcss/colors";

  Chart.defaults.font.family = "'IBM Plex Mono', monospace";

  let chart: ChartType;
  let canvas: HTMLCanvasElement;
  let chartOptions: ChartOptions;
  let enabledDatasets: (string | number)[];
  let datasetOptions: { [key: string]: unknown } | null;

  type $$Props = {
    class: string;
    labels: string[];
    values: number[] | undefined;
    type: keyof ChartTypeRegistry;
    datasets: { label: string | number; data: number[] }[] | undefined;
  };

  let labels: $$Props["labels"];
  let type: $$Props["type"] = "radar";
  let classList: $$Props["class"] = "";
  let values: $$Props["values"] = undefined;
  let datasets: $$Props["datasets"] = undefined;

  export { labels, type, values, datasets, classList as class };

  const colorPalette = [
    colors.indigo[500],
    colors.rose[500],
    colors.amber[500],
    colors.violet[500],
    colors.fuchsia[500],
  ];

  const doughnutOpts: ChartOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: false,
  };

  const doughnutDatasetOpts = {
    borderWidth: 0,
    backgroundColor: colorPalette,
    hoverBackgroundColor: colorPalette,
  };

  const radarOpts: (m: number) => ChartOptions = (max) => ({
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: false,
    scales: {
      r: {
        grid: {
          circular: true,
          color: "rgba(255,255,255,0.1)",
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
        suggestedMin: 0,
        suggestedMax: max,
      },
    },
  });

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

  const lineOpts: (m: number) => ChartOptions = (max) => ({
    plugins: {
      tooltip: { enabled: false },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        alignToPixels: true,
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        ticks: {
          precision: 0,
        },
        border: { display: false },
        title: {
          font: {
            color: "rgba(255,255,255,1)",
            weight: "bold",
          },
        },
        suggestedMin: 0,
        suggestedMax: max,
      },
      x: {
        grid: {
          color: "rgba(255,255,255,0)",
        },
        title: {
          font: {
            color: "rgba(255,255,255,1)",
            weight: "bold",
          },
        },
      },
    },
  });

  const lineDatasetOpts = {
    tension: 0,
    hitRadius: 0,
    borderWidth: 2,
    pointRadius: 5,
    animation: false,
    pointHitRadius: 5,
    pointBorderWidth: 2,
    pointHoverRadius: 5,
    hitPointBorderWidth: 2,
    hoverPointBorderWidth: 2,
    pointBackgroundColor: colors.slate[950],
  };

  $: if (labels && (values || datasets) && canvas && type) {
    chartOptions =
      type === "radar"
        ? radarOpts((values?.[0] ?? 0) + 1)
        : type === "doughnut"
        ? doughnutOpts
        : type === "line"
        ? lineOpts(
            values
              ? Math.max(...values)
              : datasets
              ? Math.max(...datasets.map((d) => d.data).flat(2))
              : 10,
          )
        : {};

    if (datasets) enabledDatasets = datasets.map((d) => d.label);

    datasetOptions =
      type === "radar"
        ? radarDatasetOpts
        : type === "doughnut"
        ? doughnutDatasetOpts
        : type === "line"
        ? lineDatasetOpts
        : null;

    createChart(datasetOptions, chartOptions);
  }

  function createChart(
    datasetOpts: typeof datasetOptions,
    options: ChartOptions,
  ) {
    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type,
      options,
      data: {
        labels,
        datasets: values
          ? [
              {
                data: values,
                ...datasetOpts,
              },
            ]
          : datasets
          ? datasets
              .filter((d) => enabledDatasets.includes(d.label))
              .map((d) => ({
                data: d.data,
                label: d.label.toString(),
                ...datasetOpts,
                borderColor: colorPalette[datasets?.indexOf(d) ?? 0],
              }))
          : [],
      },
    });
  }

  function toggleDataset(s: string | number) {
    const set = new Set(enabledDatasets);

    if (set.has(s)) {
      set.delete(s);
    } else {
      set.add(s);
    }

    enabledDatasets = Array.from(set);
    createChart(datasetOptions, chartOptions);
  }
</script>

<section class={classList}>
  <slot name="heading" />
  <div
    class="flex w-full flex-col border border-default-100/10 p-8 gap-2 bg-gradient-to-b from-default-100/5 to-transparent rounded-md font-mono"
  >
    <div class="relative m-auto w-full">
      <canvas bind:this={canvas} />
    </div>
    {#if values}
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
    {/if}
  </div>
  {#if datasets?.length}
    <div class="flex gap-4 my-3 text-sm">
      {#each datasets as dataset, i}
        <button
          class="px-3 py-2 rounded-md border border-default-100/10 font-mono font-bold text-center"
          on:click={() => toggleDataset(dataset.label)}
          class:opacity-50={!enabledDatasets?.includes(dataset.label)}
          style="color: {colorPalette[i]}; ">{dataset.label}</button
        >
      {/each}
    </div>
  {/if}
</section>
