interface MediaPlaceholderProps {
  label: string;
  sublabel?: string;
  className?: string;
  aspectClass?: string;
}

export function MediaPlaceholder({
  label,
  sublabel,
  className = "",
  aspectClass = "aspect-[4/3]",
}: MediaPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center border border-[rgba(232,226,211,0.1)] bg-[linear-gradient(145deg,#2a2624_0%,#1c1917_100%)] ${aspectClass} ${className}`}
    >
      <div className="px-6 text-center">
        <p className="font-serif text-lg text-[#e8e2d3] sm:text-xl">{label}</p>
        {sublabel && (
          <p className="mt-2 text-[0.65rem] tracking-[0.18em] text-[#a6917c] uppercase">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
