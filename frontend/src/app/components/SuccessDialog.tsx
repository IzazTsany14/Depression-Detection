import React, { useEffect, useState } from 'react';

type SuccessDialogDetail = {
  message?: string;
  duration?: number;
};

export const SUCCESS_DIALOG_EVENT = 'app:success-dialog';

export const SuccessDialog: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const handleSuccess = (event: Event) => {
      const detail = (event as CustomEvent<SuccessDialogDetail>).detail || {};
      setMessage(detail.message || 'Data berhasil diperbarui');

      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      hideTimer = setTimeout(() => {
        setMessage(null);
      }, detail.duration || 2500);
    };

    window.addEventListener(SUCCESS_DIALOG_EVENT, handleSuccess);

    return () => {
      window.removeEventListener(SUCCESS_DIALOG_EVENT, handleSuccess);
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md animate-[successDialogIn_220ms_ease-out] rounded-xl border border-green-200 bg-white px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-24 w-24 animate-[successPulse_520ms_ease-out] items-center justify-center rounded-full bg-green-100">
          <svg
            viewBox="0 0 52 52"
            className="h-16 w-16 text-green-600"
            aria-hidden="true"
          >
            <circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="[stroke-dasharray:140] [stroke-dashoffset:140] animate-[successCircle_520ms_ease-out_forwards]"
            />
            <path
              d="M16 27.5l7 7L37 19"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              className="[stroke-dasharray:36] [stroke-dashoffset:36] animate-[successCheck_420ms_ease-out_280ms_forwards]"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-gray-900">{message}</p>
      </div>
    </div>
  );
};
