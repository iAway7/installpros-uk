"use client";

import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/system/button";

/**
 * The sidebar on a phone: a menu button in the top bar that opens the same
 * links as a drawer from the left. Below `md` the sidebar is hidden, and the
 * two links that used to stand in for it left seven pages with no way in.
 *
 * A native <dialog>, like system/modal: showModal() brings the focus trap,
 * Escape and the inert page behind it. The links are plain anchors, so a tap
 * loads the next page and the drawer goes with this one; nothing to close.
 *
 * `header` and `children` come from the server layout, so the drawer shows
 * exactly what the sidebar shows.
 */
export function MobileNav({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  // Rotating a phone or widening the window past `md` hides the drawer with
  // CSS but would leave it open, and the page inert behind nothing.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (wide.matches) ref.current?.close();
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => ref.current?.showModal()}
        aria-label="Open menu"
        aria-haspopup="dialog"
        className="-ml-2 text-muted-foreground md:hidden"
      >
        <Menu />
      </Button>

      <dialog
        ref={ref}
        aria-label="Menu"
        // A click on the backdrop lands on the dialog itself; the panel below
        // covers the whole box, so anything inside it has another target.
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-72 max-w-[85vw] border-r border-border bg-background p-0 text-foreground shadow-overlay backdrop:bg-black/40 open:animate-in open:slide-in-from-left open:duration-200 md:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border pl-5 pr-3">
            {header}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => ref.current?.close()}
              aria-label="Close menu"
              className="text-muted-foreground"
            >
              <X />
            </Button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
