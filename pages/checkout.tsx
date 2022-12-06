import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Header, CheckoutProduct } from '../components';
import { selectCartItems, selectCartTotal } from '../store/cartSlice';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Stripe from 'stripe';
import { fetchPostJSON } from '../utils/apiHelpers';
import getStripe from '../utils/getStripeJs';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groupedItemsInCart, setGroupedItemsInCart] = useState(
    {} as { [key: string]: Product[] }
  );
  useEffect(() => {
    const groupedItems = cartItems.reduce((results, item) => {
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {} as { [key: string]: Product[] });
    setGroupedItemsInCart(groupedItems);
  }, [cartItems]);
  const createCheckoutSession = async () => {
    setLoading(true);
    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      '/api/checkout_sessions',
      { items: cartItems }
    );
    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }
    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
    setLoading(false);
  };

  return (
    <div className='min-h-screen overflow-hidden bg-[#E7ECEE]'>
      <Head>
        <title>NextJs-App - Cart</title>{' '}
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
      </Head>
      <Header />
      <main className='mx-auto max-w-5xl pb-24 '>
        <div className='px-5'>
          <h1 className='my-4 text-3xl font-semibold lg:text-4xl'>
            {cartItems.length > 0 ? 'Review your bag.' : 'Your bag is empty'}
          </h1>
          <p className='my-4'>Free delivery and free returns.</p>
          {cartItems.length === 0 && (
            <Button
              title='Continue Shopping'
              onClick={() => router.push('/')}
            />
          )}
        </div>
        {cartItems.length > 0 && (
          <div className='mx-5 md:mx-8'>
            {' '}
            {Object.entries(groupedItemsInCart).map(([key, items]) => (
              <CheckoutProduct key={key} items={items} id={key} />
            ))}
            <div className='my-12 mt-6 ml-auto max-w-3xl'>
              <div className='divide-y divide-gray-300'>
                <div className='pb-4'>
                  <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{cartTotal} USD</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Shipping</p>
                    <p>FREE</p>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex flex-col gap-x-1 lg:flex-row'>
                      Estimated tax for:
                      <p
                        className='flex cursor-pointer items-end
                       text-blue-500 hover:underline'
                      >
                        Enter Zip Code
                        <ChevronDownIcon className='h-6 w-6' />
                      </p>
                    </div>
                    <p>$ -</p>
                  </div>
                </div>
                <div
                  className='flex justify-between pt-4 text-xl
                font-semibold'
                >
                  <h4>Total</h4>
                  <h4> {cartTotal} USD</h4>
                </div>
              </div>
              <div className='my-14 space-y-4'>
                <h4 className='text-xl font-semibold'>
                  How would you like to check out?
                </h4>
                <div className='flex flex-col gap-4 md:flex-row'>
                  <div
                    className='order-2 flex flex-1 flex-col
                  items-center rounded-xl bg-gray-200 p-8
                  py-12 text-center'
                  >
                    <h4
                      className='mb-4 flex flex-col text-xl 
                    font-semibold'
                    >
                      <span>Pay Monthly</span>
                      <span>with Apple Card</span>
                      <span>$283.16/mo. at 0% APR</span>
                    </h4>
                    <Button title='Check Out with Apple Card Monthly Installments' />
                    <p className='mt-2 max-w-[240px] text-[13px]'>
                      $0.0 due today, which includes applicable full-price
                      items, down payments, shipping and taxes.
                    </p>
                  </div>
                  <div
                    className='flex flex-1 flex-col items-center
                  space-y-8 rounded-xl bg-gray-200 p-8
                  py-12 md:order-2'
                  >
                    <h4 className='mb-4 flex flex-col text-xl font-semibold'>
                      Pay in full
                      <span> {cartTotal} USD</span>
                    </h4>
                    <Button
                      noIcon
                      loading={loading}
                      title='Check Out'
                      width='w-full'
                      onClick={createCheckoutSession}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
