import React from 'react';

interface KopSuratProps {
  className?: string;
  subTitle?: string;
  nomorSurat?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({
  className = '',
  subTitle,
  nomorSurat,
}) => {
  return (
    <div className={`w-full bg-white text-slate-900 select-none ${className}`}>
      {/* Kop Header Grid */}
      <div className="flex items-center justify-between gap-3 sm:gap-6 pb-2.5">
        {/* Logo Dinas Pendidikan - Pojok Kiri Atas */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src="https://i.ibb.co.com/C3Y7JXkN/logo-dinas.png"
            alt="Logo Dinas Pendidikan Kota Pasuruan"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback placeholder if offline
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Teks Lembaga Resmi Kedinasan */}
        <div className="flex-1 text-center px-1">
          <h4 className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-slate-800 uppercase leading-tight font-serif">
            PEMERINTAH KOTA PASURUAN
          </h4>
          <h3 className="text-sm sm:text-base md:text-lg font-extrabold tracking-wide text-slate-900 uppercase leading-snug font-serif">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </h3>
          <h2 className="text-base sm:text-lg md:text-2xl font-black tracking-normal text-slate-950 uppercase leading-snug font-serif">
            UPTD SMP NEGERI 7 PASURUAN
          </h2>
          <p className="text-[10px] sm:text-xs md:text-[13px] text-slate-700 leading-tight font-sans mt-0.5">
            Jl. Ki Hajar Dewantara No. 27 Kota Pasuruan, Jawa Timur 67118
          </p>
          <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-600 leading-tight font-sans">
            Telp. (0343) 424368 &bull; Pos-el: smpn7pasuruan@gmail.com &bull; Laman: https://smpn7pasuruan.sch.id
          </p>
          <div className="flex items-center justify-center gap-3 text-[9px] sm:text-[10px] text-slate-600 font-medium mt-0.5">
            <span>NPSN: <strong>20535447</strong></span>
            <span>&bull;</span>
            <span>NSS: <strong>201056501007</strong></span>
            <span>&bull;</span>
            <span>Akreditasi: <strong>A</strong></span>
          </div>
        </div>

        {/* Logo SMPN 7 Pasuruan - Pojok Kanan Atas */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src="https://iili.io/KDFk4fI.png"
            alt="Logo Resmi SMPN 7 Pasuruan"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Secondary fallback if mirror needed
              e.currentTarget.src = 'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg';
            }}
          />
        </div>
      </div>

      {/* Garis Pembatas Ganda Kop Surat Kedinasan (3px tebal & 1px tipis) */}
      <div className="w-full space-y-[2px]">
        <div className="h-[3px] bg-slate-950 w-full rounded-xs"></div>
        <div className="h-[1px] bg-slate-950 w-full"></div>
      </div>

      {/* Optional Subtitle / Nomor Surat */}
      {subTitle && (
        <div className="text-center pt-3 pb-1">
          <h2 className="text-sm sm:text-base md:text-lg font-black uppercase text-slate-900 tracking-wide underline underline-offset-4 decoration-2">
            {subTitle}
          </h2>
          {nomorSurat && (
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 font-mono">
              Nomor: {nomorSurat}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
