import { ErrorMessage } from "@/components/system/error-message";
import { FunnelInput } from "@/components/system/funnel-input";
import { PageHeader, Section, Preview, Code, BestPractices } from "../../_components/docs";

export const metadata = { title: "Error" };

export default function ErrorPage() {
  return (
    <>
      <PageHeader
        title="Error"
        lead="Good error design is clear, useful and friendly. It says what happened and what to do next — never just that something went wrong."
      />

      <Section title="Default">
        <Preview className="!block">
          <ErrorMessage>That doesn&apos;t look like a valid UK postcode. Check and try again.</ErrorMessage>
        </Preview>
      </Section>

      <Section title="With a label" note="Use when the message is far from the field it belongs to.">
        <Preview className="!block">
          <ErrorMessage label="Email error">This address is already in use.</ErrorMessage>
        </Preview>
      </Section>

      <Section title="Sizes">
        <Preview className="!flex-col !items-start">
          <ErrorMessage size="sm">This email is in use.</ErrorMessage>
          <ErrorMessage>This email is in use.</ErrorMessage>
          <ErrorMessage size="lg">This email is in use.</ErrorMessage>
        </Preview>
      </Section>

      <Section title="Attached to a field" note="The only correct way to use it in a form.">
        <Preview className="!flex-col !items-stretch">
          <FunnelInput inputSize="lg" state="error" defaultValue="gus@" aria-describedby="err-email-demo" />
          <ErrorMessage id="err-email-demo">Enter a full email address, including the domain.</ErrorMessage>
        </Preview>
        <Code>{`<FunnelInput
  state={errors.email ? "error" : "default"}
  aria-describedby={errors.email ? "err-email" : undefined}
/>
{errors.email && <ErrorMessage id="err-email">{errors.email}</ErrorMessage>}`}</Code>
      </Section>

      <BestPractices
        when={[
          "Use for validation that the user can fix — a malformed postcode, a missing consent tick.",
          "For a failure the user cannot act on (the coverage API is down), say so plainly and offer the alternative: <em>&ldquo;We couldn&rsquo;t check just now — call 020 3397 7003 and we&rsquo;ll check for you.&rdquo;</em>",
          "Do not use it for warnings or for anything the user has not done yet. An empty field is not an error until they try to submit.",
        ]}
        behavior={[
          "Errors appear on blur or on submit, never while typing. Flagging an email as invalid at the third character is technically true and practically hostile.",
          "The message clears the moment the value becomes valid, without waiting for another submit.",
          "One message per field. If two rules fail, show the one the user hits first.",
        ]}
        accessibility={[
          "The message carries <code>role=\"alert\"</code>, so a screen reader announces it when it appears.",
          "Give it an <code>id</code> and point the field at it with <code>aria-describedby</code> — otherwise the message exists but is never connected to the thing it describes.",
          "<code>state=\"error\"</code> on the input sets <code>aria-invalid</code> automatically. Colour and an icon alone are not a state.",
          "<code>--error</code> is #DC2626, which clears 4.8:1 on white. On the dark hero it resolves lighter, because the same red only reaches 3.1:1 there.",
        ]}
      />
    </>
  );
}
