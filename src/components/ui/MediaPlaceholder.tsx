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
      className={`flex items-center justify-center border border-[rgba(0, 0, 0,0.1)] bg-[linear-gradient(145deg,#f5f5f5_0%,#ffffff_100%)] ${aspectClass} ${className}`}
    >
      <div className="px-6 text-center">
        <p className="font-serif text-lg text-[#171717] sm:text-xl">{label}</p>
        {sublabel && (
          <p className="mt-2 text-[0.65rem] tracking-[0.18em] text-[#a3a3a3] uppercase">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
