"use client";

import { XIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { PersonPicker } from "@/components/transcription-pane/person-picker";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { formatPlaybackClock } from "@/lib/format";
import { interventionsLabel } from "@/lib/transcript-speakers";
import type { ElevenLabsSpeaker } from "@/lib/types";

export type SpeakerLine = {
  start: number;
  text: string;
};

export type AssignSpeakerDialogProps = {
  open: boolean;
  label: string;
  people: ElevenLabsSpeaker[];
  lines: SpeakerLine[];
  speakingSeconds: number;
  initialPerson: ElevenLabsSpeaker | null;
  saving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onAssign: (person: ElevenLabsSpeaker, applyToVoice: boolean) => void;
};

export function AssignSpeakerDialog({
  open,
  label,
  people,
  lines,
  speakingSeconds,
  initialPerson,
  saving,
  error,
  onOpenChange,
  onAssign,
}: AssignSpeakerDialogProps) {
  const switchId = useId();
  const [selected, setSelected] = useState<ElevenLabsSpeaker | null>(initialPerson);
  const [applyToVoice, setApplyToVoice] = useState(true);
  const initialId = initialPerson?.id ?? null;
  const initialName = initialPerson?.name ?? null;

  useEffect(() => {
    if (!open) return;
    setSelected(initialId && initialName ? { id: initialId, name: initialName } : null);
    setApplyToVoice(true);
  }, [open, initialId, initialName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex w-[400px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-visible rounded-xl border border-[#14141414] bg-white p-0 text-[#141414] shadow-[0_16px_40px_-12px_#14141433,0_2px_6px_#1414140A] ring-0 sm:max-w-[400px]"
      >
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <DialogTitle className="font-sans text-sm/5 font-semibold text-[#141414]">¿Quién es {label}?</DialogTitle>
            <DialogDescription className="font-sans text-xs/4 text-[#141414A8]">
              {applyToVoice
                ? "Se aplicará a todas sus intervenciones en esta grabación"
                : "Solo se aplicará a este mensaje"}
            </DialogDescription>
          </div>
          <DialogClose className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#141414A8] outline-none hover:bg-[#1414140F]">
            <XIcon className="size-3.5" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
        </div>

        <div className="px-4">
          <PersonPicker people={people} selected={selected} onSelect={setSelected} />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <label htmlFor={switchId} className="min-w-0 font-sans text-[13px]/5 font-medium text-[#141414]">
            Asignar a todos los mensajes con esta voz
          </label>
          <Switch
            id={switchId}
            checked={applyToVoice}
            onCheckedChange={setApplyToVoice}
            disabled={saving}
          />
        </div>

        {applyToVoice ? (
          <div className="flex flex-col gap-1.5 px-4 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-sans text-xs/4 font-medium text-[#141414BD]">Lo que ha dicho en esta grabación</p>
              <p className="shrink-0 font-sans text-xs/4 text-[#1414148A]">
                {interventionsLabel(lines.length, speakingSeconds)}
              </p>
            </div>
            <div className="relative h-54 overflow-hidden rounded-lg border border-[#14141414] bg-[#FAFAFA]">
              <div className="h-full overflow-y-auto py-0.5 pr-3.5">
                {lines.length === 0 ? (
                  <p className="px-3 py-2 font-sans text-[13px]/5 text-[#1414148A]">No hay intervenciones de esta persona.</p>
                ) : (
                  lines.map((line, index) => (
                    <div
                      key={`${line.start}-${index}`}
                      className={`flex items-start gap-1 py-2 pl-3 ${index > 0 ? "border-t border-[#1414140F]" : ""}`}
                    >
                      <span className="w-11 shrink-0 font-sans text-xs/5 text-[#1414148A]">
                        {formatPlaybackClock(line.start, line.start)}
                      </span>
                      <p className="min-w-0 grow font-sans text-[13px]/5 text-[#141414]">{line.text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-transparent to-[#FAFAFA]" />
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 p-4">
          {error ? <p className="mr-auto font-sans text-xs/4 text-[#141414A8]">{error}</p> : null}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-8 cursor-pointer items-center rounded-lg border border-[#14141414] px-3 font-sans text-[13px]/[18px] font-medium text-[#141414]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!selected || saving}
            onClick={() => {
              if (selected) onAssign(selected, applyToVoice);
            }}
            className="flex h-8 cursor-pointer items-center rounded-lg bg-[#141414] px-3.5 font-sans text-[13px]/[18px] font-medium text-[#FCFCFC] disabled:cursor-not-allowed disabled:bg-[#14141429]"
          >
            {selected ? `Asignar a ${selected.name}` : "Asignar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
