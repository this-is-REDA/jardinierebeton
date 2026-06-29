import Script from "next/script";

const QUBOT_WIDGET_ID = "wgt_wh6lRYs9eYeO9ZwAAaxoiHWx";

export function VoiceWidget() {
  return (
    <Script id="qubot-voice-widget" strategy="afterInteractive">
      {`(function(w,d,s,o,f,js){
    w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);js.id=o;js.src=f;js.async=1;
    (d.head||d.body).appendChild(js);
  }(window,document,'script','vw','https://qubot.app/widget/embed.js'));
  vw('init', '${QUBOT_WIDGET_ID}');`}
    </Script>
  );
}
