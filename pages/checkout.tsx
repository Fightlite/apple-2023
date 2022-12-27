import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Header } from '../components'
import { selectBasketItems, selectBasketTotal } from '../redux/slice/basketSlice'
import { useRouter } from 'next/router'
import { ChevronDownIcon } from '@heroicons/react/solid'
import Currency from 'react-currency-formatter'
import Button from '../components/Button'
import CheckoutProduct from '../components/CheckoutProduct'
import { fetchPostJSON } from '../utils/api-helpers'
import getStripe from '../utils/get-stripejs'
import Stripe from 'stripe'

const Checkout = () => {
    const items = useSelector(selectBasketItems);
    const router = useRouter();
    const [ loading, setLoading ] = useState(false)
    const [ groupedItemsInBasket, setGroupedItemsInBasket ] = useState(
        {} as { [key: string]: Product[] }
    )
    const basketTotal = useSelector(selectBasketTotal)

    useEffect(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[item._id] = results[item._id] || []).push(item)

            return results
        }, {} as { [key: string]: Product[] })

        setGroupedItemsInBasket(groupedItems)
    }, [items])

    const createCheckoutSession = async () => {
        setLoading(true)

        const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
            '/api/checkout_sessions',
            {
                items: items,
            }
        )
        // Internal server error
        if ((checkoutSession as any).statusCode === 500) {
            console.error((checkoutSession as any).message)
            return
        }
        // Redirect to Checkout.
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: checkoutSession.id,
        })
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message)

        setLoading(false)
    }

  return (
    <div className="min-h-screen bg-[#E7ECEE] overflow-hidden">
      <Head>
        <title>Bag - Apple</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="mx-auto max-w-5xl pb-24">
        <div className="mx-5">
            <h1 className="my-4 text-3xl ont-semibold lg:text-4xl">
                {items?.length > 0 ? 'Review your bag.' : 'Your bag is empty.'}
            </h1>
            <p className="my-4">Free delivery and free returns.</p>

            {items.length === 0 && (
                <Button title="Continue Shopping" onClick={() => router.push('/')} />
            )}
        </div>

        {items.length > 0 && (
            <div className="mx-5 md:mx-8">
                {Object.entries(groupedItemsInBasket).map(([key, items]) => (
                    <CheckoutProduct key={key} id={key} items={items} />
                ))}

                <div className="my-12 mt-6 ml-auto max-w-3xl">
                    <div className="divide-y divide-ray-300">
                        <div className="pb-4">
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p className="">
                                    <Currency
                                        quantity={basketTotal} currency="USD"
                                    />
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="">Shipping</p>
                                <p className="">FREE</p>
                            </div>

                            <div className="flex justify-between">
                                <div className="flex flex-col lg:flex-row gap-x-1">
                                    Estimated tax for: {""}
                                    <p className="flex items-end cursor-pointer text-blue-500 hover:underline">
                                        Enter zip code
                                        <ChevronDownIcon className="h-6 w-6" />
                                    </p>
                                </div>
                                <p className="">$ -</p>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 text-xl font-semibold">
                            <h4 className="">Total</h4>
                            <h4>
                                <Currency quantity={basketTotal} currency="USD" />
                            </h4>
                        </div>
                    </div>

                    <div className="my-14 space-y-4">
                        <h4 className="text-xl font-semibold">
                            How would you like to check out?
                        </h4>

                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="order-2 flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center">
                                <h4 className="flex flex-col mb-4 text-xl font-semibold">
                                    <span>Pay Monthly</span>
                                    <span>with Apple Card</span>
                                    <span>$28/mo. at 0% APR<sup className='-top-1'>()</sup></span>
                                </h4>

                                <Button title="Check out with Apple Card Monthly Installments" />

                                <p className="mt-2 max-w-[240px] text-[13px]">
                                    $0.00 due today, which includes applicable full-price items, down payments, shipping, and taxes.
                                </p>
                            </div>

                            <div className="md:order-2 flex flex-1 flex-col items-center rounded-xl bg-gray-200 space-y-8 p-8 py-12 text-center">
                                <h4 className="flex flex-col text-xl font-semibold mb-4">
                                    Pay in full
                                    <span>
                                        <Currency quantity={basketTotal} currency="USD" />
                                    </span>
                                </h4>

                                <Button 
                                    noIcon 
                                    title="Check out" 
                                    width="w-full"
                                    loading={loading}
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
  )
}

export default Checkout
