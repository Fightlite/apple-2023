import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ShoppingCartIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button } from '../components'
import Currency from 'react-currency-formatter'
import type { GetServerSideProps } from 'next'
import { fetchLineItems } from '../utils/fetchLineItems'
import { useSession } from 'next-auth/react'

interface Props {
    products: StripeProduct[]
}

const Success = ({ products }: Props) => {
    const { data: session } = useSession()

    const router = useRouter();
    const { session_id } = router.query;
    const [ mounted, setMounted ] = useState(false);
    const [ showOrderSummary, setShowOrderSummary ] = useState(false);
    const subTotal = products?.reduce((total, product) => total + product.price.unit_amount/100, 0)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)"});
    const showOrderSummaryCondition = isTabletOrMobile ? showOrderSummary : true;

    const handleShowOrderSummary = () => {
        setShowOrderSummary(!showOrderSummary)
    }

  return (
    <div className="">
        <Head>
            <title>Thank you! - Apple</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className="mx-auto max-w-xl">
            <Link href="/">
                <div className="relative h-16 w-8 ml-4 cursor-pointer transition lg:hidden">
                    <Image
                        src="https://rb.gy/vsvv2o"
                        alt="logo"
                        fill={true}
                        className="object-contain"
                    />
                </div>
            </Link>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-9">
            <section className="order-2 mx-auto max-w-xl pb-12 lg:col-span-5 lg:mx-0 lg:max-w-none lg:pr-16 lg:pt-16 xl:pl-16 2xl:pl-44">
                <Link href="/">
                    <div className="relative hidden h-24 w-12 ml-14 cursor-pointer transition lg:inline-flex">
                        <Image
                            src="https://rb.gy/vsvv2o"
                            alt="logo"
                            fill={true}
                            className="object-contain"
                        />
                    </div>
                </Link>

                <div className="flex space-x-4 my-8 ml-4 lg:ml-14 xl:ml-0">
                    <div className="flex items-center justify-center h-11 w-11 rounded-full border-2 border-black">
                        <CheckIcon className="h-8 w-8" />
                    </div>

                    <div className="">
                        <p className="text-sm text-gray-600">Order #{session_id?.slice(-8)}</p>
                        <h4 className="text-lg">
                            Thank you,
                            {session ? (' ' + session.user?.name?.split(" ")[0]) : ' Guest'}
                        </h4>
                    </div>
                </div>

                <div className="mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14">
                    <div className="space-y-2 pb-3">
                        <p className="">
                            Your order is confirmed
                        </p>
                        <p className="text-sm text-gray-600">
                            We've accepted your order, and we've getting it ready. Come back to this page for updates on your shipment status.
                        </p>
                    </div>

                    <div className="pt-3 text-sm">
                        <p className="font-medium text-gray-600">
                            Other tracking number:
                        </p>
                        <div className="">
                            CNB0347568
                        </div>
                    </div>

                </div>

                <div className="my-4 mx-4 space-y-2 rounded-md border border-gray-300 p-4 lg:ml-14">
                    <p className="">Order updates</p>
                    <p className="text-sm text-gray-600">
                        You'll get shipping and delivery updates by email and text.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-between text-sm mx-4 lg:ml-14 lg:flex-row">
                    <p className="hidden lg:inline">
                        Need help? Contact us
                    </p>
                    {mounted && (
                        <Button
                            title="Continue Shopping"
                            onClick={() => router.push('/')}
                            width={isTabletOrMobile ? 'w-full' : undefined}
                            padding="py-4"
                        />
                    )}
                </div>
            </section>

            {mounted && (
                <section className="overflow-y-scroll border-y border-l border-gray-300 bg-[#FAFAFA] lg:order-2 lg:col-span-4 lg:h-screen lg:border-y-0">
                    <div className={`${showOrderSummaryCondition && 'border-b'} w-full border-gray-300 text-sm lg:hidden`}>
                        <div className="flex items-center justify-between mx-auto max-w-xl px-4 py-6">
                            <button className="flex items-center space-x-2" onClick={handleShowOrderSummary}>
                                <ShoppingCartIcon className="h-6 w-6" />
                                <p className="">Show order summary</p>

                                {showOrderSummaryCondition ? (
                                    <ChevronUpIcon className='h-4 w-4' />
                                ) : (
                                    <ChevronDownIcon className='h-4 w-4' />
                                )}
                            </button>

                            {subTotal && (<p className="text-xl text-black font-medium">
                                <Currency quantity={subTotal + 20} currency="USD"/>
                            </p>
                            )}
                        </div>
                    </div>

                    {showOrderSummaryCondition && (
                        <div className="mx-auto max-w-xl lg:max-w-lg divide-y border-gray-300 p-4 lg:mx-0 lg:px-10 lg:py-16">
                            <div className="space-y-4 pb-4">
                                {products?.map((product) => (
                                    <div key={product.id} className="flex items-center space-x-4 text-sm font-medium">
                                        <div className="relative flex items-center justify-center rounded-md border border-gray-300 bg-[#F1F1F1] text-xs text-white h-16 w-16">
                                            <div className="relative h-7 w-7 animate-bounce rounded-md">
                                                <Image 
                                                src="https://rb.gy/vsvv2o" 
                                                alt="logo" fill={true}
                                                className="object-contain"/>
                                            </div>

                                            <div className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center rounded-full bg-[gray] text-xs">
                                                {product.quantity}
                                            </div>
                                        </div>

                                        <p className="flex-1">{product.description}</p>
                                        <p className="">
                                            <Currency
                                                quantity={product.price.unit_amount/100}
                                                currency={product.currency}
                                            />
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1 py-4">
                                <div className="flex justify-between text-sm">
                                    <p className="text-[gray]">Subtotal</p>
                                    <p className="font-medium">
                                        <Currency quantity={subTotal} currency="USD"/>
                                    </p>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <p className="text-[gray]">Discount</p>
                                    <p className="font-medium">
                                        <Currency quantity={0} currency="USD"/>
                                    </p>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <p className="text-[gray]">Shipping</p>
                                    <p className="font-medium">
                                        <Currency quantity={20} currency="USD"/>
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <p className="text-[gray]">Total</p>
                                <p className="flex items-center gap-x-2 text-xs text-[gray]">USD
                                    <span className="text-xl font-medium text-black">
                                    <Currency quantity={subTotal + 20} currency="USD"/>
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>
    </div>
  )
}

export default Success

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const sessionId = ctx.query.session_id as string
    const products = await fetchLineItems(sessionId);
  
    return { 
      props: {
        products
      }
    }
}