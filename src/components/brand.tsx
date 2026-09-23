import Image from "next/image";
export function Brand() {
  return (
    <a href="#" aria-label="nexus.mobi — início" className="brand">
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
