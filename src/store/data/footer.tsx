import {
  DASHBOARD_ABOUT_US_ROUTE,
  LEGAL_TERMS_AND_CONDITIONS_ROUTE,
  LEGAL_PRIVACY_POLICY_ROUTE,
  LEGAL_COOKIES_RULES_ROUTE,
  LEGAL_BILLING_POLICY_ROUTE,
  LEGAL_COPYRIGHT_INFRINGEMENT_POLICY_ROUTE,
  LEGAL_ROUTE,
  LEGAL_AGENT_ACQUISITION_EXPERT_ROUTE,
} from "@/constants/routes";
import { cn } from "@/utils";
import { InstagramLogo } from "@/components/atom/icons/InstagramLogo";
import { TwitterLogo } from "@/components/atom/icons/TwitterLogo";
import { LinkedinLogo } from "@/components/atom/icons/LinkedinLogo";
import { FacebookLogo } from "@/components/atom/icons/FacebookLogo";
import { YoutubeLogo } from "@/components/atom/icons/YoutubeLogo";
import { PlayStoreIcon } from "@/components/atom/icons/PlayStoreIcon";
import { AppleStoreIcon } from "@/components/atom/icons/AppleStore";
import React from "react";

export interface FooterLink {
  title: string;
  href: string;
}

export const footer: FooterLink[] = [
  {
    title: "About Lata.ng",
    href: DASHBOARD_ABOUT_US_ROUTE,
  },
  {
    title: "Terms & Condition",
    href: LEGAL_TERMS_AND_CONDITIONS_ROUTE,
  },
  {
    title: "Privacy Policy",
    href: LEGAL_PRIVACY_POLICY_ROUTE,
  },
  {
    title: "Cookie Policy",
    href: LEGAL_COOKIES_RULES_ROUTE,
  },
  {
    title: "Billing Policy",
    href: LEGAL_BILLING_POLICY_ROUTE,
  },
  {
    title: "Copyright Infringement Policy",
    href: LEGAL_COPYRIGHT_INFRINGEMENT_POLICY_ROUTE,
  },
  {
    title: "Agent Acquisition Expert",
    href: LEGAL_AGENT_ACQUISITION_EXPERT_ROUTE,
  },
];

export const footerContactUs: React.ReactNode[] = [
  <p key={'a'}>N0 14, Police Estate, Off Karu, Abacha Road, FCT Abuja.</p>,
  <p key={'d'}>Lata.ng@gmail.com</p>,
  <p key={'s'}>+2349069394365</p>,
  <div
    className={cn(`
      flex
      gap-[0.4375rem]
      tablet:gap-[0.5rem]
    `)}
    key={'k'}
  >
    <a
      href="https://instagram.com/lata.ngonline?igshid=MzNlNGNkZWQ4Mg=="
      target="_blank"
      rel="noreferrer"
    >
      <InstagramLogo
        className={"w-4 h-4 tablet:w-[1.125rem] tablet:h-[1.125rem]"}
      />
    </a>
    <a
      href="https://twitter.com/lata_ng?t=VHapvvFRqLsKnBtXq7pG_Q&s=09"
      target="_blank"
      rel="noreferrer"
    >
      <TwitterLogo
        className={"w-4 h-4 tablet:w-[1.125rem] tablet:h-[1.125rem]"}
      />
    </a>
    <a
      href="https://www.linkedin.com/mwlite/company/lata-ng"
      target="_blank"
      rel="noreferrer"
    >
      <LinkedinLogo
        className={"w-4 h-4 tablet:w-[1.125rem] tablet:h-[1.125rem]"}
      />
    </a>
    <a
      href="https://www.facebook.com/lata.ngonline"
      target="_blank"
      rel="noreferrer"
    >
      <FacebookLogo
        className={"w-4 h-4 tablet:w-[1.125rem] tablet:h-[1.125rem]"}
      />
    </a>
    <a
      href="https://m.youtube.com/channel/UCa78cGR5EOhv3Wv9oO6PfJA"
      target="_blank"
      rel="noreferrer"
    >
      <YoutubeLogo
        className={"w-4 h-4 tablet:w-[1.125rem] tablet:h-[1.125rem]"}
      />
    </a>
  </div>,
];

export const footerDownloadApps: React.ReactNode[] = [
  <div className={"flex flex-col gap-y-2"} key={"footerDownloadApps"}>
    <PlayStoreIcon className={"cursor-pointer"} />
    <AppleStoreIcon className={"cursor-pointer"} />
  </div>,
];
