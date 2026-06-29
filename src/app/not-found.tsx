import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="label-caps">404</p>
      <h1 className="mt-4 font-serif text-4xl text-[#e8e2d3]">
        Page introuvable
      </h1>
      <Link href="/" className="btn-primary mt-8">
        Retour à l&apos;accueil →
      </Link>
    </div>
  );
}
