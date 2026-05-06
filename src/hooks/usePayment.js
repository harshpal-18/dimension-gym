import { useState, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function usePayment() {
  const { user, refreshUser, openAuth } = useAuth();
  const [processing, setProcessing] = useState(false);

  const buyPlan = useCallback(async (plan) => {
    if (!user) {
      openAuth();
      return;
    }

    setProcessing(true);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Payment gateway failed to load');
        setProcessing(false);
        return;
      }

      // Create order on backend
      const { data } = await api.post('/payment/create-order', { plan });
      if (!data.success) {
        toast.error(data.message || 'Failed to create order');
        setProcessing(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Dimension Gym',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Membership`,
        order_id: data.order.id,
        prefill: {
          name: data.user.name,
          email: data.user.email,
          contact: data.user.phone || '',
        },
        theme: {
          color: '#ff1a1a',
          backdrop_color: 'rgba(0,0,0,0.8)',
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful! Welcome aboard! 🎉');
              await refreshUser();
            } else {
              toast.error('Payment verification failed');
            }
          } catch {
            toast.error('Payment verification error');
          }
          setProcessing(false);
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast('Payment cancelled', { icon: '⚠️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment error');
      setProcessing(false);
    }
  }, [user, openAuth, refreshUser]);

  return { buyPlan, processing };
}
