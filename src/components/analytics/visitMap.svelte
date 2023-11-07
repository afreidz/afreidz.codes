<script lang="ts">
  import { onMount } from "svelte";
  import { Chart } from "chart.js";
  import colors from "tailwindcss/colors";
  import * as ChartGeo from "chartjs-chart-geo";
  import { BubbleMapChart } from "chartjs-chart-geo";

  type Visit = {
    id: string;
    date: Date;
    slug: string;
    flag: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };

  type CityCount = {
    [key: string]: number;
  };

  type MapData = {
    city: string;
    flag: string;
    value: number;
    latitude: number;
    longitude: number;
  };

  type LatLongMap = {
    [key: string]: {
      latitude: number;
      longitude: number;
      city: string;
      flag: string;
    };
  };

  let limit = 10;
  let chart: Chart;
  let data: MapData[] = [];
  let canvas: HTMLCanvasElement;
  let countries: ChartGeo.Feature;
  let projection: ChartGeo.IProjectionScaleOptions["projection"] =
    "equirectangular";

  onMount(async () => {
    const { visits }: { visits: Visit[] } = await (
      await fetch(`/api/analytics`)
    ).json();

    const topodata = await (
      await fetch("https://unpkg.com/world-atlas/countries-50m.json")
    ).json();

    countries = ChartGeo.topojson.feature(
      topodata as any,
      topodata.objects.countries as any,
    );

    const counts = visits.reduce((all, visit) => {
      all[visit.city] = ++all[visit.city] || 1;
      return all;
    }, {} as CityCount);

    const latlongMap = visits.reduce((all, visit) => {
      all[visit.city] = all[visit.city] || {
        latitude: +visit.latitude,
        longitude: +visit.longitude,
        city: visit.city,
        flag: visit.flag,
      };
      return all;
    }, {} as LatLongMap);

    data = Object.entries(latlongMap)
      .map(([city, { latitude, longitude, flag }]) => ({
        city,
        flag,
        latitude,
        longitude,
        value: counts[city],
      }))
      .sort((a, b) => b.value - a.value);
  });

  $: if (data && canvas && countries && projection) {
    if (chart) chart.destroy();
    chart = new BubbleMapChart(canvas, {
      data: {
        datasets: [
          {
            graticuleBorderColor: "rgba(255, 255, 255, 0.03)",
            outlineBorderColor: "rgba(255, 255, 255, 0.1)",
            hoverBackgroundColor: colors.violet[500],
            backgroundColor: colors.violet[500],
            outline: countries.features,
            hoverBorderWidth: 0,
            showOutline: true,
            animation: false,
            borderWidth: 0,
            hitRadius: 0,
            data,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(255,255,255, 0.1)",
            borderColor: "rgba(0,0,0,0)",
            bodyColor: colors.white,
            displayColors: false,
            animation: false,
            boxPadding: 0,
            boxHeight: 0,
            boxWidth: 0,
            padding: 8,
            bodyFont: {
              size: 14,
              weight: "bold",
            },
            callbacks: {
              label(context) {
                const data = context.raw as MapData;
                return `${data.flag} ${data.city.replaceAll("  ", " ")} - ${
                  data.value
                }`;
              },
            },
          },
        },
        scales: {
          projection: {
            axis: "x",
            projection,
          },
          size: {
            axis: "r",
            display: false,
          },
        },
      },
    });
  }

  let classList: string = "";
  export { classList as class, limit };
</script>

{#if data.length}
  <section class={classList}>
    <div class="flex justify-between items-end">
      <slot name="heading" />
      <div class="my-4 flex gap-4">
        <button
          class="px-3 py-2 rounded-md border border-default-100/10 font-mono font-bold text-center"
          on:click={() => (projection = "albersUsa")}
          class:opacity-50={projection !== "albersUsa"}
          style="color: {colors.indigo[500]}; ">USA</button
        >
        <button
          class="px-3 py-2 rounded-md border border-default-100/10 font-mono font-bold text-center"
          on:click={() => (projection = "equirectangular")}
          class:opacity-50={projection !== "equirectangular"}
          style="color: {colors.amber[500]}; ">Global</button
        >
      </div>
    </div>
    <div
      class="flex w-full flex-col border border-default-100/10 p-8 gap-2 bg-gradient-to-b from-default-100/5 to-transparent rounded-md font-mono"
    >
      <div class="relative m-auto w-full">
        <canvas bind:this={canvas} />
      </div>
      <ul class="text-sm lg:text-base">
        {#each data.slice(0, limit) as visit, i}
          <li
            class="border-b border-default-100/10 font-semibold last-of-type:border-b-0 flex justify-between items-center px-4 py-3"
          >
            <span>
              {visit.flag}
              {visit.city}
            </span>
            <strong>{visit.value}</strong>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}
