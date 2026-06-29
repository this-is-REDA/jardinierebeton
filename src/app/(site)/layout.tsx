import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButtonWrapper } from "@/components/layout/WhatsAppButtonWrapper";
import { VoiceWidget } from "@/components/layout/VoiceWidget";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButtonWrapper />
      <VoiceWidget />
    </>
  );
}
