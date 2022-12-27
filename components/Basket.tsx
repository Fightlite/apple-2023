import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectBasketItems, selectBasketTotal } from '../redux/slice/basketSlice'
import { ShoppingBagIcon } from '@heroicons/react/outline'

const Basket = () => {
    const items = useSelector(selectBasketItems);

    if (items.length === 0) return null;

  return (
    <Link href="/checkout">
        <div className="fixed bottom-10 right-10 z-50 h-16 w-16 flex items-center justify-center cursor-pointer rounded-full bg-gray-300">
            <span className="absolute -right-1 -top-1 z-50 h-7 w-7 flex items-center justify-center rounded-full bg-gradient-to-t from-pink-500 to-violet-500 text-[12px] text-white">
                {items.length}
            </span>
            <ShoppingBagIcon className="headerIcon" />
        </div>
    </Link>
  )
}

export default Basket
