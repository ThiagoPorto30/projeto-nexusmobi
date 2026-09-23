import Image from "next/image";
export function Brand({ href = "#" }: { href?: string }) {
  return (
    <a href={href} aria-label="nexus.mobi — início" className="brand">
      <span className="brand-crop">
        <Image
          src="/brand/nexus-profile.jpg"
          alt="Nexus Mobilidade Urbana"
          width={150}
          height={150}
          priority
        />
      </span>
    </a>
  );
}
