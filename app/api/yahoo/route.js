import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const range = searchParams.get("range") || "1mo";

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`;

  const res = await fetch(url);
  const json = await res.json();

  const result = json.chart.result?.[0];

  if (!result) {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }

  const timestamps = result.timestamp || [];
  const prices = result.indicators.quote[0].close || [];

  const dates = timestamps.map((t) =>
    new Date(t * 1000).toLocaleDateString("en-GB")
  );

  return NextResponse.json({
    symbol: ticker,
    price: prices[prices.length - 1],
    change: null,
    summary: "Price data loaded",
    chartData: {
      dates,
      prices,
    },
  });
}
