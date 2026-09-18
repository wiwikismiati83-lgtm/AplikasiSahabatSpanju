import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  FileSignature,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  School,
  Download,
} from 'lucide-react';
import { KopSurat } from './KopSurat';
import { TouchSignatureModal } from './TouchSignatureModal';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  nomorSurat?: string;
  tanggalDokumen?: string;
  children: React.ReactNode;
  // Signatures
  firstSignerRole?: string;
  firstSignerName?: string;
  firstSignerNip?: string;
  firstSignerSignature?: string;
  onFirstSignerUpdate?: (sig: string, name?: string) => void;
  secondSignerRole?: string;
  secondSignerName?: string;
  secondSignerNip?: string;
  secondSignerSignature?: string;
  onSecondSignerUpdate?: (sig: string, name?: string) => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  title,
  nomorSurat,
  tanggalDokumen = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  children,
  firstSignerRole = 'Petugas / Koordinator Pelaksana',
  firstSignerName = 'Tim Sahabat SPANJU',
  firstSignerNip,
  firstSignerSignature,
  onFirstSignerUpdate,
  secondSignerRole = 'Kepala UPTD SMP Negeri 7 Pasuruan',
  secondSignerName = 'Nur Fadilah, S.Pd., M.Pd',
  secondSignerNip = '19860410 201001 2 030',
  secondSignerSignature,
  onSecondSignerUpdate,
}) => {
  const [activeSignerModal, setActiveSignerModal] = useState<'first' | 'second' | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden card-3d my-auto flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Pratinjau Dokumen Laporan Resmi
              </h3>
              <p className="text-[11px] text-slate-500">
                Dilengkapi Kop Surat Kedinasan, Logo Dinas, Logo SMPN 7, dan Tanda Tangan Touchscreen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-1.5 transition active:scale-95 btn-3d btn-3d-blue"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Container (Target for Print & Viewing) */}
        <div id="printable-official-document" className="p-6 sm:p-10 overflow-y-auto bg-white text-slate-900 font-sans space-y-6 print:p-0 print:overflow-visible">
          {/* 1. KOP SURAT RESMI */}
          <KopSurat
            subTitle={title}
            nomorSurat={nomorSurat || `421.3 / ${Math.floor(100 + Math.random() * 900)} / 101.4.7 / 2026`}
          />

          {/* 2. Tanggal & Lokasi */}
          <div className="flex justify-between items-center text-xs text-slate-600 pt-1 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Klasifikasi: Penguatan Karakter & Ketertiban</span>
            <span className="font-medium">Pasuruan, {tanggalDokumen}</span>
          </div>

          {/* 3. DOKUMEN ISI UTAMA */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            {children}
          </div>

          {/* 4. BLOK TANDA TANGAN RESMI KEDINASAN */}
          <div className="pt-8 border-t border-slate-200 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs text-slate-800">
              {/* Kolom Kiri: Petugas / Pelapor / Koordinator */}
              <div className="flex flex-col items-center justify-between min-h-[170px]">
                <div>
                  <p className="text-slate-600 font-medium">Petugas Pelaksana / Koordinator,</p>
                  <p className="font-bold text-slate-800 mt-0.5">{firstSignerRole}</p>
                </div>

                {/* Digital Signature Area */}
                <div className="my-2 flex flex-col items-center justify-center">
                  {firstSignerSignature ? (
                    <div className="relative group">
                      <img
                        src={firstSignerSignature}
                        alt="Tanda Tangan Digital"
                        className="h-20 sm:h-24 max-w-[200px] object-contain"
                      />
                      {onFirstSignerUpdate && (
                        <button
                          type="button"
                          onClick={() => setActiveSignerModal('first')}
                          className="print:hidden absolute -bottom-1 -right-2 px-2 py-0.5 text-[10px] font-bold bg-white/90 text-blue-700 rounded-md border border-blue-200 shadow-xs hover:bg-blue-50 transition"
                        >
                          Ubah TTD
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2">
                      {onFirstSignerUpdate ? (
                        <button
                          type="button"
                          onClick={() => setActiveSignerModal('first')}
                          className="print:hidden px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                          TTD Touchscreen / Mouse
                        </button>
                      ) : (
                        <div className="h-16 flex items-center justify-center text-slate-400 italic text-[11px]">
                          (Tanda tangan tercatat resmi)
                        </div>
                      )}
                      <span className="print:block hidden text-slate-300 text-[10px]">
                        (Tanda Tangan)
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-black text-slate-900 underline underline-offset-4 decoration-1">
                    {firstSignerName}
                  </p>
                  {firstSignerNip && (
                    <p className="text-[10px] text-slate-700 mt-0.5 font-bold">
                      NIP. {firstSignerNip}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Sahabat SPANJU UPTD SMPN 7 Pasuruan
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: Mengetahui Kepala Sekolah */}
              <div className="flex flex-col items-center justify-between min-h-[170px]">
                <div>
                  <p className="text-slate-600 font-medium">Mengetahui,</p>
                  <p className="font-bold text-slate-800 mt-0.5">{secondSignerRole}</p>
                </div>

                {/* Digital Signature Area */}
                <div className="my-2 flex flex-col items-center justify-center">
                  {secondSignerSignature ? (
                    <div className="relative group">
                      <img
                        src={secondSignerSignature}
                        alt="Tanda Tangan Kepala Sekolah"
                        className="h-20 sm:h-24 max-w-[200px] object-contain"
                      />
                      {onSecondSignerUpdate && (
                        <button
                          type="button"
                          onClick={() => setActiveSignerModal('second')}
                          className="print:hidden absolute -bottom-1 -right-2 px-2 py-0.5 text-[10px] font-bold bg-white/90 text-blue-700 rounded-md border border-blue-200 shadow-xs hover:bg-blue-50 transition"
                        >
                          Ubah TTD
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2">
                      {onSecondSignerUpdate ? (
                        <button
                          type="button"
                          onClick={() => setActiveSignerModal('second')}
                          className="print:hidden px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                        >
                          <FileSignature className="w-3.5 h-3.5 text-blue-600" />
                          TTD Touchscreen / Mouse
                        </button>
                      ) : (
                        <div className="h-16 flex items-center justify-center text-slate-400 italic text-[11px]">
                          (Tanda tangan & Stempel Sekolah)
                        </div>
                      )}
                      <span className="print:block hidden text-slate-300 text-[10px]">
                        (Tanda Tangan & Cap)
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-black text-slate-900 underline underline-offset-4 decoration-1">
                    {secondSignerName}
                  </p>
                  {secondSignerNip && (
                    <p className="text-[10px] text-slate-700 mt-0.5 font-bold">
                      NIP. {secondSignerNip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals for Direct Touchscreen Signature on Report */}
        {activeSignerModal === 'first' && onFirstSignerUpdate && (
          <TouchSignatureModal
            isOpen={true}
            onClose={() => setActiveSignerModal(null)}
            title="Tanda Tangan Petugas / Koordinator"
            subtitle="Goreskan jari di HP atau gerakkan mouse laptop"
            initialSignature={firstSignerSignature}
            signerName={firstSignerName}
            signerTitle={firstSignerRole}
            onSave={(sig, name) => {
              onFirstSignerUpdate(sig, name);
              setActiveSignerModal(null);
            }}
          />
        )}

        {activeSignerModal === 'second' && onSecondSignerUpdate && (
          <TouchSignatureModal
            isOpen={true}
            onClose={() => setActiveSignerModal(null)}
            title="Tanda Tangan Pengesahan Kepala Sekolah"
            subtitle="Goreskan jari di HP atau gerakkan mouse laptop"
            initialSignature={secondSignerSignature}
            signerName={secondSignerName}
            signerTitle={secondSignerRole}
            onSave={(sig, name) => {
              onSecondSignerUpdate(sig, name);
              setActiveSignerModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
