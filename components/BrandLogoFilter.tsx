/** Render the existing no-tagline artwork without its dark presentation canvas.
 * The source file stays byte-for-byte identical to the approved brand export.
 */
export function BrandLogoFilter() {
  return <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
    <defs>
      <filter id="aurevia-logo-cutout" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  .6 1.6 .2 0 -.32" />
      </filter>
    </defs>
  </svg>;
}
