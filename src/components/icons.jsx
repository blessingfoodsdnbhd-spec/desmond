// 轻量线性图标（Apple 风格，1.6 描边）
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function Icon({ path, size = 22, children, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
      {children}
    </svg>
  )
}

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Icon>
)
export const DesignIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3a9 9 0 1 0 0 18" />
    <path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="1.5 3" />
    <circle cx="12" cy="3.4" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="20.4" cy="15" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
)
export const DiscoverIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </Icon>
)
export const OrderIcon = (p) => (
  <Icon {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </Icon>
)
export const UserIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
  </Icon>
)
export const SparkleIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3.5c.4 3.6 1.9 5.1 5.5 5.5-3.6.4-5.1 1.9-5.5 5.5-.4-3.6-1.9-5.1-5.5-5.5 3.6-.4 5.1-1.9 5.5-5.5Z" />
    <path d="M18.5 15c.2 1.6.8 2.2 2.4 2.4-1.6.2-2.2.8-2.4 2.4-.2-1.6-.8-2.2-2.4-2.4 1.6-.2 2.2-.8 2.4-2.4Z" />
  </Icon>
)
export const EnergyIcon = (p) => (
  <Icon {...p}>
    <path d="M13 3 5 13h6l-1 8 8-11h-6z" />
  </Icon>
)
export const OrderTagIcon = (p) => (
  <Icon {...p}>
    <path d="M3.5 12.5 12 21l8.5-8.5V4a.5.5 0 0 0-.5-.5h-8.5z" />
    <circle cx="8.5" cy="8" r="1.4" />
  </Icon>
)
export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M4 6.5h16M9 6.5V4.5h6v2M6 6.5 7 20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13.5" />
    <path d="M10 10.5v6M14 10.5v6" />
  </Icon>
)
export const UndoIcon = (p) => (
  <Icon {...p}>
    <path d="M9 7 4.5 11.5 9 16" />
    <path d="M4.5 11.5H15a4.5 4.5 0 0 1 0 9h-3" />
  </Icon>
)
export const RedoIcon = (p) => (
  <Icon {...p}>
    <path d="m15 7 4.5 4.5L15 16" />
    <path d="M19.5 11.5H9a4.5 4.5 0 0 0 0 9h3" />
  </Icon>
)
export const ShuffleIcon = (p) => (
  <Icon {...p}>
    <path d="M3 6.5h3.5c1.5 0 2.5.8 3.5 2l4 6c1 1.2 2 2 3.5 2H21" />
    <path d="M3 17.5h3.5c1.5 0 2.5-.8 3.5-2M14 8.5c1-1.2 2-2 3.5-2H21" />
    <path d="m18.5 4 2.5 2.5L18.5 9M18.5 15l2.5 2.5L18.5 20" />
  </Icon>
)
export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)
export const ChevronRight = (p) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
)
export const ArrowLeft = (p) => (
  <Icon {...p}>
    <path d="M15 5 8 12l7 7" />
    <path d="M8 12h11" />
  </Icon>
)
export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Icon>
)
export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
  </Icon>
)
export const MoonIcon = (p) => (
  <Icon {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </Icon>
)
export const DownloadIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v11M8 11l4 4 4-4" />
    <path d="M5 19h14" />
  </Icon>
)
export const ShareIcon = (p) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
  </Icon>
)
export const PdfIcon = (p) => (
  <Icon {...p}>
    <path d="M7 3.5h7L19 8v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
    <path d="M14 3.5V8h5" />
    <path d="M9 14h1.2a1.2 1.2 0 0 0 0-2.4H9V17" />
  </Icon>
)
export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)
export const WhatsAppIcon = ({ size = 22, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...rest}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24Zm-3.4 4.44c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34 1 2.5c.12.17 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41-.14 0-.3-.01-.46-.01Z" />
  </svg>
)
export const WandIcon = (p) => (
  <Icon {...p}>
    <path d="m4 20 10-10" />
    <path d="M14.5 5.5 16 4M18.5 9.5 20 8M15.5 9.5 17 8" />
    <path d="m13 7 4 4" />
    <path d="M6 4.5 6.6 6l1.5.6L6.6 7.2 6 8.7 5.4 7.2 3.9 6.6 5.4 6z" fill="currentColor" stroke="none" />
  </Icon>
)
