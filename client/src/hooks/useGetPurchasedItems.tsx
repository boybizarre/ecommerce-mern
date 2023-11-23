import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { instance } from '../utils/axios';

const useGetPurchasedItems = () => {
  const { data: purchasedItems } = useQuery(
    'purchasedItems',
    () => {
      return instance.get(
        `/products/purchased-items/${localStorage.getItem('userID')}`
      );
    },
    {
      // staleTime: 30000,
      // refetchOnMount: true,
      onError: (_error) => {
        toast.error('Something went wrong!');
      },
    }
  );

  return { purchasedItems };
};

export default useGetPurchasedItems;
