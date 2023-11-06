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

  let chart: Chart;
  let data: MapData[] = [];
  let canvas: HTMLCanvasElement;
  let countries: ChartGeo.Feature;

  onMount(async () => {
    const { visits }: { visits: Visit[] } = await (
      await fetch("/api/analytics")
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

  $: if (data && canvas && countries) {
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
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          projection: {
            axis: "x",
            projection: "equirectangular",
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
  export { classList as class };
</script>

{#if data.length}
  <section class={classList}>
    <slot name="heading" />
    <div
      class="flex w-full flex-col border border-default-100/10 p-8 gap-2 bg-gradient-to-b from-default-100/5 to-transparent rounded-md font-mono"
    >
      <div class="relative m-auto w-full">
        <canvas bind:this={canvas} />
      </div>
      <ul>
        {#each data.slice(0, 10) as visit, i}
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
