import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Lock, Unlock } from 'lucide-react';

interface CalendarDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  value,
  onChange,
  label = "HARI / TANGGAL",
  required = false
}) => {
  const [isoDate, setIsoDate] = useState(() => {
    // Try to parse existing value if it is ISO format
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    // Default to today's ISO date
    return new Date().toISOString().split('T')[0];
  });

  const getIndonesianDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    // If the parent value is empty, initialize it with today's Indonesian date
    if (!value) {
      const todayIso = new Date().toISOString().split('T')[0];
      const indDate = getIndonesianDate(todayIso);
      onChange(indDate);
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextIso = e.target.value;
    setIsoDate(nextIso);
    const indDate = getIndonesianDate(nextIso);
    onChange(indDate);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition duration-150 p-1">
        <input
          type="date"
          value={isoDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 bg-transparent border-0 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-0 cursor-pointer"
        />
      </div>
      {value && !/^\d{4}-\d{2}-\d{2}$/.test(value) && (
        <p className="mt-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
          📅 Terpilih: {value}
        </p>
      )}
    </div>
  );
};

interface RealTimeTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export const RealTimeTimePicker: React.FC<RealTimeTimePickerProps> = ({
  value,
  onChange,
  label = "JAM / WAKTU",
  required = false
}) => {
  const [isRealTime, setIsRealTime] = useState(true);
  const [time, setTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    let timerId: any;
    if (isRealTime) {
      const tick = () => {
        const now = new Date();
        setTime(now);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        onChange(`${hours}:${minutes} WIB`);
      };
      
      tick(); // initial tick
      timerId = setInterval(tick, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRealTime, onChange]);

  // Handle manual input change
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRealTime(false);
    onChange(e.target.value);
  };

  // SVG Analog Clock hands calculations
  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();

  const hrAngle = (hrs % 12) * 30 + mins * 0.5;
  const minAngle = mins * 6 + secs * 0.1;
  const secAngle = secs * 6;

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="flex gap-3 items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-2xs hover:border-slate-300 transition duration-150">
        {/* SVG Analog Clock Widget */}
        <div className="w-12 h-12 bg-white rounded-full border border-slate-200 shadow-sm relative flex items-center justify-center shrink-0">
          <svg className="w-10 h-10" viewBox="0 0 100 100">
            {/* Clock Face */}
            <circle cx="50" cy="50" r="48" fill="white" stroke="#e2e8f0" strokeWidth="2" />
            {/* Hour Markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 50 + 40 * Math.sin(rad);
              const y1 = 50 - 40 * Math.cos(rad);
              const x2 = 50 + 44 * Math.sin(rad);
              const y2 = 50 - 44 * Math.cos(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 3 === 0 ? '#475569' : '#94a3b8'}
                  strokeWidth={i % 3 === 0 ? '2' : '1'}
                />
              );
            })}
            {/* Hour Hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 25 * Math.sin((hrAngle * Math.PI) / 180)}
              y2={50 - 25 * Math.cos((hrAngle * Math.PI) / 180)}
              stroke="#1e293b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Minute Hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 35 * Math.sin((minAngle * Math.PI) / 180)}
              y2={50 - 35 * Math.cos((minAngle * Math.PI) / 180)}
              stroke="#475569"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Second Hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 38 * Math.sin((secAngle * Math.PI) / 180)}
              y2={50 - 38 * Math.cos((secAngle * Math.PI) / 180)}
              stroke="#059669"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Center Pivot */}
            <circle cx="50" cy="50" r="3" fill="#059669" />
          </svg>
        </div>

        {/* Digital display & Lock Toggle */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={handleManualChange}
              placeholder="08:30 WIB"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <button
              type="button"
              onClick={() => {
                if (!isRealTime) {
                  const now = new Date();
                  setTime(now);
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  onChange(`${hours}:${minutes} WIB`);
                }
                setIsRealTime(!isRealTime);
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold transition ${
                isRealTime
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {isRealTime ? <Unlock className="w-2 h-2 text-emerald-600" /> : <Lock className="w-2 h-2 text-slate-500" />}
              {isRealTime ? 'Real-time Ticking' : 'Waktu Terkunci'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
