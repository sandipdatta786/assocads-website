import { Fragment } from "react";
import { Placeholder } from "@/components/ui/Callout";

const PATTERN = /\[PLACEHOLDER: ([^\]]+)\]/g;

/** Plain text, with any [PLACEHOLDER: ...] in it shown as a visible placeholder. */
export function WithPlaceholders({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    parts.push(text.slice(last, m.index));
    parts.push(<Placeholder key={m.index} needed={m[1]} />);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
