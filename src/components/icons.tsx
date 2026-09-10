// Iconsax adapter — barcha ikonalar iconsax-react'dan.
// Consumerlar o'zgarmasligi uchun eski Icon* nomlari saqlanadi.
// className forward qilinadi (Tailwind h-/w- bilan o'lcham), color=currentColor (matn rangini oladi).

import {
  Home2,
  People,
  Profile,
  DocumentText,
  DocumentText1,
  DocumentDownload,
  ClipboardText,
  DirectInbox,
  Edit2,
  Chart,
  LogoutCurve,
  ArrowDown2,
  CloseCircle,
  TickCircle,
  ScanBarcode,
  Add,
  HambergerMenu,
  Personalcard,
  SearchNormal1,
  type IconProps,
  type Icon,
} from "iconsax-react";

type P = { className?: string } & Omit<IconProps, "color" | "variant" | "ref">;

const wrap =
  (Ic: Icon) =>
  ({ className, ...rest }: P) => (
    <Ic className={className} color="currentColor" variant="Linear" {...rest} />
  );

export const IconHome = wrap(Home2);
export const IconUsers = wrap(People);
export const IconUser = wrap(Profile);
export const IconFile = wrap(DocumentText);
export const IconClipboard = wrap(ClipboardText);
export const IconInbox = wrap(DirectInbox);
export const IconEdit = wrap(Edit2);
export const IconChart = wrap(Chart);
export const IconLogout = wrap(LogoutCurve);
export const IconChevronDown = wrap(ArrowDown2);
export const IconClose = wrap(CloseCircle);
export const IconCheck = wrap(TickCircle);
export const IconX = wrap(CloseCircle);
export const IconQr = wrap(ScanBarcode);
export const IconPlus = wrap(Add);
export const IconMenu = wrap(HambergerMenu);
export const IconIdCard = wrap(Personalcard);
export const IconDocument = wrap(DocumentText1);
export const IconDownload = wrap(DocumentDownload);
export const IconSearch = wrap(SearchNormal1);
