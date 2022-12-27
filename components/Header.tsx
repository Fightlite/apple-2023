import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    SearchIcon,
    ShoppingBagIcon,
    UserIcon
} from '@heroicons/react/outline'
import { selectBasketItems } from '../redux/slice/basketSlice'
import { useSelector } from 'react-redux'
import { useSession, signIn, signOut } from "next-auth/react"

const Header = () => {
    const { data: session } = useSession()
    const items = useSelector(selectBasketItems);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full bg-[#E7ECEE] p-4">
        <div className="flex items-center justify-center md:w-1/5">
            <Link href="/">
                <div className="relative h-10 w-5 cursor-pointer opacity-75 transition hover:opacity-100">
                    <Image src="https://rb.gy/vsvv2o" alt="image" fill={true} className="object-contain"/>
                </div>
            </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center space-x-8 md:flex">
            <a href="" className="headerLink">Product</a>
            <a href="" className="headerLink">Explore</a>
            <a href="" className="headerLink">Support</a>
            <a href="" className="headerLink">Business</a>
        </div>

        <div className="flex items-center justify-center gap-x-4 md:w-1/5">
            <SearchIcon className="headerIcon" />
            <Link href="/checkout">
                <div className="relative cursor-pointer">
                    {items?.length > 0 && (<span className="absolute -right-1 -top-1 z-50 h-4 w-4 flex items-center justify-center rounded-full bg-gradient-to-t from-pink-500 to-violet-500 text-[10px] text-white">
                        {items.length}
                    </span>)}
                    <ShoppingBagIcon className="headerIcon" />
                </div>
            </Link>

            {session ? (
                <Image
                    src={session?.user?.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                    alt=""
                    className="cursor-pointer rounded-full"
                    width={34}
                    height={34}
                    onClick={() => signOut()}
                />
            ) : (
                <UserIcon 
                    className="headerIcon" 
                    onClick={() => signIn()}
                />
            )}
        </div>
    </header>
  )
}

export default Header