import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const numQbs = searchParams.get('numQbs') ?? '1';
  const ppr = searchParams.get('ppr') ?? '1';

  const url = `https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=${numQbs}&numTeams=12&ppr=${ppr}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return NextResponse.json({ error: 'FantasyCalc unavailable' }, { status: 502 });

  const data = await res.json();
  return NextResponse.json(data);
}
