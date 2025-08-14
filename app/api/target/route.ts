export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker');
  
    if (!ticker) {
      return new Response(JSON.stringify({ error: 'Missing ticker' }), { status: 400 });
    }
  
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/price-target?symbol=${ticker}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const data = await res.json();
  
    return Response.json(data);
  }
  