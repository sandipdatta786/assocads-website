import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Placeholder } from "@/components/ui/Callout";
import { site } from "@/config/site";
import { formIds } from "@/lib/enquiries";
import { legalDates } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Code of Conduct",
  description:
    "How ASSOCADS members, volunteers and everyone at its events and online spaces are expected to behave, and how to raise a concern.",
  path: "/membership/code-of-conduct",
});

const REPORT_HREF = `/contact?topic=conduct#${formIds.contact}`;

export default function Page() {
  const name = site.shortName;

  const sections: LegalSection[] = [
    {
      id: "who",
      title: "Who this code applies to",
      body: (
        <>
          <p>This code applies to:</p>
          <ul>
            <li>
              every member of {name}, in every{" "}
              <Link href="/membership#categories">membership category</Link>,
              including free Community members;
            </li>
            <li>
              the people an organisation names to use its membership seats;
            </li>
            <li>
              Founder Members, Fellows, Distinguished and Honorary Members,
              Patrons and Volunteer Leaders;
            </li>
            <li>
              anyone who takes part in an {name} event, programme, chapter,
              Special Interest Group, committee, mentoring scheme or online
              space, whether or not they are a member.
            </li>
          </ul>
          <p>
            It applies wherever you act as part of {name}: at events and
            meetings, in person and online, in forums and group chats, and when
            you use your membership, member ID or title in public.
          </p>
          <p>
            Applicants accept this code when they apply for membership. The
            trustees and founders are held to it in the same way as everyone
            else.
          </p>
        </>
      ),
    },
    {
      id: "expect",
      title: "What we expect",
      body: (
        <>
          <p>
            <strong>Respect.</strong> Treat everyone with courtesy, whatever
            their background, role, seniority or point of view. Disagree with
            ideas, not with people. Make room for students, newcomers and
            quieter voices.
          </p>
          <p>
            <strong>Inclusion.</strong> Welcome people regardless of gender,
            gender identity, sexual orientation, caste, religion, ethnicity,
            region, language, disability, age, appearance, economic background
            or level of experience.
          </p>
          <p>
            <strong>Honesty.</strong> Represent your qualifications, experience
            and work accurately. Credit the work and ideas of others. Say when
            you do not know something.
          </p>
          <p>
            <strong>Care with data and AI.</strong> Respect privacy and the
            Digital Personal Data Protection Act, 2023. Use data and datasets
            shared through {name} only for the purpose for which they were
            shared. Think about the people affected by the systems you build,
            and be open about the limits of your work.
          </p>
          <p>
            <strong>Good faith.</strong> Act in a way that supports the
            trust&rsquo;s <Link href="/about/objects">charitable objects</Link>{" "}
            and does not bring {name} into disrepute.
          </p>
        </>
      ),
    },
    {
      id: "not-acceptable",
      title: "What is not acceptable",
      body: (
        <>
          <ul>
            <li>
              Harassment of any kind, including sexual harassment, unwelcome
              attention, stalking, and repeated contact after being asked to
              stop.
            </li>
            <li>
              Discrimination, slurs, or jokes and imagery that demean people for
              who they are.
            </li>
            <li>Threats, intimidation, bullying or violence.</li>
            <li>
              Plagiarism, fabricating or falsifying data or results, and other
              research misconduct.
            </li>
            <li>
              Photographing, recording or sharing someone&rsquo;s personal
              information without their consent.
            </li>
            <li>
              Selling, recruiting or promoting a business to other members at
              events or in {name} spaces without the organisers&rsquo;
              permission, and sending unsolicited messages using contact details
              gained through {name}.
            </li>
            <li>
              Claiming to speak for {name}, or misusing its name, logo, a member
              ID, a certificate or the title FASSOCADS.
            </li>
            <li>
              Disrupting events or discussions, or encouraging others to do any
              of the above.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "speaking",
      title: "Speaking for ASSOCADS",
      body: (
        <>
          <p>
            You may say that you are a member of {name}, and in which category.
            Only people the Board of Trustees authorises may speak for {name},
            make commitments in its name, or present a view as its position.
          </p>
          <p>
            Fellows may use the post-nominal title FASSOCADS while they hold the
            fellowship. A member certificate or ID is personal to the member, or
            to the organisation that holds the seat, and may not be lent to
            anyone else.
          </p>
        </>
      ),
    },
    {
      id: "conflicts",
      title: "Conflicts of interest",
      body: (
        <p>
          If you mentor, judge a competition, review a paper or application, or
          serve on a committee, advisory council or panel, tell the organisers
          about any personal, financial or professional interest that could
          affect your judgement, and step aside where it does.
        </p>
      ),
    },
    {
      id: "events",
      title: "At events and online",
      body: (
        <>
          <p>
            Follow the instructions of event organisers and moderators, and the
            rules of the venue or platform. Organisers may ask anyone who breaks
            this code to leave an event or a discussion, without a refund of any
            event fee.
          </p>
          <p>
            {name} publishes photographs of people only with their consent. If
            you do not want to be photographed at an event, tell the organisers.
          </p>
          <p>
            Take extra care with students and anyone under eighteen. Do not
            contact them privately outside the arrangements set up by the
            organisers.
          </p>
        </>
      ),
    },
    {
      id: "reporting",
      title: "Raising a concern",
      body: (
        <>
          <p>
            If you experience or see behaviour that breaks this code, tell an
            event organiser at the time if you can, or write to us through the{" "}
            <Link href={REPORT_HREF}>contact form</Link>, choosing &ldquo;A
            concern about conduct&rdquo;. You can raise a concern about anyone,
            including a trustee or founder.
          </p>
          <p>
            Concerns are treated in confidence and shared only with the people
            who need to act on them. Nobody will be treated badly for raising a
            concern in good faith, or for helping with an inquiry. Retaliation
            is itself a breach of this code.
          </p>
          <p>
            If anyone is in immediate danger, call 112. Raising a concern with{" "}
            {name} does not stop you reporting a matter to the police or another
            authority.
          </p>
        </>
      ),
    },
    {
      id: "breach",
      title: "What happens after a concern is raised",
      body: (
        <>
          <p>
            The Membership sub-committee, or the Board of Trustees where a
            concern involves a member of that sub-committee, looks into it. The
            person concerned is told what is alleged in writing and given a
            chance to respond before any decision is made. Anyone involved in
            the concern takes no part in deciding it.
          </p>
          <p>Depending on how serious the breach is, the outcome may be:</p>
          <ul>
            <li>no action, or advice;</li>
            <li>a written warning;</li>
            <li>
              removal from an event, a group, a role or a title such as Fellow;
            </li>
            <li>suspension from some or all activities for a stated period;</li>
            <li>
              termination of membership, which only the Board can decide, by
              resolution. As the{" "}
              <Link href="/membership#rules">membership rules</Link> say, there
              is no refund when a membership is terminated.
            </li>
          </ul>
          <p>
            Organisers may act at once to keep an event or discussion safe,
            before any inquiry is complete.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to this code",
      body: (
        <p>
          The Board of Trustees may change this code. The date at the top of
          this page shows the current version, and members will be told of any
          significant change.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Membership"
      path="/membership/code-of-conduct"
      title="Code of Conduct"
      lead={`How everyone who takes part in ${name}, the ${site.name}, is expected to behave: members, volunteers, speakers and everyone at its events and in its online spaces. It also explains how to raise a concern and what happens next.`}
      breadcrumbs={[
        { label: "Membership", href: "/membership" },
        { label: "Code of Conduct" },
      ]}
      effective={legalDates.codeOfConduct}
      effectiveLabel="Drafted on"
      reviewTitle="Draft for adoption by the Board"
      reviewNote={
        <Placeholder needed="the Board of Trustees must adopt this Code of Conduct, and the trust's legal advisor review it, before membership applications open" />
      }
      sections={sections}
    />
  );
}
