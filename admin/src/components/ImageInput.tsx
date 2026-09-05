import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { uploadImage } from '../api';
import { Button, inputClass } from './ui';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageInput({ value, onChange }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md border border-wood-mid/40 bg-wood-darkest/50">
          {value && /^https?:\/\//i.test(value) ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-wood-text/40">
              Belum ada
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <Upload className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            {busy ? 'Mengunggah...' : value ? 'Ganti Gambar' : 'Pilih Gambar'}
          </Button>
          {value && (
            <Button type="button" variant="danger" onClick={() => onChange('')}>
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-amber-400">{error}</p>}

      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="atau tulis URL gambar manual"
      />
    </div>
  );
}