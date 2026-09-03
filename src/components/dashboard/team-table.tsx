"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/system/button";
import { Input } from "@/components/system/input";
import { Card, CardContent } from "@/components/system/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";
import type { TeamMember } from "@/app/api/settings/users/route";

const ROLE_LABEL: Record<string, string> = { admin: "Admin", team_member: "Team member" };

/** Server messages worth rewording for a human. */
const ERRORS: Record<string, string> = {
  email_taken: "That email already has an account.",
  weak_password: "Password must be at least 8 characters.",
  invalid_email: "That doesn't look like an email address.",
  last_admin: "That's the only admin left — promote someone else first.",
  cannot_change_self: "You can't change your own role.",
  cannot_delete_self: "You can't delete your own account.",
  forbidden: "Admins only.",
};

function when(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function TeamTable({ users, currentUserId }: { users: TeamMember[]; currentUserId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "team_member" });

  async function send(method: "POST" | "PATCH" | "DELETE", payload: unknown, ok: string) {
    const res = await fetch("/api/settings/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      toast.error(ERRORS[json.error ?? ""] ?? "Something went wrong. Try again.");
      return false;
    }
    toast.success(ok);
    router.refresh();
    return true;
  }

  async function changeRole(id: string, role: string) {
    setBusy(id);
    try {
      await send("PATCH", { id, role }, `Now ${ROLE_LABEL[role].toLowerCase()}`);
    } finally {
      setBusy(null);
    }
  }

  async function remove(user: TeamMember) {
    setBusy(user.id);
    try {
      await send("DELETE", { id: user.id }, `${user.email} removed`);
    } finally {
      setBusy(null);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const done = await send("POST", form, `${form.email} can now sign in`);
      if (done) setForm({ full_name: "", email: "", password: "", role: "team_member" });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-border text-label uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Last sign-in</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">
                      {u.full_name || "—"}
                      {isSelf && <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-micro uppercase">You</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-muted-foreground">{ROLE_LABEL[u.role]}</span>
                      ) : (
                        <Select value={u.role} onValueChange={(v) => changeRole(u.id, v)} disabled={busy === u.id}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="team_member">Team member</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{when(u.last_sign_in_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => remove(u)}
                          disabled={busy === u.id}
                          aria-label={`Remove ${u.email}`}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive disabled:opacity-50"
                        >
                          {busy === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-1 font-semibold">Add a team member</h2>
          <p className="mb-4 text-body-sm text-muted-foreground">
            The account works straight away — no confirmation email. Send them the password yourself and ask them to
            change it from Forgot password.
          </p>
          <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Full name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <Input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              type="text"
              required
              minLength={8}
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="team_member">Team member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={adding}>
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Create account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
