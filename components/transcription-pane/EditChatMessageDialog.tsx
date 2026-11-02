"use client";

import { XIcon } from "lucide-react";
import { useId, useState } from "react";
import { PersonPicker } from "@/components/transcription-pane/person-picker";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatPlaybackClock } from "@/lib/format";
import type { ElevenLabsSpeaker } from "@/lib/types";

export type EditChatMessageDialogProps = {
  open: boolean;
  start: number;
  people: ElevenLabsSpeaker[];
  initialPerson: ElevenLabsSpeaker | null;
  initialText: string;
  saving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSave: (person: ElevenLabsSpeaker | null, text: string) => void;
};

export function EditChatMessageDialog({ open, onOpenChange, ...formProps }: EditChatMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex w-[480px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-visible rounded-xl border border-[#14141414] bg-white p-0 text-[#141414] shadow-[0_16px_40px_-12px_#14141433,0_2px_6px_#1414140A] ring-0 sm:max-w-[480px]"
      >
        <EditChatMessageForm {...formProps} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EditChatMessageForm({
  start,
  people,
  initialPerson,
  initialText,
  saving,
  error,
  onCancel,
  onSave,
}: Omit<EditChatMessageDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const textareaId = useId();
  const [selected, setSelected] = useState<ElevenLabsSpeaker | null>(initialPerson);
  const [text, setText] = useState(initialText);

  const trimmed = text.trim();
  const changed = trimmed !== initialText.trim() || (selected?.id ?? null) !== (initialPerson?.id ?? null);

  return (
    <>
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <DialogTitle className="font-sans text-sm/5 font-semibold text-[#141414]">Editar mensaje</DialogTitle>
            <DialogDescription className="font-sans text-xs/4 text-[#141414A8]">
              Intervención en el minuto {formatPlaybackClock(start, start)}
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

        <div className="flex flex-col gap-1.5 px-4 pt-4">
          <label htmlFor={textareaId} className="font-sans text-xs/4 font-medium text-[#141414BD]">
            Mensaje
          </label>
          <textarea
            id={textareaId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={8}
            className="max-h-80 min-h-32 w-full resize-y rounded-lg border border-[#14141429] bg-white px-2.5 py-2 font-sans text-[13px]/5 text-[#141414] outline-none placeholder:text-[#1414145C] focus:border-[#141414] focus:shadow-[0_0_0_3px_#1414140F]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 p-4">
          {error ? <p className="mr-auto font-sans text-xs/4 text-[#141414A8]">{error}</p> : null}
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 cursor-pointer items-center rounded-lg border border-[#14141414] px-3 font-sans text-[13px]/[18px] font-medium text-[#141414]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!trimmed || !changed || saving}
            onClick={() => onSave(selected, trimmed)}
            className="flex h-8 cursor-pointer items-center rounded-lg bg-[#141414] px-3.5 font-sans text-[13px]/[18px] font-medium text-[#FCFCFC] disabled:cursor-not-allowed disabled:bg-[#14141429]"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
    </>
  );
}
