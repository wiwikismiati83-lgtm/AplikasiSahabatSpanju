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
        {/* Logo Pemkot Pasuruan - Pojok Kiri Atas */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src="https://i.ibb.co.com/C3Y7JXkN/logo-dinas.png"
            alt="Logo Pemerintah Kota Pasuruan"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Teks Lembaga Resmi Kedinasan */}
        <div className="flex-1 text-center px-1">
          <h4 className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-slate-900 uppercase leading-tight font-serif">
            PEMERINTAH KOTA PASURUAN
          </h4>
          <h2 className="text-base sm:text-lg md:text-2xl font-black tracking-normal text-slate-950 uppercase leading-snug font-serif mt-0.5">
            UPT SMP NEGERI 7
          </h2>
          <p className="text-[10px] sm:text-xs md:text-[13px] text-slate-800 leading-tight font-sans mt-1">
            Jalan Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur, 67139
          </p>
          <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-700 leading-tight font-sans mt-0.5">
            Telepon (0343) 426845
          </p>
          <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-700 leading-tight font-sans mt-0.5">
            Pos-el <span className="underline">smp7pas@yahoo.co.id</span>, Laman <span className="underline">www.smpn7pasuruan.sch.id</span>
          </p>
        </div>

        {/* Logo SMPN 7 Pasuruan - Pojok Kanan Atas */}
        <div className="shrink-0 flex items-center justify-center">
          <img
            src="https://iili.io/KDFk4fI.png"
            alt="Logo Resmi SMPN 7 Pasuruan"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg';
            }}
          />
        </div>
      </div>

      {/* Garis Pembatas Ganda Kop Surat Kedinasan */}
      <div className="w-full space-y-[2px] pt-1">
        <div className="h-[3px] bg-slate-950 w-full rounded-xs"></div>
        <div className="h-[1px] bg-slate-950 w-full"></div>
      </div>

      {/* Optional Subtitle / Nomor Surat */}
      {subTitle && (
        <div className="text-center pt-3 pb-1">
          <h2 className="text-sm sm:text-base md:text-lg font-black uppercase text-slate-900 tracking-wide underline underline-offset-4 decoration-slate-950 decoration-2">
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
