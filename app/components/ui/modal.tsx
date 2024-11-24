"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type ModalProps = {
  title?: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({
  trigger,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  const [open, setOpen] = useState(false);


  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="md:max-w-lg max-w-screen-sm">
      <DialogHeader>
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>
      {children}
    </DialogContent>
    {footer && <DialogFooter>{footer}</DialogFooter>}
  </Dialog>
}
