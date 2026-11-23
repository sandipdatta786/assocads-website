"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export type HeaderMenuLink = {
  label: string;
  href: string;
  description?: string;
};

export type HeaderItem = {
  label: string;
  href: string;
  menu?: HeaderMenuLink[];
  /** An optional second group shown beside the main links, for example audiences. */
  aside?: { heading: string; links: HeaderMenuLink[] };
};

type HeaderNavProps = {
  items: HeaderItem[];
  more: HeaderMenuLink[];
  join: HeaderMenuLink;
  /** The server-rendered logo link, so the logo stays a server component. */
  logo: ReactNode;
};

const matches = (pathname: string, href: string) =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);

function sectionIsCurrent(pathname: string, item: HeaderItem) {
  return (
    matches(pathname, item.href) ||
    (item.menu ?? []).some((link) => matches(pathname, link.href)) ||
    (item.aside?.links ?? []).some((link) => matches(pathname, link.href))
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function HeaderNav({ items, more, join, logo }: HeaderNavProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  const headerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  // Close every menu when the page changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Hairline border once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Desktop dropdown: close on Escape or on a click outside the header.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        triggerRefs.current[openMenu]?.focus();
        setOpenMenu(null);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  // Mobile panel: lock page scrolling, trap focus, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const menuButton = menuButtonRef.current;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [
        ...panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      menuButton?.focus();
    };
  }, [mobileOpen]);

  const toggleGroup = (label: string) =>
    setOpenGroups((groups) =>
      groups.includes(label)
        ? groups.filter((g) => g !== label)
        : [...groups, label],
    );

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const activeItem = items.find((item) => item.label === openMenu);

  const renderPanel = (item: HeaderItem) => (
    <div
      id={`${baseId}-${item.label}`}
      hidden={activeItem?.label !== item.label}
      className="menu-panel absolute inset-x-0 top-full hidden border-b border-line bg-paper lg:block"
    >
      <Container className="grid grid-cols-12 gap-6 py-10">
        <ul
          className={cn(
            "grid gap-x-6 gap-y-2",
            item.aside ? "col-span-9 grid-cols-3" : "col-span-12 grid-cols-3",
          )}
        >
          {item.menu!.map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                onClick={closeAll}
                aria-current={pathname === link.href ? "page" : undefined}
                className="group flex min-h-11 flex-col justify-center rounded-s px-3 py-2.5 hover:bg-cloud aria-[current=page]:bg-indigo-tint"
              >
                <span className="text-small font-semibold text-ink">
                  {link.label}
                </span>
                {link.description && (
                  <span className="text-caption text-slate-600">
                    {link.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {item.aside && (
          <div className="col-span-3 border-l border-line pl-6">
            <p className="px-3 pb-2 font-mono text-eyebrow font-medium text-slate-500 uppercase">
              {item.aside.heading}
            </p>
            <ul className="flex flex-col gap-1">
              {item.aside.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeAll}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="flex min-h-11 items-center rounded-s px-3 text-small font-medium text-ink hover:bg-cloud aria-[current=page]:bg-indigo-tint"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );

  return (
    <div
      ref={headerRef}
      onBlur={(event) => {
        if (
          openMenu &&
          !headerRef.current?.contains(event.relatedTarget as Node)
        ) {
          setOpenMenu(null);
        }
      }}
    >
      <div
        className={cn(
          "border-b transition-colors duration-300 ease-out",
          scrolled || openMenu
            ? "border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-paper/70 backdrop-blur-xl",
          openMenu && "bg-paper",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          {logo}

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {items.map((item) => {
                const current = sectionIsCurrent(pathname, item);
                const panelId = `${baseId}-${item.label}`;
                const linkClass = cn(
                  "inline-flex min-h-11 items-center gap-1 rounded-pill px-3.5 text-small font-medium transition-colors duration-150",
                  current ? "text-ink" : "text-slate-600 hover:text-ink",
                );
                return (
                  <li key={item.label}>
                    {item.menu ? (
                      <>
                        <button
                          type="button"
                          ref={(el) => {
                            triggerRefs.current[item.label] = el;
                          }}
                          aria-expanded={openMenu === item.label}
                          aria-controls={panelId}
                          aria-current={current ? "true" : undefined}
                          onClick={() =>
                            setOpenMenu((open) =>
                              open === item.label ? null : item.label,
                            )
                          }
                          className={cn(linkClass, current && "nav-current")}
                        >
                          {item.label}
                          <ChevronDown
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1.5}
                            className={cn(
                              "transition-transform duration-300 ease-out",
                              openMenu === item.label && "rotate-180",
                            )}
                          />
                        </button>
                        {renderPanel(item)}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={
                          pathname === item.href
                            ? "page"
                            : current
                              ? "true"
                              : undefined
                        }
                        className={cn(linkClass, current && "nav-current")}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <ButtonLink href={join.href}>{join.label}</ButtonLink>
            </span>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-controls={`${baseId}-mobile`}
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-pill text-ink hover:bg-cloud lg:hidden"
            >
              <Menu aria-hidden="true" size={24} strokeWidth={1.5} />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div
          ref={panelRef}
          id={`${baseId}-mobile`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="menu-panel fixed inset-0 z-50 flex h-dvh flex-col bg-paper lg:hidden"
        >
          <Container className="flex h-16 shrink-0 items-center justify-between border-b border-line">
            <span onClick={closeAll}>{logo}</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-pill text-ink hover:bg-cloud"
            >
              <X aria-hidden="true" size={24} strokeWidth={1.5} />
              <span className="sr-only">Close menu</span>
            </button>
          </Container>

          <nav
            aria-label="Main"
            className="flex-1 overflow-y-auto overscroll-contain"
          >
            <Container className="py-4">
              <ul className="flex flex-col">
                {items.map((item) => {
                  const current = sectionIsCurrent(pathname, item);
                  const groupId = `${baseId}-group-${item.label}`;
                  const expanded = openGroups.includes(item.label);
                  const links = [
                    ...(item.menu ?? []),
                    ...(item.aside?.links ?? []),
                  ];
                  return (
                    <li key={item.label} className="border-b border-line">
                      {item.menu ? (
                        <>
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={groupId}
                            onClick={() => toggleGroup(item.label)}
                            className={cn(
                              "flex min-h-14 w-full items-center justify-between font-display text-h3 font-semibold",
                              current ? "text-indigo" : "text-ink",
                            )}
                          >
                            {item.label}
                            <ChevronDown
                              aria-hidden="true"
                              size={22}
                              strokeWidth={1.5}
                              className={cn(
                                "transition-transform duration-300 ease-out",
                                expanded && "rotate-180",
                              )}
                            />
                          </button>
                          <ul id={groupId} hidden={!expanded} className="pb-3">
                            {links.map((link) => (
                              <li key={link.href + link.label}>
                                <Link
                                  href={link.href}
                                  onClick={closeAll}
                                  aria-current={
                                    pathname === link.href ? "page" : undefined
                                  }
                                  className="flex min-h-11 items-center pl-4 text-body text-slate-600 hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-indigo"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={closeAll}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                          className={cn(
                            "flex min-h-14 items-center font-display text-h3 font-semibold",
                            current ? "text-indigo" : "text-ink",
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ul className="flex flex-col py-4">
                {more.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeAll}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className="flex min-h-11 items-center text-body text-slate-600 hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-indigo"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>

          <div className="shrink-0 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]">
            <Container className="py-4">
              <ButtonLink
                href={join.href}
                size="large"
                onClick={closeAll}
                className="w-full"
              >
                {join.label}
              </ButtonLink>
            </Container>
          </div>
        </div>
      )}
    </div>
  );
}
