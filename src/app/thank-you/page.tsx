'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-[16px]">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4 text-[14px]">
          Your booking has been confirmed. A confirmation email will be sent shortly.
        </p>
        {paymentId && (
          <p className="text-sm text-gray-500 mb-6">
            Payment ID: <span className="font-mono">{paymentId}</span>
          </p>
        )}
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200 font-medium"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}