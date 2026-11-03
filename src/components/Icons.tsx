import type { SVGProps } from 'react';
import type { QrType } from '../lib/payload';

type IconProps = SVGProps<SVGSVGElement>;

const Svg = ({ children, ...props }: IconProps) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        {children}
    </svg>
);

export const LinkIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </Svg>
);
export const TextIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M5 6h14M5 12h14M5 18h9" />
    </Svg>
);
export const WifiIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
        <circle cx="12" cy="19.5" r="0.8" fill="currentColor" />
    </Svg>
);
export const ContactIcon = (p: IconProps) => (
    <Svg {...p}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="11" r="2.5" />
        <path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9.5h3M15 13h3" />
    </Svg>
);
export const MailIcon = (p: IconProps) => (
    <Svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
    </Svg>
);
export const SmsIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M8 10h8" />
    </Svg>
);
export const PhoneIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </Svg>
);
export const RupeeIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M7 5h10M7 9h10M10 5c3 0 5 1.5 5 4s-2 4-5 4H7l7 6" />
    </Svg>
);
export const PinIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21" />
        <circle cx="12" cy="9.5" r="2.5" />
    </Svg>
);
export const DownloadIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
    </Svg>
);
export const CopyIcon = (p: IconProps) => (
    <Svg {...p}>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </Svg>
);
export const ShareIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 15V4m-4 4 4-4 4 4M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
    </Svg>
);
export const CheckIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
);
export const AlertIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 3 2 20h20zM12 10v4" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </Svg>
);
export const TrashIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </Svg>
);
export const SunIcon = (p: IconProps) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
);
export const MoonIcon = (p: IconProps) => (
    <Svg {...p}>
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5" />
    </Svg>
);
export const AutoIcon = (p: IconProps) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
    </Svg>
);

// eslint-disable-next-line react-refresh/only-export-components
export const TYPE_ICONS: Record<QrType, (p: IconProps) => React.JSX.Element> = {
    url: LinkIcon,
    text: TextIcon,
    wifi: WifiIcon,
    contact: ContactIcon,
    email: MailIcon,
    sms: SmsIcon,
    phone: PhoneIcon,
    upi: RupeeIcon,
    location: PinIcon
};

/** The app mark: a single QR finder pattern. */
export const Mark = (p: IconProps) => (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false" {...p}>
        <rect x="1" y="1" width="26" height="26" rx="5" fill="var(--accent)" />
        <rect x="6" y="6" width="16" height="16" rx="2.5" fill="none" stroke="var(--on-accent)" strokeWidth="2.6" />
        <rect x="10.5" y="10.5" width="7" height="7" rx="1" fill="var(--signal)" />
    </svg>
);
