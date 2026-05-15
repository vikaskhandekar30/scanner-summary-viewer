"use client";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [timeframe, setTimeframe] = useState("1mo"); // default
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/yahoo?ticker=${ticker}&range=${timeframe}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    if (!data || !data.chartData) return;

    const ctx = document.getElementById("chart");

    // Destroy old chart if it exists
    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.chartData.dates,
        datasets: [
          {
            label: `${ticker} Price`,
            data: data.chartData.prices,
            borderColor: "#4CAF50",
            borderWidth: 2,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true },
          y: { display: true },
        },
      },
    });
  }, [data]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "20px" }}>Scanner Summary Viewer</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter ticker (AAPL, MSFT, TSLA)"
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "250px",
            marginRight: "10px",
          }}
        />

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        >
          <option value="1d">1 Day</option>
          <option value="5d">5 Days</option>
          <option value="1mo">1 Month</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="max">Max</option>
        </select>

        <button
          onClick={fetchData}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Get Summary
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {data && (
        <div style={{ marginTop: "30px" }}>
          <h2>{data.symbol}</h2>
          <p>Price: {data.price}</p>
          <p>Change: {data.change}</p>
          <p>Summary: {data.summary}</p>

          <div style={{ marginTop: "40px" }}>
            <h3>Price Chart ({timeframe})</h3>
            <canvas id="chart"></canvas>
          </div>
        </div>
      )}
    </div>
  );
}
