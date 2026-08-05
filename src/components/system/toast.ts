import { toast as sonner } from "sonner";

/**
 * Transient confirmation. Wraps sonner so the whole app speaks with one voice
 * instead of each caller inventing its own copy and duration.
 *
 * A toast is for something that already happened and needs no action. If the
 * user must respond, it is a Modal. If it persists until state changes, it is
 * a Note or a ProjectBanner.
 *
 * The <Toaster /> lives in the root layout at position="top-center".
 */
export const toast = {
  /** Something completed. 4s is long enough to read, short enough not to nag. */
  success: (message: string, description?: string) =>
    sonner.success(message, { description, duration: 4000 }),

  /**
   * Something failed but the user can carry on. Longer, because failure copy
   * takes longer to process — and errors that block progress belong inline,
   * next to the field, not in a toast that disappears.
   */
  error: (message: string, description?: string) =>
    sonner.error(message, { description, duration: 6000 }),

  info: (message: string, description?: string) =>
    sonner(message, { description, duration: 4000 }),

  /** Ties a toast to a promise: pending → resolved or rejected. */
  promise: <T,>(
    promise: Promise<T>,
    copy: { loading: string; success: string; error: string },
  ) => sonner.promise(promise, copy),

  dismiss: (id?: string | number) => sonner.dismiss(id),
};
