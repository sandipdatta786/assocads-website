/**
 * The downloadable logo files in public/brand/kit/, copied unchanged from the
 * master files in docs/logo/. To update them, replace the files in docs/logo/
 * and copy svg/ and png/ into public/brand/kit/ again.
 */

export const KIT = "/brand/kit";

export const colourVersions = [
  {
    key: "colour",
    label: "Colour",
    use: "On white or light backgrounds. The first choice.",
  },
  {
    key: "colour-on-dark",
    label: "Colour on dark",
    use: "On Ink and other very dark backgrounds.",
  },
  { key: "indigo", label: "Indigo", use: "One-colour print on light stock." },
  {
    key: "black",
    label: "Black",
    use: "Stamps, engraving and black-and-white print.",
  },
  {
    key: "white",
    label: "White",
    use: "On Indigo or a dark photograph panel.",
  },
] as const;

type Version = (typeof colourVersions)[number]["key"];

export const logoLayouts: {
  key: string;
  label: string;
  use: string;
  prefix: string;
  versions: Version[];
}[] = [
  {
    key: "horizontal",
    label: "Horizontal",
    use: "The default: website header, letterhead, slides and email footers.",
    prefix: "assocads-logo-horizontal",
    versions: ["colour", "colour-on-dark", "indigo", "black", "white"],
  },
  {
    key: "horizontal-no-descriptor",
    label: "Horizontal, without descriptor",
    use: "Small sizes and tight spaces, below about 160px wide.",
    prefix: "assocads-logo-horizontal-no-descriptor",
    versions: ["colour", "colour-on-dark", "indigo", "black", "white"],
  },
  {
    key: "stacked",
    label: "Stacked",
    use: "Square spaces, posters, certificates and event backdrops.",
    prefix: "assocads-logo-stacked",
    versions: ["colour", "colour-on-dark", "indigo", "black", "white"],
  },
  {
    key: "symbol",
    label: "Symbol",
    use: "Where the name already appears close by.",
    prefix: "assocads-symbol",
    versions: ["colour", "colour-on-dark", "indigo", "black", "white"],
  },
];

export const appIcons = [
  { label: "App icon, rounded", file: "assocads-app-icon" },
  { label: "App icon, square", file: "assocads-app-icon-square" },
];

/** The brand colours, from docs/BRAND_GUIDE.md section 2.1. */
export const brandColours = [
  {
    name: "Ink",
    hex: "#0B1020",
    swatch: "bg-ink",
    role: "Headings, body text and dark sections",
  },
  {
    name: "ASSOCADS Indigo",
    hex: "#2F3BD9",
    swatch: "bg-indigo",
    role: "Buttons, links and the logo",
  },
  {
    name: "Marigold",
    hex: "#F2A31B",
    swatch: "bg-marigold",
    role: "One highlight per screen, on dark or as a fill",
  },
  {
    name: "Indigo Bright",
    hex: "#8791FF",
    swatch: "bg-indigo-bright",
    role: "Links and accents on dark backgrounds",
  },
  {
    name: "Cloud",
    hex: "#F5F6F8",
    swatch: "bg-cloud",
    role: "Alternate backgrounds and cards",
  },
  {
    name: "Paper",
    hex: "#FFFFFF",
    swatch: "bg-paper",
    role: "The main background",
  },
] as const;

export const typefaces = [
  {
    name: "Inter Tight",
    use: "Headings",
    className: "font-display font-semibold",
  },
  { name: "Inter", use: "Body text and interface", className: "font-text" },
  {
    name: "JetBrains Mono",
    use: "Labels, figures and code",
    className: "font-mono",
  },
] as const;
