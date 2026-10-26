"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[min(100%-2rem,46rem)] w-[min(100%-2rem,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-line bg-paper p-6 shadow-card">
          <Dialog.Title className="pr-10 font-serif text-3xl font-semibold text-ink">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-base text-muted">{description}</Dialog.Description>
          <div className="mt-5">{children}</div>
          <Dialog.Close className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-soft">
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
