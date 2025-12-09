/* ============================================================
   PAY54 Smart Wallet Engine • v6.7.1 (Production Demo)
   Controls:
   - Wallet switching
   - Modals
   - FX (NGN ⇄ USD/GBP)
   - Requests
   - Transactions
   - Services
   - Shortcuts
   ============================================================ */

(function () {
  const modal = window.pay54Modal;
  const u = window.pay54Utils;

  /* ------------------------------------------------------------
     USER PROFILE (from signup)
  ------------------------------------------------------------ */
  const STORAGE_KEY = "pay54_demo_user";
  const THEME_KEY = "pay54_theme";

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function initUser() {
    const user = getUser();

    const name = user?.name || "PAY54 User";
    const acc = "1234567890";
    const tag =
      user?.name
        ? "@" + user.name.split(" ")[0].toLowerCase() + "54"
        : "@pay54demo";

    const nameEl = document.getElementById("lblUserName");
    const accEl = document.getElementById("lblAccountNo");
    const tagEl = document.getElementById("lblTag");
    const avatar = document.getElementById("avatarInitial");

    if (nameEl) nameEl.textContent = name;
    if (accEl) accEl.textContent = acc;
    if (tagEl) tagEl.textContent = tag;
    if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
  }

  /* ------------------------------------------------------------
     THEME (Dark / Light)
  ------------------------------------------------------------ */
  function applyTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    saved === "light"
      ? document.body.classList.add("theme-light")
      : document.body.classList.remove("theme-light");

    document.getElementById("btnThemeToggle").textContent =
      saved === "light" ? "☀" : "☾";
  }

  function toggleTheme() {
    const newTheme = document.body.classList.toggle("theme-light")
      ? "light"
      : "dark";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme();
  }

  document.getElementById("btnThemeToggle")?.addEventListener("click", toggleTheme);

  /* ------------------------------------------------------------
     WALLET BALANCES & DEMO DATA
  ------------------------------------------------------------ */
  let currentWallet = "NGN";

  const balances = {
    NGN: 540000,
    USD: 1200,
    GBP: 880,
  };

  const transactions = [
    { type: "in", amount: 52000, desc: "Wallet top-up", currency: "NGN" },
    { type: "out", amount: 12000, desc: "MTN Airtime", currency: "NGN" },
    { type: "in", amount: 100, desc: "FX → USD", currency: "USD" },
  ];

  const requests = [
    "Prem requested ₦12,000",
    "Agent onboarding pending",
    "AI Risk Watch flagged unusual login",
  ];

  function updateBalance() {
    const el = document.getElementById("lblBalance");
    if (!el) return;

    el.textContent = u.formatCurrency(balances[currentWallet], currentWallet);

    document.getElementById("lblWalletName").textContent =
      currentWallet + " Wallet";

    document.getElementById("lblWalletId").textContent =
      currentWallet === "NGN" ? "••• 540" : currentWallet === "USD" ? "••• 120" : "••• 088";
  }

  /* ------------------------------------------------------------
     TRANSACTIONS FEED
  ------------------------------------------------------------ */
  function loadTransactions() {
    const list = document.getElementById("listTx");
    if (!list) return;

    list.innerHTML = "";

    transactions.forEach((tx) => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      const right = document.createElement("span");

      left.textContent = tx.desc;
      right.textContent =
        (tx.type === "in" ? "+" : "-") +
        u.formatCurrency(tx.amount, tx.currency);

      right.className = tx.type === "in" ? "tx-income" : "tx-expense";

      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });
  }

  /* ------------------------------------------------------------
     REQUESTS FEED
  ------------------------------------------------------------ */
  function loadRequests() {
    const list = document.getElementById("listRequests");
    if (!list) return;

    list.innerHTML = "";

    requests.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      list.appendChild(li);
    });
  }

  document.getElementById("btnClearAlerts")?.addEventListener("click", () => {
    requests.length = 0;
    loadRequests();
    u.showToast("Alerts cleared");
  });

  /* ------------------------------------------------------------
     MODAL TEMPLATES FOR FEATURES
  ------------------------------------------------------------ */

  function tplSendP54() {
    return `
      <p>Send money from your PAY54 wallet to another PAY54 user instantly.</p>
      <p><strong>Demo only</strong> – no real transfer occurs.</p>
    `;
  }

  function tplReceive() {
    const acc = document.getElementById("lblAccountNo")?.textContent || "";
    const tag = document.getElementById("lblTag")?.textContent || "";

    return `
      <p>Share these details to receive money:</p>
      <p><strong>Account:</strong> ${acc}</p>
      <p><strong>PAY54 Tag:</strong> ${tag}</p>

      <div style="margin:10px 0;padding:20px;border-radius:14px;border:1px dashed rgba(148,163,184,0.6);text-align:center;">
        <small>QR Code placeholder<br/>(for future real QR integration)</small>
      </div>

      <button class="btn-soft" id="btnCopyDetails">Copy details</button>
    `;
  }

  const modalMap = {
    sendP54: tplSendP54,
    receive: tplReceive,

    add: () => `
      <p>Add money via card, bank transfer or agents.</p>
      <p>Demo only.</p>
    `,

    withdraw: () => `
      <p>Withdraw funds to your bank or via agents.</p>
      <p>Demo only.</p>
    `,

    bankTransfer: () => `
      <p>Transfer to Nigerian banks or wallets.</p>
      <p>Demo only.</p>
    `,

    request: () => `
      <p>Request money from another PAY54 user.</p>
      <p>Demo only.</p>
    `,

    crossBorderFx: () => `
      <p>Convert NGN ↔ USD/GBP/EUR.</p>
      <p>Demo rate: NGN 1,000 = USD 1.</p>
      <button id="btnFxConvert" class="btn-soft" style="margin-top:10px;">
        Convert 50,000 NGN → USD
      </button>
    `,

    savings: () => `
      <p>Create savings pots for travel, rent, fees and more.</p>
      <p>Demo only.</p>
    `,

    bills: () => `
      <p>Pay airtime, data, electricity and TV.</p>
      <p>Demo only.</p>
    `,

    cards: () => `
      <p>Virtual & linked cards for online payments.</p>
      <p>Demo only.</p>
    `,

    checkout: () => `
      <p>PAY54 Smart Checkout for merchants.</p>
      <p>Demo only.</p>
    `,

    shop: () => `
      <p>Shop on the Fly using PAY54.</p>
      <p>Demo only.</p>
    `,

    invest: () => `
      <p>Investments & stocks (future feature).</p>
      <p>Demo only.</p>
    `,

    bet: () => `
      <p>Fund betting wallets responsibly.</p>
      <p>Demo only.</p>
    `,

    aiRisk: () => `
      <p>AI Risk Watch monitors suspicious activity.</p>
      <p>Demo only.</p>
    `,

    agent: () => `
      <p>Become a PAY54 Agent.</p>
      <p>Earn commissions on cash-in/cash-out.</p>
    `,
  };

  /* ------------------------------------------------------------
     MODAL EVENT HANDLER
  ------------------------------------------------------------ */
  function handleModalClick(e) {
    const key = e.currentTarget.dataset.modal;
    if (!key) return;

    const contentFn = modalMap[key];
    const html =
      typeof contentFn === "function"
        ? contentFn()
        : "<p>Feature not implemented.</p>";

    modal.openModal("PAY54 • " + key.toUpperCase(), html);

    // Special controller for FX demo
    if (key === "crossBorderFx") {
      const btn = document.getElementById("btnFxConvert");
      if (btn) {
        btn.addEventListener("click", () => {
          balances.NGN -= 50000;
          balances.USD += 50;
          updateBalance();
          loadTransactions();
          u.showToast("FX conversion complete (demo)");
          modal.closeModal();
        });
      }
    }

    // Copy details for Receive
    if (key === "receive") {
      document.getElementById("btnCopyDetails")?.addEventListener("click", () => {
        const acc = document.getElementById("lblAccountNo")?.textContent || "";
        const tag = document.getElementById("lblTag")?.textContent || "";
        navigator.clipboard?.writeText(`Account: ${acc} • Tag: ${tag}`);
        u.showToast("Details copied");
      });
    }
  }

  /* Attach modal listeners */
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", handleModalClick);
  });

  /* Wallet switch buttons */
  document.querySelectorAll("[data-wallet]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentWallet = btn.dataset.wallet;
      updateBalance();
      u.showToast(`${currentWallet} wallet selected`);
    });
  });

  /* ------------------------------------------------------------
     INITIAL PAGE LOAD
  ------------------------------------------------------------ */
  initUser();
  applyTheme();
  updateBalance();
  loadRequests();
  loadTransactions();
})();
