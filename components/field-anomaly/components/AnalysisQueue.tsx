import { FileText } from "lucide-react";

import {
  AnalysisFile,
} from "../hooks/useAnomalyLoader";

interface AnalysisQueueProps {
  analysisFiles: AnalysisFile[];
}

export default function AnalysisQueue({
  analysisFiles,
}: AnalysisQueueProps) {
  return (
    <div className="rounded-xl border border-[#2d4318] bg-[#10180b] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white">
            Real IR Analysis
          </h3>

          <p className="text-[10px] text-[#91a28b]">
            EXIF + intensity analysis
          </p>
        </div>

        <div className="rounded-full bg-[#23350d] px-2 py-1 text-[9px] font-black text-[#b7ea6f]">
          {analysisFiles.length} FILES
        </div>
      </div>

      <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
        {analysisFiles.map((file) => (
          <div
            key={file.name}
            className="rounded-lg border border-white/5 bg-black/30 p-2"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-3 w-3 shrink-0 text-[#8fd84f]" />

                <div className="truncate text-[10px] font-semibold text-white">
                  {file.name}
                </div>
              </div>

              <div className="text-[9px] font-black uppercase tracking-wide text-[#8fcf4f]">
                {file.status}
              </div>
            </div>

            <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#182512]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6cae2d] to-[#b4e15f] transition-all duration-300"
                style={{
                  width: `${file.progress}%`,
                }}
              />
            </div>

            <div className="text-right text-[9px] font-bold text-[#9fb28f]">
              {file.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}