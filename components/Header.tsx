import Image from 'next/image';
import Link from 'next/link';
import {
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/cartSlice';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header = () => {
  const cartItems = useSelector(selectCartItems);
  const { data: session } = useSession();
  return (
    <header
      className='sticky top-0 z-30 flex w-full 
      items-center justify-between bg-[#E7ECEE] p-4'
    >
      <div className='flex items-center justify-center md:w-1/5'>
        <Link href='/'>
          <div
            className='relative h-10 w-10 
            cursor-pointer opacity-75 transition hover:opacity-100'
          >
            <Image
              src='https://cdn-icons-png.flaticon.com/512/4815/4815708.png'
              alt='logo'
              layout='fill'
              objectFit='contain'
            />
          </div>
        </Link>
      </div>
      <div
        className='hidden flex-1 items-center 
        justify-center space-x-8 md:flex'
      >
        <a className='headerLink'>Product</a>{' '}
        <a className='headerLink'>Explore</a>
        <a className='headerLink'>Support</a>
        <a className='headerLink'>Business</a>
      </div>
      <div className='flex items-center justify-center gap-x-4 md:w-1/5'>
        <SearchIcon className='headerIcon' />
        <Link href='/checkout'>
          {' '}
          <div className='relative cursor-pointer'>
            {cartItems.length > 0 && (
              <span
                className='absolute -right-1 -top-1 
          z-50 flex h-4 w-4 items-center justify-center 
          rounded-full bg-gradient-to-r from-pink-500 
          to-violet-500 text-[10px] text-white'
              >
                {cartItems.length}
              </span>
            )}

            <ShoppingBagIcon className='headerIcon' />
          </div>
        </Link>
        {session ? (
          <Image
            src={
              session.user?.image ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt='user icon'
            className='cursor-pointer rounded-full'
            width={34}
            height={34}
            onClick={() => signOut()}
          />
        ) : (
          <UserIcon className='headerIcon' onClick={() => signIn()} />
        )}
      </div>
    </header>
  );
};

export default Header;
