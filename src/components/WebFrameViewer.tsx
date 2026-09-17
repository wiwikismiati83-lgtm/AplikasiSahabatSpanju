import React, { useState } from 'react';
import {
  ExternalLink,
  RotateCw,
  Copy,
  Check,
  Globe,
  Shield,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { CustomLink } from '../types';

interface Props {
  link: CustomLink;
}

export const WebFrameViewer: React.FC<Props> = ({ link }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="view-web-frame" className="h-full flex flex-col space-y-4 pb-8">
      {/* Top Browser-like Navigation Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-3d">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${
              link.color || 'from-cyan-500 to-blue-600'
            } text-white shadow-md`}
          >
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
              {link.title}
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                {link.category}
              </span>
            </h2>
            <p className="text-xs text-slate-400 truncate mt-0.5">{link.description || link.url}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Address pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 max-w-xs truncate">
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate font-mono text-[11px]">{link.url}</span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
            title="Muat Ulang Halaman"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
            title="Salin Alamat Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-md flex items-center gap-1.5 transition active:scale-95 btn-3d btn-3d-blue"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka di Tab Baru
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 min-h-[600px] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
        {/* Notice Info Bar */}
        <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Menampilkan: <strong className="text-slate-200">{link.title}</strong>
          </span>
          <span className="text-[10px] text-slate-500">
            Jika situs membatasi penyematan iframe, klik &ldquo;Buka di Tab Baru&rdquo;
          </span>
        </div>

        <iframe
          key={iframeKey}
          src={link.url}
          title={link.title}
          className="w-full flex-1 border-0 bg-white"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
};
