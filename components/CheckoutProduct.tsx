import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { urlFor } from '../sanity';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

interface Props {
  items: Product[];
  id: string;
}

const CheckoutProduct = ({ id, items }: Props) => {
  const dispatch = useDispatch();
  const removeItemFromCart = () => {
    dispatch(removeFromCart({ id }));
    toast.error(`${items[0].title} removed from cart`, {
      position: 'bottom-center',
    });
  };
  return (
    <div
      className='flex flex-col gap-x-4 border-b border-gray-300 
    pb-5 lg:flex-row lg:items-center'
    >
      <div className='relative h-44 w-44'>
        <Image
          src={urlFor(items[0].image[0]).url()}
          alt={items[0].title}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className='flex flex-1 items-end lg:items-center'>
        <div className='flex-1 space-y-4'>
          <div
            className='flex flex-col gap-x-8 text-xl 
        lg:flex-row lg:text-2xl'
          >
            <h4 className='font-semibold lg:w-96'>{items[0].title}</h4>
            <p className='flex items-end gap-x-1 font-semibold'>
              {items.length}
              <ChevronDownIcon className='h-6 w-6 text-blue-500' />
            </p>
          </div>
          <p
            className='flex cursor-pointer items-end text-blue-500
          hover:underline'
          >
            Show product details
            <ChevronDownIcon className='h-6 w-6 ' />
          </p>
        </div>
        <div className='flex flex-col items-end space-y-4'>
          <h4 className='fonts-semibold text-xl lg:text-2xl'>
            {items.reduce((total, item) => total + item.price, 0)} USD
          </h4>
          <button
            onClick={removeItemFromCart}
            className='text-blue-500 hover:underline'
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
