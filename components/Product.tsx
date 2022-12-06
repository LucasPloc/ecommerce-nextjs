import { ShoppingCartIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { urlFor } from '../sanity';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

const Product = ({ product }: Props) => {
  const dispatch = useDispatch();
  const addItemToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart`, {
      position: 'bottom-center',
    });
  };
  return (
    <div
      className='flex h-fit w-[320px] select-none 
    flex-col space-y-3 rounded-xl bg-[#35383C] p-8
    md:h-[400px] md:w-[320px] md:p-6 lg:h-[420px]'
    >
      <div className='md:h-70 relative h-60 w-full'>
        <Image
          src={urlFor(product.image[0]).url()}
          alt={product.title}
          fill={true}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div
        className='flex flex-1 items-center justify-between 
      space-x-3'
      >
        <div
          className='space-y-2 text-xl text-white 
        md:text-2xl'
        >
          <p>{product.title}</p>
          <p>{product.price}</p>
        </div>
        <div
          className='flex h-[55px] w-[55px] flex-shrink-0 
        cursor-pointer items-center justify-center rounded-full
        bg-gradient-to-r from-pink-500 to-violet-500 md:h-[60px]
        md:w-[60px]'
          onClick={addItemToCart}
        >
          <ShoppingCartIcon className='h-8 w-8 text-white' />
        </div>
      </div>
    </div>
  );
};

export default Product;
