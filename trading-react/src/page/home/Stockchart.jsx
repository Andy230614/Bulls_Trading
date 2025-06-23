import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button } from "@/components/ui/button";
import { fetchMarketChart } from '../../state/Coin/Action';
import { useDispatch, useSelector } from 'react-redux';

const timeSeries = [
  { keyword: "DIGITAL_CURRENCY_DAILY", key: "Time Series (Daily)", lable: "1 day", value: 1 },
  { keyword: "DIGITAL_CURRENCY_WEEKLY", key: "Weekly Time Series", lable: "1 week", value: 7 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY", key: "Monthly Time Series", lable: "1 Month", value: 30 },
  { keyword: "DIGITAL_CURRENCY_YEARLY", key: "Yearly Time Series", lable: "1 Year", value: 365 },
];

const Stockchart = ({ coinId }) => {
  const dispatch = useDispatch();

  const chartData = useSelector((state) => state.coin?.marketChart?.data || []);
  const isLoading = useSelector((state) => state.coin.marketChart?.loading);

  const [activeLable, setActiveLable] = useState(timeSeries[0].lable);

  useEffect(() => {
    const activeSeries = timeSeries.find((ts) => ts.lable === activeLable);
    const days = activeSeries?.value || 30;

    if (coinId) {
      dispatch(fetchMarketChart({
        coinId,
        days,
        jwt: localStorage.getItem("jwt"),
      }));
    }
  }, [dispatch, coinId, activeLable]);

  const series = [
    {
      name: `${coinId} Price`,
      data: chartData, // Format: [{ x: timestamp, y: price }]
    },
  ];

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 450,
      zoom: { autoScaleYaxis: true },
    },
    noData: {
      text: 'Loading or no data available',
      align: 'center',
      verticalAlign: 'middle',
      style: { color: '#999', fontSize: '14px' },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
    },
    colors: ["#758AA2"],
    markers: {
      colors: ["#fff"],
      strokeColor: "#fff",
      strokeWidth: 1,
      size: 0,
      style: "hollow",
    },
    tooltip: {
      theme: "dark",
      marker: { show: false },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#47535E",
      strokeDashArray: 4,
      show: true,
    },
  };

  return (
    <div>
      <div className="space-x-3 mb-3">
        {timeSeries.map((item) => (
          <Button
            key={item.lable}
            variant={activeLable === item.lable ? "default" : "outline"}
            onClick={() => setActiveLable(item.lable)}
          >
            {item.lable}
          </Button>
        ))}
      </div>

      <div id="chart-timelines">
        {isLoading ? (
          <div className="text-center text-gray-500 mt-10">Loading chart data...</div>
        ) : (
          <ReactApexChart options={options} series={series} height={450} />
        )}
      </div>
    </div>
  );
};

export default Stockchart;
