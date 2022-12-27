import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'
import { Button, Header } from '../../components';
import type { GetServerSideProps } from 'next'
import { fetchSingleProduct } from '../../utils/fetchSingleProduct';
import Image from 'next/image'
import { urlFor } from '../../sanity';
import Currency from 'react-currency-formatter'
import { addToBasket } from '../../redux/slice/basketSlice';
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'


interface Props {
  product: Product
}

const Product = ({ product }: Props) => {
    const router = useRouter();
    console.log(product)
    const dispath = useDispatch()


    const addItemToBasket = () => {
        dispath(addToBasket(product))

        toast.success(`${product.title} added to basket`, {
            position: "bottom-left"
        })
    }

    const checkOut = () => {
        dispath(addToBasket(product))
        router.push('/checkout')
    }
    
  return (
    <div className="min-h-screen bg-[#E7ECEE] overflow-hidden">
      <Head>
        <title>Bag - Apple</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="mx-auto max-w-5xl pb-24 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
          <section className="order-1 mx-auto w-full max-w-xl pb-12 lg:pt-16 xl:pl-16">
            <div className="flex items-center justify-center">
                <div className="relative h-72 w-full md:h-96">
                    <Image src={urlFor(product.image[0]).url()} alt=""
                        fill={true}
                        className="object-contain"
                    />
                </div>
            </div>
          </section>
          <section className="order-2 mx-auto max-w-xl pb-12 lg:mx-0 lg:max-w-none xl:pr-16 lg:border-l lg:border-gray-300">
            <div className="p-5 lg:pl-8 lg:pt-8">
                <h1 className="text-3xl font-bold mb-5">
                    {product.title}
                </h1>

                <p className="mb-5">
                    <strong className="text-2xl">
                        <Currency quantity={product.price} currency="USD" />
                    </strong>
                </p>

                <div className="mb-5">
                    <p className="text-md mb-2">Description:</p>
                    <p className="text-md">
                        App Tracking Transparency lets you decide which apps are allowed to track your activity — it’s just one example of how iPhone is designed to put you in control of what you share and who you share it with
                    </p>
                </div>

                <div className="mb-5">
                    <Button 
                        title="Add to basket" 
                        width="w-full"
                        onClick={addItemToBasket}
                    />
                </div>

                <div className="">
                    <Button 
                        noIcon 
                        title="Check out" 
                        width="w-full"
                        onClick={checkOut}
                    />
                </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Product

export const getServerSideProps: GetServerSideProps<Props> = async ({ query: {id} }) => {
    const product = await fetchSingleProduct(id as string);
  
    return { 
      props: {
        product
      }
    }
}