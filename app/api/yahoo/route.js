import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const range = searchParams.get("range") || "1mo";

  if (!ticker) {
    return new NextResponse(
      JSON.stringify({ error: "Ticker is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
        }
      }
    );
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    const result = json.chart?.result?.[0];
    if (!result) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ticker" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
          }
        }
      );
    }

    const timestamps = result.timestamp || [];
    const prices = result.indicators?.quote?.[0]?.close || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];

    const dates = timestamps.map((t) =>
      new Date(t * 1000).toLocaleDateString("en-GB")
    );

    const payload = {
      symbol: ticker,
      price: prices[prices.length - 1],
      change: null,
      summary: "Price data loaded",
      chartData: {
        dates,
        prices,
        volumes
      }
    };

    return new NextResponse(JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });

  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
        }
      }
    );
  }
}
