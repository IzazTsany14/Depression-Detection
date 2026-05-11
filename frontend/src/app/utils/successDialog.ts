import { SUCCESS_DIALOG_EVENT } from '../components/SuccessDialog';

export const showSuccessDialog = (message = 'Data berhasil diperbarui', duration = 2500) => {
  window.dispatchEvent(
    new CustomEvent(SUCCESS_DIALOG_EVENT, {
      detail: { message, duration },
    }),
  );
};
