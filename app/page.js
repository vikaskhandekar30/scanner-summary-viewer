"use client";
import { useState } from "react";

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/yahoo?ticker=${ticker}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

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
            <h3>Price Chart</h3>
            <canvas id="chart"></canvas>
          </div>
        </div>
      )}
    </div>
  );
}

