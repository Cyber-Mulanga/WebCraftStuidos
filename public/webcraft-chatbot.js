(function () {
  const API_ENDPOINT = "https://webcraft-chat.onrender.com/api/chat";

  const style = document.createElement("style");
  style.textContent = `
    #wc-chat-toggle {
      position:fixed; bottom:160px; right:24px;
      width:58px; height:58px; border-radius:50%;
      background:linear-gradient(135deg,#6c63ff,#3ecfcf);
      border:none; cursor:pointer;
      box-shadow:0 4px 20px rgba(108,99,255,.55);
      display:flex; align-items:center; justify-content:center;
      z-index:9999; transition:transform .25s ease, box-shadow .25s ease;
    }
    #wc-chat-toggle:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(108,99,255,.7);}
    #wc-chat-toggle svg{width:26px;height:26px;fill:#fff;}
    #wc-chat-toggle::after{
      content:'';position:absolute;top:4px;right:4px;
      width:12px;height:12px;background:#ff4e6a;
      border-radius:50%;border:2px solid #0f0f1a;
      animation:wc-pulse 2s infinite;
    }
    #wc-chat-toggle.wc-open::after{display:none;}
    @keyframes wc-pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.3);opacity:.7;}}
    #wc-chatbox{
      position:fixed;bottom:230px;right:24px;
      width:380px;max-height:580px;border-radius:20px;
      background:#13131f;border:1px solid rgba(108,99,255,.35);
      box-shadow:0 20px 60px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.04);
      display:flex;flex-direction:column;overflow:hidden;
      z-index:9998;
      transform:translateY(20px) scale(.95);opacity:0;pointer-events:none;
      transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .25s ease;
      font-family:'Manrope',sans-serif;
    }
    #wc-chatbox.wc-visible{transform:translateY(0) scale(1);opacity:1;pointer-events:all;}
    .wc-header{
      padding:16px 20px;
      background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);
      border-bottom:1px solid rgba(108,99,255,.2);
      display:flex;align-items:center;gap:12px;flex-shrink:0;
    }
    .wc-avatar{
      width:40px;height:40px;border-radius:50%;
      background:linear-gradient(135deg,#6c63ff,#3ecfcf);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;flex-shrink:0;box-shadow:0 0 12px rgba(108,99,255,.5);
    }
    .wc-header-info h4{margin:0;font-size:14px;font-weight:700;color:#fff;letter-spacing:.3px;}
    .wc-header-info p{margin:2px 0 0;font-size:11px;color:#3ecfcf;display:flex;align-items:center;gap:5px;}
    .wc-header-info p::before{content:'';width:7px;height:7px;background:#3ecfcf;border-radius:50%;animation:wc-pulse 2s infinite;}
    .wc-close-btn{margin-left:auto;background:none;border:none;color:#888;font-size:20px;cursor:pointer;line-height:1;padding:4px;transition:color .2s;}
    .wc-close-btn:hover{color:#fff;}
    .wc-messages{
      flex:1;overflow-y:auto;padding:16px;
      display:flex;flex-direction:column;gap:12px;
      scrollbar-width:thin;scrollbar-color:rgba(108,99,255,.3) transparent;
    }
    .wc-messages::-webkit-scrollbar{width:4px;}
    .wc-messages::-webkit-scrollbar-thumb{background:rgba(108,99,255,.3);border-radius:4px;}
    .wc-msg{
      max-width:90%;border-radius:16px;
      font-size:13.5px;line-height:1.6;animation:wc-fadeup .3s ease;
      overflow:hidden;
    }
    @keyframes wc-fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .wc-msg.user{
      padding:10px 14px;
      background:linear-gradient(135deg,#6c63ff,#4f46e5);color:#fff;
      align-self:flex-end;border-bottom-right-radius:4px;
      box-shadow:0 4px 14px rgba(108,99,255,.35);
    }
    .wc-msg.bot{
      background:rgba(108,99,255,.10);border:1px solid rgba(108,99,255,.2);
      color:#d4d4e8;align-self:flex-start;border-bottom-left-radius:4px;
    }

    /* ── Structured message blocks ── */
    .wc-text { padding:10px 14px; }
    .wc-category {
      padding:7px 14px 4px;
      font-size:11px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;color:#a78bfa;
      border-top:1px solid rgba(108,99,255,.2);
    }
    .wc-category:first-child { border-top:none; padding-top:10px; }
    .wc-package {
      display:flex;align-items:baseline;justify-content:space-between;
      padding:5px 14px;gap:8px;
      border-bottom:1px solid rgba(255,255,255,.04);
    }
    .wc-package:last-of-type { border-bottom:none; padding-bottom:10px; }
    .wc-pkg-name { color:#d4d4e8; font-size:13px; }
    .wc-pkg-price { color:#3ecfcf; font-weight:700; font-size:13px; white-space:nowrap; }
    .wc-pkg-detail { color:#888; font-size:11px; margin-top:1px; }
    .wc-pkg-left { display:flex; flex-direction:column; }
    .wc-contact-note {
      margin:0 10px 10px;padding:8px 12px;
      background:rgba(62,207,207,.08);
      border-left:2px solid #3ecfcf;
      border-radius:0 8px 8px 0;
      font-size:12px;color:#a5f3f3;line-height:1.6;
    }

    .wc-typing{
      display:flex;gap:5px;align-items:center;padding:10px 14px;
      background:rgba(108,99,255,.12);border:1px solid rgba(108,99,255,.2);
      border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start;flex-shrink:0;
    }
    .wc-typing span{width:7px;height:7px;background:#6c63ff;border-radius:50%;animation:wc-bounce .9s infinite;}
    .wc-typing span:nth-child(2){animation-delay:.15s;}.wc-typing span:nth-child(3){animation-delay:.3s;}
    @keyframes wc-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
    .wc-quick-replies{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;flex-shrink:0;}
    .wc-quick-btn{
      padding:6px 12px;background:transparent;
      border:1px solid rgba(108,99,255,.45);border-radius:20px;
      color:#a5b4fc;font-size:12px;font-family:'Manrope',sans-serif;
      cursor:pointer;transition:all .2s;
    }
    .wc-quick-btn:hover{background:rgba(108,99,255,.2);border-color:#6c63ff;color:#fff;}
    .wc-input-row{
      display:flex;gap:8px;padding:12px 16px;
      border-top:1px solid rgba(108,99,255,.15);background:rgba(255,255,255,.02);flex-shrink:0;
    }
    .wc-input-row input{
      flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(108,99,255,.25);
      border-radius:12px;padding:10px 14px;color:#fff;
      font-size:13.5px;font-family:'Manrope',sans-serif;outline:none;transition:border-color .2s;
    }
    .wc-input-row input:focus{border-color:#6c63ff;}
    .wc-input-row input::placeholder{color:#555;}
    .wc-send-btn{
      width:40px;height:40px;border-radius:12px;
      background:linear-gradient(135deg,#6c63ff,#3ecfcf);
      border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
      flex-shrink:0;box-shadow:0 2px 10px rgba(108,99,255,.4);transition:transform .2s;
    }
    .wc-send-btn:hover{transform:scale(1.07);}
    .wc-send-btn svg{width:17px;height:17px;fill:#fff;}
    @media(max-width:480px){
      #wc-chatbox{width:calc(100vw - 32px);right:16px;bottom:90px;}
      #wc-chat-toggle{bottom:24px;right:16px;}
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button id="wc-chat-toggle" aria-label="Open chat">
      <svg viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.92 2 11.75c0 2.7 1.37 5.12 3.5 6.78L4.5 21l3.63-1.82A10.6 10.6 0 0 0 12 20.5c5.52 0 10-3.92 10-8.75S17.52 3 12 3z"/></svg>
    </button>
    <div id="wc-chatbox" role="dialog">
      <div class="wc-header">
        <div class="wc-avatar">🤖</div>
        <div class="wc-header-info">
          <h4>WebCraft Assistant</h4>
          <p>Online now — ask me anything</p>
        </div>
        <button class="wc-close-btn" id="wc-close">✕</button>
      </div>
      <div class="wc-messages" id="wc-messages"></div>
      <div class="wc-quick-replies" id="wc-quick-replies">
        <button class="wc-quick-btn">💰 Pricing</button>
        <button class="wc-quick-btn">🌐 What do you build?</button>
        <button class="wc-quick-btn">⏱ Turnaround time</button>
        <button class="wc-quick-btn">📞 Contact info</button>
      </div>
      <div class="wc-input-row">
        <input type="text" id="wc-input" placeholder="Ask me anything…" autocomplete="off"/>
        <button class="wc-send-btn" id="wc-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const toggleBtn  = document.getElementById("wc-chat-toggle");
  const chatBox    = document.getElementById("wc-chatbox");
  const closeBtn   = document.getElementById("wc-close");
  const messagesEl = document.getElementById("wc-messages");
  const inputEl    = document.getElementById("wc-input");
  const sendBtn    = document.getElementById("wc-send");
  const quickEl    = document.getElementById("wc-quick-replies");
  let isOpen = false;
  let history = [];

  // ── Render reply into nicely styled HTML blocks ────────────
  function renderReply(text) {
    const div = document.createElement("div");
    div.className = "wc-msg bot";

    // Strip all asterisks
    const clean = text.replace(/\*\*/g, "").replace(/\*/g, "");
    const lines = clean.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    let html = "";
    let hasPackages = false;

    for (const line of lines) {
      // Category heading (ALL CAPS line or line ending with colon)
      if (/^[A-Z][A-Z\s&-]{4,}:?$/.test(line)) {
        html += `<div class="wc-category">${line.replace(/:$/, "")}</div>`;
        hasPackages = true;
        continue;
      }

      // Package line: "- Name: R1,200 — detail" or "- Name: R1,200 (detail)"
      const pkgMatch = line.match(/^[-•]?\s*(.+?):\s*(R[\d,]+)\s*[-—–]?\s*(.*)?$/);
      if (pkgMatch && pkgMatch[2]) {
        const name   = pkgMatch[1].trim();
        const price  = pkgMatch[2].trim();
        const detail = pkgMatch[3] ? pkgMatch[3].trim() : "";
        html += `
          <div class="wc-package">
            <div class="wc-pkg-left">
              <span class="wc-pkg-name">${name}</span>
              ${detail ? `<span class="wc-pkg-detail">${detail}</span>` : ""}
            </div>
            <span class="wc-pkg-price">${price}</span>
          </div>`;
        hasPackages = true;
        continue;
      }

      // Contact / note line
      if (/whatsapp|contact|email|get started|reach us|touch/i.test(line)) {
        html += `<div class="wc-contact-note">📲 ${line}</div>`;
        continue;
      }

      // Plain text
      html += `<div class="wc-text">${line}</div>`;
    }

    div.innerHTML = html;
    return div;
  }

  const SYSTEM = `You are a friendly sales assistant for WebCraft Studios, a web design company in Johannesburg, South Africa.

STRICT FORMATTING RULES — you MUST follow these exactly:
- Never use asterisks or markdown bold/italic
- Never use markdown symbols like ** or *
- For category headings use plain ALL CAPS text followed by a colon, on its own line. Example: STANDARD WEBSITES:
- For each package use this exact format on its own line: - Package Name: R0,000 — brief detail
- Put a blank line between categories
- End with one short sentence about contacting us on WhatsApp +27 81 762 2557

CONTACT: Phone/WhatsApp +27 81 762 2557 | Email info@webcraftstudios.co.za | Johannesburg, SA

STANDARD PACKAGES:
- Starter Website: R1,200 — 1 page, free domain, WhatsApp integration, SEO
- Business Website: R3,000 — 3 pages, free domain + hosting, Google Maps
- Premium Website: R5,000 — 5 pages, portfolio/gallery, Google Analytics
- Corporate Website: R8,000 — 8-10 pages, CRM integration, security setup

E-COMMERCE PACKAGES:
- Starter Store: R7,500 — up to 10 products, PayFast/PayPal
- Business Store: R15,000 — up to 50 products, advanced checkout
- Professional Store: R25,000 — up to 200 products, multiple gateways
- Enterprise Store: R35,000 — unlimited products, multi-currency

KEY FACTS: Turnaround 1-2 weeks. Free domain/hosting included. CMS access on all plans. SEO built in. Post-launch support available.

Be warm and concise. Never use markdown.`;

  function openChat() {
    isOpen = true;
    chatBox.classList.add("wc-visible");
    toggleBtn.classList.add("wc-open");
    if (!messagesEl.children.length) {
      const d = document.createElement("div");
      d.className = "wc-msg bot";
      d.innerHTML = `<div class="wc-text">👋 Hey there! I'm the WebCraft Assistant. Ask me anything about our packages, pricing, or turnaround times!</div>`;
      messagesEl.appendChild(d);
    }
    inputEl.focus();
  }

  function closeChat() {
    isOpen = false;
    chatBox.classList.remove("wc-visible");
    toggleBtn.classList.remove("wc-open");
  }

  toggleBtn.addEventListener("click", () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener("click", closeChat);
  quickEl.addEventListener("click", e => {
    if (e.target.classList.contains("wc-quick-btn"))
      send(e.target.textContent.replace(/^[^\w]+/, "").trim());
  });
  inputEl.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  sendBtn.addEventListener("click", () => send());

  function addUser(text) {
    const d = document.createElement("div");
    d.className = "wc-msg user";
    d.textContent = text;
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    quickEl.style.display = "none";
  }

  function showTyping() {
    const d = document.createElement("div");
    d.className = "wc-typing"; d.id = "wc-typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const d = document.getElementById("wc-typing");
    if (d) d.remove();
  }

  async function send(text) {
    const msg = (text || inputEl.value).trim();
    if (!msg) return;
    inputEl.value = "";
    addUser(msg);
    history.push({ role: "user", content: msg });
    showTyping();
    sendBtn.disabled = true;
    inputEl.disabled = true;

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM, messages: history })
      });
      const data = await res.json();
      const reply = data?.reply || "Sorry, I couldn't respond. Please WhatsApp us at +27 81 762 2557!";
      history.push({ role: "assistant", content: reply });
      hideTyping();
      const bubble = renderReply(reply);
      messagesEl.appendChild(bubble);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } catch (e) {
      hideTyping();
      const d = document.createElement("div");
      d.className = "wc-msg bot";
      d.innerHTML = `<div class="wc-contact-note">📲 Please WhatsApp us at +27 81 762 2557 or email info@webcraftstudios.co.za</div>`;
      messagesEl.appendChild(d);
    }

    sendBtn.disabled = false;
    inputEl.disabled = false;
    inputEl.focus();
  }
})();