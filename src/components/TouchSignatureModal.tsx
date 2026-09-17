import React from 'react';
import { X, FileSignature } from 'lucide-react';
import { TouchSignaturePad } from './TouchSignaturePad';

interface TouchSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string, name?: string, title?: string) => void;
  title?: string;
  subtitle?: string;
  initialSignature?: string;
  signerName?: string;
  signerTitle?: string;
}

export const TouchSignatureModal: React.FC<TouchSignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title = 'Tanda Tangan Digital Layar Sentuh & Laptop',
  subtitle = 'Gunakan sentuhan jari di HP atau mouse laptop untuk tanda tangan resmi',
  initialSignature,
  signerName,
  signerTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden card-3d max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-slate-50 to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800 border border-blue-200">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">{title}</h3>
              <p className="text-[11px] text-slate-500">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          <TouchSignaturePad
            initialSignature={initialSignature}
            signerName={signerName}
            signerTitle={signerTitle}
            onSave={(sig, name, role) => {
              onSave(sig, name, role);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
