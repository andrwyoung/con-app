import { JSX } from "react";
import {
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaDiscord,
  FaLinkedin,
  FaFacebookSquare,
  FaTumblrSquare,
} from "react-icons/fa";
import { FaSquareThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";

export const socialIconMap: Record<string, JSX.Element> = {
  "facebook.com": <FaFacebookSquare />,
  "twitter.com": <FaTwitter />,
  "https://x.com": <FaXTwitter />, // Same icon for now
  "instagram.com": <FaInstagram />,
  "tiktok.com": <FaTiktok className="w-4.5 h-4.5" />,
  "discord.com": <FaDiscord />,
  "linkedin.com": <FaLinkedin />,
  "threads.net": <FaSquareThreads />,
  "youtube.com": <FaYoutube />,
  "tumblr.com": <FaTumblrSquare />,
};

export function parseSocialLinks(
  raw: string
): { href: string; platform: string }[] {
  return raw
    .split(",")
    .map((link) => link.trim())
    .filter((link) => {
      const lower = link.toLowerCase();
      return (
        Boolean(link) &&
        !lower.includes("login") &&
        !lower.includes("facebook.com/events") &&
        !lower.includes("facebook.com/sharer.php")
      );
    })
    .map((href) => {
      const hostname = new URL(href).hostname.toLowerCase();

      const platform =
        Object.keys(socialIconMap).find((key) => hostname.includes(key)) ??
        "other";

      return { href, platform };
    });
}

export default function SocialLinks({ links }: { links: string }) {
  const socials = parseSocialLinks(links);

  return (
    <>
      {socials.length > 0 && (
        <div className="flex gap-3 items-center text-xl text-primary-muted mt-2">
          {socials.map(({ href, platform }, idx) => {
            const icon = socialIconMap[platform];
            if (!icon) return null;

            return (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={platform}
                className="hover:text-primary-darker transition-colors"
              >
                {icon}
              </a>
            );
          })}
        </div>
      )}{" "}
    </>
  );
}
