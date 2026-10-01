import type { SVGProps } from "react";

/**
 * Google's four-color "G" mark. These are the logo's own brand colors
 * (the mark itself), not app UI colors — they intentionally don't use
 * the design-system tokens, the same way a Visa or Apple Pay mark
 * wouldn't be recolored to match a host app's theme.
 */
export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.98 13.98 0 0 1 10.94 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/** Discord's "Clyde" mark, rendered in a single currentColor path so it
 * inherits the button's foreground token instead of Discord's brand blurple. */
export function DiscordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.32 5.37a18.6 18.6 0 0 0-4.6-1.43.07.07 0 0 0-.08.04c-.2.36-.42.82-.57 1.19a17.2 17.2 0 0 0-5.15 0 8.4 8.4 0 0 0-.58-1.19.07.07 0 0 0-.08-.04c-1.6.28-3.14.76-4.6 1.43a.07.07 0 0 0-.03.03C1.6 9.9.87 14.28 1.23 18.61a.08.08 0 0 0 .03.05 18.7 18.7 0 0 0 5.63 2.85.07.07 0 0 0 .08-.03 13.4 13.4 0 0 0 1.15-1.87.07.07 0 0 0-.04-.1 12.3 12.3 0 0 1-1.76-.84.07.07 0 0 1 0-.12c.12-.09.24-.18.35-.27a.07.07 0 0 1 .07-.01c3.7 1.69 7.7 1.69 11.36 0a.07.07 0 0 1 .07.01c.11.09.23.18.35.27a.07.07 0 0 1 0 .12c-.56.33-1.15.6-1.76.84a.07.07 0 0 0-.04.1c.34.66.72 1.29 1.15 1.87a.07.07 0 0 0 .08.03 18.6 18.6 0 0 0 5.64-2.85.07.07 0 0 0 .03-.05c.44-5-.73-9.35-3.1-13.21a.06.06 0 0 0-.03-.03zM8.68 15.9c-1.1 0-2.01-1.02-2.01-2.27 0-1.24.89-2.26 2.01-2.26 1.13 0 2.03 1.03 2.01 2.26 0 1.25-.88 2.27-2.01 2.27zm6.65 0c-1.11 0-2.01-1.02-2.01-2.27 0-1.24.89-2.26 2.01-2.26 1.13 0 2.03 1.03 2.01 2.26 0 1.25-.88 2.27-2.01 2.27z" />
    </svg>
  );
}
