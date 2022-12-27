import React from 'react'
import Image from 'next/image'
import { urlFor } from '../sanity'
import { ShoppingCartIcon } from '@heroicons/react/outline'
import { useDispatch } from 'react-redux'
import { addToBasket } from '../redux/slice/basketSlice'
import Currency from 'react-currency-formatter'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
    product: Product
}

const Product = ({ product }: Props) => {
    const dispath = useDispatch()
    
    const addItemToBasket = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dispath(addToBasket(product))

        toast.success(`${product.title} added to basket`, {
            position: "bottom-left"
        })
    }

  return (
    <Link href="/product/[id]" as={`/product/${product._id}`}>
        <div className="flex flex-col h-fit w-[320px] select-none space-y-3 rounded-xl bg-[#35383C] p-8 md:h-[500px] md:w-[400px] md:p-10 cursor-pointer hover:shadow-md hover:shadow-[#777777]" >
            <div className="relative h-64 w-full md:h-72">
                <Image src={urlFor(product.image[0]).url()} alt=""
                    fill={true}
                    className="object-contain"
                />
            </div>

            <div className="flex flex-1 items-center justify-center space-x-3">
                <div className="space-y-2 text-xl text-white md:text-2xl">
                    <p className="">{product.title}</p>
                    <p className="">
                        <Currency
                            quantity={product.price}
                            currency="USD"
                        />
                    </p>
                </div>

                <div className="flex items-center justify-center h-16 md:h-[70px] w-16 md:w-[70px] flex-shrink-0 cursor-pointer rounded-full bg-gradient-to-t from-pink-500 to-violet-500" onClick={(e) => addItemToBasket(e)}>
                    <ShoppingCartIcon className="h-8 w-8 text-white" />
                </div>
            </div>
        </div>
    </Link>
  )
}

export default Product