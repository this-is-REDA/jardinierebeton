import { getBrandSettings } from "@/lib/data/catalog";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export async function WhatsAppButtonWrapper() {
  const brand = await getBrandSettings();

  return (
    <WhatsAppButton
      whatsapp={brand.whatsapp}
      whatsappMessage={brand.whatsappMessage}
    />
  );
}
