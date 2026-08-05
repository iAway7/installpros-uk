"use client";

import { useState } from "react";
import { Modal } from "@/components/system/modal";
import { FunnelButton } from "@/components/system/funnel-button";
import { FunnelInput } from "@/components/system/funnel-input";
import { Label } from "@/components/system/label";
import { PageHeader, Section, Preview, Code, Rule, BestPractices } from "../../_components/docs";

export default function ModalPage() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const [d, setD] = useState(false);
  const [e, setE] = useState(false);
  const [name, setName] = useState("");

  return (
    <>
      <PageHeader
        title="Modal"
        lead="Interrupts everything until the user deals with it. Three bands — header, body, footer — separated by hairlines, with the actions in a tinted footer so they read as a distinct region."
      />

      <Section title="Default">
        <Preview>
          <FunnelButton onClick={() => setA(true)}>Reschedule install</FunnelButton>
          <Modal
            open={a}
            onClose={() => setA(false)}
            title="Reschedule this install?"
            description="The customer will be notified by email and SMS."
            action={{ label: "Confirm", onClick: () => setA(false) }}
          >
            The engineer&apos;s morning slot on 12 August will be released back to the pool.
          </Modal>
        </Preview>
        <Code>{`<Modal
  open={open}
  onClose={close}
  title="Reschedule this install?"
  description="The customer will be notified by email and SMS."
  action={{ label: "Confirm", onClick: confirm }}
>
  The engineer's morning slot will be released back to the pool.
</Modal>`}</Code>
      </Section>

      <Section title="Single button" note="With no action, cancel stretches full width.">
        <Preview>
          <FunnelButton variant="secondary" onClick={() => setB(true)}>Open</FunnelButton>
          <Modal
            open={b}
            onClose={() => setB(false)}
            title="Coverage confirmed"
            cancel={{ label: "Close" }}
          >
            We cover SW1A 1AA. Engineers are usually on site within the week.
          </Modal>
        </Preview>
      </Section>

      <Section title="Disabled action" note="Until the form is valid.">
        <Preview>
          <FunnelButton variant="outline" onClick={() => setC(true)}>Open</FunnelButton>
          <Modal
            open={c}
            onClose={() => setC(false)}
            title="Add an access note"
            action={{ label: "Save", disabled: true }}
          >
            Nothing to save yet.
          </Modal>
        </Preview>
      </Section>

      <Section title="Destructive" note="Never the default focus.">
        <Preview>
          <FunnelButton variant="outline" onClick={() => setD(true)}>Mark lead as lost</FunnelButton>
          <Modal
            open={d}
            onClose={() => setD(false)}
            size="sm"
            title="Mark this lead as lost?"
            description="You can restore it within 30 days."
            cancel={{ label: "Keep it" }}
            action={{ label: "Mark as lost", destructive: true, onClick: () => setD(false) }}
          />
        </Preview>
      </Section>

      <Section title="Focus a field on open">
        <Preview>
          <FunnelButton onClick={() => setE(true)}>Invite engineer</FunnelButton>
          <Modal
            open={e}
            onClose={() => setE(false)}
            title="Invite engineer"
            description="They will get an email with a link to accept."
            autoFocusSelector="input"
            action={{ label: "Send invite", disabled: !name.trim(), onClick: () => setE(false) }}
          >
            <Label htmlFor="invite-name">Name</Label>
            <FunnelInput id="invite-name" value={name} onChange={(ev) => setName(ev.target.value)} placeholder="Jane Doe" />
          </Modal>
        </Preview>
        <Code>{`<Modal autoFocusSelector="input" … >`}</Code>
      </Section>

      <Section title="Why native dialog">
        <Rule>
          <code>showModal()</code> supplies the focus trap, Escape, the inert background and top-layer stacking. Every
          one is a thing hand-rolled modals get wrong — and the focus trap is invisible until someone tries the page
          with a keyboard. The cost is that the backdrop is styled through <code>::backdrop</code> rather than a child
          element, which is a fair trade.
        </Rule>
      </Section>

      <BestPractices
        when={[
          "Only when the user must resolve something before continuing: confirming a destructive action, a short form that would derail the page.",
          "If they could carry on around it, it wanted to be a <code>Note</code> or a toast.",
          "Never on the funnel. A modal in front of someone trying to get a quote is a tax.",
        ]}
        behavior={[
          "Escape closes, backdrop click closes, focus returns to whatever opened it.",
          "Below 640px it becomes a bottom sheet. A centred dialog on a phone puts the actions mid-screen, out of thumb reach.",
          "Never nest modals. A second over the first means the first asked the wrong question.",
          "Do not autofocus the destructive action — muscle memory plus Enter equals a deleted lead. Use <code>autoFocusSelector</code> for the first input instead.",
        ]}
        content={[
          "The title is the question, ending in a question mark: <em>Mark this lead as lost?</em> Not <em>Confirm action</em>.",
          "The description names the consequence and the escape hatch: <em>You can restore it within 30 days.</em>",
          "Buttons name the outcome: <em>Mark as lost</em> and <em>Keep it</em>. Never <em>OK</em> and <em>Cancel</em> when something more specific is true.",
        ]}
        accessibility={[
          "<code>aria-labelledby</code> and <code>aria-describedby</code> point at the title and description, so the dialog announces its purpose on open.",
          "The focus trap is the browser's, which means it stays correct as the content inside changes.",
          "<code>autoFocusSelector</code> waits a frame, because <code>showModal()</code> moves focus to the dialog element first and would otherwise win the race.",
        ]}
      />
    </>
  );
}
