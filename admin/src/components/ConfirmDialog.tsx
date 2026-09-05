import { Button } from './ui';
import { useI18n } from '../i18n';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="w-full max-w-sm rounded-lg border border-wood-mid bg-wood-dark p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/15">
            <i className="fa-solid fa-triangle-exclamation text-accent" aria-hidden="true" />
          </span>
          <h3 className="text-base font-bold text-wood-text">{title}</h3>
        </div>
        <p className="mb-2 text-sm text-wood-text/80">{message}</p>
        <p className="mb-5 text-xs text-wood-text/60">
          <i className="fa-solid fa-circle-info mr-1" aria-hidden="true" />
          {t('confirm.notUndone')}
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? (
              <i className="fa-solid fa-spinner fa-spin text-sm" aria-hidden="true" />
            ) : (
              <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
            )}
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}