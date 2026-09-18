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
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Logo Pemkot Pasuruan - Pojok Kiri Atas */}
        <div className="w-[55px] h-[55px] sm:w-[65px] sm:h-[65px] shrink-0 flex items-center justify-center">
          <img
            src="https://i.ibb.co.com/C3Y7JXkN/logo-dinas.png"
            alt="Logo Pemerintah Kota Pasuruan"
            className="w-full h-full object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Teks Lembaga Resmi Kedinasan */}
        <div className="flex-1 text-center px-2">
          <h4 className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase leading-none font-serif">
            PEMERINTAH KOTA PASURUAN
          </h4>
          <h2 className="text-xs sm:text-sm md:text-base font-black tracking-normal text-slate-950 uppercase leading-normal font-serif mt-1">
            UPT SMP NEGERI 7 PASURUAN
          </h2>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-700 leading-tight font-sans mt-1">
            Jalan Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur, 67139
          </p>
          <p className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-600 leading-tight font-sans">
            Telepon (0343) 426845 &bull; Pos-el <span className="underline">smp7pas@yahoo.co.id</span>
          </p>
          <p className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-600 leading-tight font-sans">
            Laman <span className="underline font-medium">www.smpn7pasuruan.sch.id</span>
          </p>
        </div>

        {/* Logo SMPN 7 Pasuruan - Pojok Kanan Atas */}
        <div className="w-[55px] h-[55px] sm:w-[65px] sm:h-[65px] shrink-0 flex items-center justify-center">
          <img
            src="https://iili.io/KDFk4fI.png"
            alt="Logo Resmi SMPN 7 Pasuruan"
            className="w-full h-full object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg';
            }}
          />
        </div>
      </div>

      {/* Garis Pembatas Ganda Kop Surat Kedinasan */}
      <div className="w-full space-y-[1.5px] pt-0.5">
        <div className="h-[2px] bg-slate-950 w-full"></div>
        <div className="h-[0.5px] bg-slate-950 w-full"></div>
      </div>

      {/* Optional Subtitle */}
      {subTitle && (
        <div className="text-center pt-2.5 pb-1">
          <h2 className="text-xs sm:text-sm md:text-base font-bold uppercase text-slate-900 tracking-wide underline underline-offset-4 decoration-slate-950 decoration-2">
            {subTitle}
          </h2>
        </div>
      )}
    </div>
  );
};
