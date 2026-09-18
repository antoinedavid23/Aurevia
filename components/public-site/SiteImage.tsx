import NextImage, { type ImageProps } from "next/image";

/**
 * Sites serves the original public assets directly. Disabling Next's runtime
 * optimizer avoids the unsupported /_vinext/image endpoint in production.
 */
export default function SiteImage(props: ImageProps) {
  return <NextImage {...props} unoptimized />;
}
