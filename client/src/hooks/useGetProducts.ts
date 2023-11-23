// import { useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { instance } from '../utils/axios';

const useGetProducts = () => {
  // const [products, setProducts] = useState([]);

  const { data: fetchedProducts, isLoading } = useQuery(
    'fetch-products',
    () => {
      return instance.get('/products');
    },
    {
      // staleTime: 30000,
      // refetchOnMount: true,
      onError: (_error) => {
        toast.error('Something went wrong!');
      },
    }
  );
 
  console.log(isLoading, fetchedProducts, 'pro');

  // console.log({ isLoading, isFetching });

  return { fetchedProducts };
};

export default useGetProducts;
