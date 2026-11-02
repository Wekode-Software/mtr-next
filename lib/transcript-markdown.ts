import { formatDuration, formatRecordedAt, listTitle } from "@/lib/format";
import { fetchTranscriptionDetail } from "@/lib/mtr";
import { diarizationKey, speakerLabel, speakerOrdinals } from "@/lib/transcript-speakers";
import type { TranscriptionDetail } from "@/lib/types";

export function transcriptionMarkdown(detail: TranscriptionDetail): string {
  const meta = [formatRecordedAt(detail.recorded_at), formatDuration(detail.duration_seconds)]
    .filter(Boolean)
    .join(" · ");
  const segments = detail.elevenlabs_transcript?.segments ?? [];
  const ordinals = speakerOrdinals(segments);
  const messages = segments.flatMap((segment, index) => {
    const text = segment?.text?.trim();
    if (!text) return [];
    const ordinal = ordinals.get(diarizationKey(segment, index)) ?? index + 1;
    return [`**${speakerLabel(segment, ordinal)}**\n\n${text}`];
  });
  const body = messages.length > 0 ? messages : [detail.body?.trim() || "Esta transcripción no tiene texto todavía."];
  return `${[`# ${listTitle(detail)}`, meta ? `_${meta}_` : "", ...body].filter(Boolean).join("\n\n")}\n`;
}

function fileName(title: string): string {
  return title.replace(/[\\/:*?"<>|]+/g, "-").trim() || "transcripcion";
}

export async function downloadTranscriptionMarkdown(id: string) {
  const detail = await fetchTranscriptionDetail(id, new AbortController().signal);
  if (!detail) throw new Error("No se encontró la transcripción");
  const blob = new Blob([transcriptionMarkdown(detail)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName(listTitle(detail))}.md`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
