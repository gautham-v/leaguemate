import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutReturnPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect('/');
  }

  let status: string;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    status = session.status ?? 'unknown';
  } catch {
    redirect('/');
  }

  if (status === 'complete') {
    redirect('/?upgraded=true');
  }

  // open or expired — send back home
  redirect('/');
}
