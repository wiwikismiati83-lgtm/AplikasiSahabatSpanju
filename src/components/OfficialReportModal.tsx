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
  hideFirstSigner?: boolean;
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
  hideFirstSigner = false,
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

  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error('Print failed:', e);
    }
  };

  const handleDownloadHTML = () => {
    const docElement = document.getElementById("printable-official-document");
    if (!docElement) return;

    const documentContent = docElement.innerHTML;
    const documentTitle = title || "Laporan_Resmi";

    const fullHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <!-- Load Tailwind CSS to perfectly render all custom school tables, sigs, and alignments -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['Georgia', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 0.5cm 1.5cm 1.5cm 1.5cm;
    }
    
    body {
      background-color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      margin: 0;
      padding: 40px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .paper-container {
      background: white;
      width: 100%;
      max-width: 794px; /* Standard A4 width in pixels at 96 dpi */
      padding: 45px 55px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      position: relative;
      box-sizing: border-box;
    }

    .print\\:hidden { display: none !important; }
    
    @media print {
      body {
        background: white !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .paper-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      z-index: 9999;
    }
    .print-button:hover {
      background-color: #1d4ed8;
      transform: translateY(-1px);
    }
    .print-button:active {
      transform: translateY(1px);
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
    Cetak & Simpan Laporan
  </button>

  <div class="paper-container">
    <div id="printable-official-document">
      ${documentContent}
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Laporan.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              onClick={handleDownloadHTML}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-xs flex items-center gap-1.5 transition active:scale-95"
              title="Unduh file laporan offline yang siap dicetak/dibuka di komputer Anda"
            >
              <Download className="w-4 h-4" />
              Simpan Laporan Offline
            </button>
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

        {isIframe && (
          <div className="mx-6 sm:mx-10 mt-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-start gap-2.5 shadow-xs print:hidden">
            <span className="text-base">⚠️</span>
            <div className="space-y-1">
              <p className="font-extrabold text-amber-900">Petunjuk Penggunaan Fitur Cetak:</p>
              <p className="leading-relaxed">
                Karena aplikasi saat ini sedang berjalan di dalam panel pratinjau, fitur <strong>Cetak / Simpan PDF</strong> mungkin dibatasi oleh browser Anda.
              </p>
              <p className="font-medium text-slate-700">
                Solusi: 
                1. Klik tombol <strong>"Simpan Laporan Offline"</strong> di atas untuk mengunduh laporan ke komputer Anda, lalu buka file tersebut untuk mencetak langsung kapan saja.
                2. Atau, klik tombol <strong>"Buka di Tab Baru" ↗️</strong> di sudut kanan atas layar panel utama agar browser Anda dapat membuka jendela cetak resmi secara sempurna.
              </p>
            </div>
          </div>
        )}

        {/* Paper Document Container (Target for Print & Viewing) */}
        <div className="flex-1 bg-slate-100/60 overflow-y-auto p-4 sm:p-6 print:p-0 print:bg-white print:overflow-visible">
          <div 
            id="printable-official-document" 
            className="mx-auto w-full max-w-[760px] bg-white p-6 sm:p-10 text-slate-900 font-sans space-y-5 border border-slate-200/50 rounded-xl shadow-xs print:shadow-none print:border-none print:p-0 print:max-w-full print:rounded-none"
          >
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
            <div className={`grid grid-cols-1 ${hideFirstSigner ? 'sm:grid-cols-1 sm:max-w-xs sm:ml-auto' : 'sm:grid-cols-2'} gap-8 text-center text-xs text-slate-800`}>
              {/* Kolom Kiri: Petugas / Pelapor / Koordinator (Opsional) */}
              {!hideFirstSigner && (
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
              )}

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
