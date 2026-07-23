import Script from "next/script";
import { brand } from "@/lib/data/site-data";

const QUBOT_WIDGET_ID = "wgt_jIEr5NjHBHlFU_zE7iZxQ8JE";

const VOICE_LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇲🇦" },
  { code: "darija", name: "Darija", flag: "🇲🇦" },
] as const;

const VOICE_LANGUAGES_JSON = JSON.stringify(VOICE_LANGUAGES);

export function VoiceWidget() {
  return (
    <>
      <Script id="qubot-voice-languages" strategy="afterInteractive">
        {`(function(){
  var languages = ${VOICE_LANGUAGES_JSON};
  var originalFetch = window.fetch;
  if (!originalFetch || originalFetch.__jardiniereVoicePatched) return;
  function patchedFetch(input, init) {
    var url = typeof input === "string" ? input : input && input.url;
    return originalFetch.call(this, input, init).then(function(response) {
      if (!url || url.indexOf("/api/public/widget/config/") === -1) {
        return response;
      }
      return response.json().then(function(data) {
        data.supportedLanguages = languages;
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: { "Content-Type": "application/json" },
        });
      });
    });
  }
  patchedFetch.__jardiniereVoicePatched = true;
  window.fetch = patchedFetch;
})();`}
      </Script>
      <Script id="qubot-voice-widget" strategy="afterInteractive">
        {`(function(w,d,s,o,f,js){
    w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);js.id=o;js.src=f;js.async=1;
    (d.head||d.body).appendChild(js);
  }(window,document,'script','vw','https://qubot.app/widget/embed.js'));
  vw('init', '${QUBOT_WIDGET_ID}');`}
      </Script>
      <Script id="qubot-voice-branding" strategy="afterInteractive">
        {`(function(){
  var logo = "${brand.logo}";
  var languages = ${VOICE_LANGUAGES_JSON};
  function getLang(code) {
    for (var i = 0; i < languages.length; i++) {
      if (languages[i].code === code) return languages[i];
    }
    return languages[0];
  }
  function patchAvatars(root) {
    root.querySelectorAll(".vw-avatar-img, .vw-avatar-img-lg").forEach(function(img) {
      if (img.getAttribute("src") !== logo) {
        img.setAttribute("src", logo);
        img.setAttribute("alt", "Jardinière Béton");
      }
    });
  }
  function patchLanguageMenu(root) {
    var dropdown = root.querySelector("#vw-lang-dropdown");
    var flagEl = root.querySelector("#vw-lang-flag");
    if (!dropdown || !flagEl || dropdown.getAttribute("data-jb-langs") === "1") return;
    var selected = dropdown.querySelector(".vw-selected");
    var current = selected ? selected.getAttribute("data-lang") : "fr";
    if (!getLang(current)) current = "fr";
    dropdown.innerHTML = languages.map(function(lang) {
      return '<button class="vw-lang-option' + (lang.code === current ? " vw-selected" : "") + '" data-lang="' + lang.code + '">' +
        '<span class="vw-lang-option-flag">' + lang.flag + "</span>" +
        '<span class="vw-lang-option-name">' + lang.name + "</span></button>";
    }).join("");
    dropdown.setAttribute("data-jb-langs", "1");
    flagEl.textContent = getLang(current).flag;
  }
  function enhance(root) {
    patchAvatars(root);
    patchLanguageMenu(root);
  }
  function watchContainer(container) {
    enhance(container);
    new MutationObserver(function() {
      enhance(container);
    }).observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });
  }
  function boot() {
    var container = document.getElementById("vw-container");
    if (container) {
      watchContainer(container);
      return;
    }
    new MutationObserver(function(_, observer) {
      var next = document.getElementById("vw-container");
      if (!next) return;
      observer.disconnect();
      watchContainer(next);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();`}
      </Script>
    </>
  );
}
