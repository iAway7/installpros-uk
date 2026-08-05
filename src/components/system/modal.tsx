"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ModalAction {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Renders in --error. For irreversible actions. */
  destructive?: boolean;
}

/**
 * Modal dialog, built on the native <dialog> element.
 *
 * showModal() gives the focus trap, the Escape handler, the inert background
 * and top-layer stacking for free — all the things a div-based modal gets
 * wrong, and the focus trap is invisible until someone tries a keyboard.
 *
 * Structure is three bands separated by hairlines: header, body, footer. The
 * footer is tinted so the actions read as a distinct region rather than as
 * more content.
 *
 * Below 640px it becomes a bottom sheet — a centred dialog on a phone leaves
 * the actions in the middle of the screen, out of thumb reach.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  cancel,
  action,
  footer,
  size = "default",
  autoFocusSelector,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** Defaults to a "Cancel" that calls onClose. Pass null to remove it. */
  cancel?: { label?: string; onClick?: () => void } | null;
  /** The confirming action. Alone, cancel stretches full width. */
  action?: ModalAction;
  /** Escape hatch when the two-action layout is not enough. */
  footer?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  /** CSS selector for the element to focus on open, e.g. "input". */
  autoFocusSelector?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      if (autoFocusSelector) {
        // Wait a frame: showModal() moves focus to the dialog itself first.
        requestAnimationFrame(() => el.querySelector<HTMLElement>(autoFocusSelector)?.focus());
      }
    }
    if (!open && el.open) el.close();
  }, [open, autoFocusSelector]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [onClose]);

  const width = { sm: "sm:max-w-[400px]", default: "sm:max-w-[480px]", lg: "sm:max-w-[600px]" }[size];

  const btn =
    "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--selection)/0.15)] disabled:cursor-not-allowed disabled:opacity-40";

  const cancelCfg = cancel === null ? null : { label: cancel?.label ?? "Cancel", onClick: cancel?.onClick ?? onClose };
  const lone = cancelCfg && !action;

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={cn(
        "w-full overflow-hidden bg-card p-0 text-foreground",
        "border border-border shadow-[0_16px_48px_rgba(0,0,0,0.16)]",
        // Bottom sheet on mobile, centred card from sm up.
        "mb-0 mt-auto max-w-none rounded-b-none rounded-t-[16px]",
        "sm:my-auto sm:rounded-[12px]",
        "backdrop:bg-black/40 backdrop:backdrop-blur-[2px]",
        width,
        className,
      )}
    >
      <div className="px-6 py-5">
        <h2 id="modal-title" className="text-[18px] font-semibold leading-tight tracking-[-0.2px]">
          {title}
        </h2>
        {description && (
          <p id="modal-description" className="mt-2 text-[15px] leading-[1.55] text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="border-t border-border px-6 py-5 text-[15px] leading-[1.55]">{children}</div>
      )}

      {(cancelCfg || action || footer) && (
        <div
          className={cn(
            "flex items-center gap-3 border-t border-border bg-secondary px-6 py-4",
            footer ? "justify-end" : lone ? "" : "justify-between",
          )}
        >
          {footer ?? (
            <>
              {cancelCfg && (
                <button
                  type="button"
                  onClick={cancelCfg.onClick}
                  className={cn(btn, "border-border bg-card hover:bg-secondary", lone && "w-full")}
                >
                  {cancelCfg.label}
                </button>
              )}
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    btn,
                    // --primary, not --selection: this is the dialog's primary
                    // action, not a selection state. The token already resolves
                    // per theme — brand red on the funnel, near-black in the
                    // admin, which has no brand red at all.
                    action.destructive
                      ? "border-transparent bg-error text-error-foreground hover:bg-error/90"
                      : "border-transparent bg-primary text-primary-foreground hover:bg-brand-hover",
                  )}
                >
                  {action.label}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
