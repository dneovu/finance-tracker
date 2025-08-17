import { toast } from 'react-toastify';
import Msg from '@/components/common/Msg';

const createToast = (type: 'error' | 'success', message: string) => {
  toast[type](Msg, {
    data: { message },
    closeButton: false,
    pauseOnHover: false,
    hideProgressBar: true,
    autoClose: 2500,
    position: 'top-center',
  });
};

const notify = {
  error: (message: string) => createToast('error', message),
  success: (message: string) => createToast('success', message),
};

export default notify;
