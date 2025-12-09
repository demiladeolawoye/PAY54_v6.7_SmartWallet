/* ============================================================
   PAY54 Smart Wallet Engine • v6.7.1 (Production Demo)
   Controls:
   - Wallet switching
   - Modals
   - FX (NGN ⇄ USD/GBP/EUR)
   - Requests & alerts
   - Transactions
   - Services + shortcuts
   - Profile menu (settings/support/logout)
   ============================================================ */

(function () {
  const modal = window.pay54Modal;
  const u = window.pay54Utils;

  const STORAGE_KEY = "pay54_demo_user";
  const THEME_KEY = "pay54_theme";

  /* ------------------------------------------------------------
     USER PROFILE
  ------------------------------------------------------------ */
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
    const email = user?.email || "demo@pay54.app";
    const phone = user?.phone || "+234••• PAY54";

    const nameEl = document.getElementById("lblUserName");
    const avatarEl = document.getElementById("avatarInitial");
    const tagEl = document.getElementById("lblTag");
    const accEl = document.getElementById("lblAccountNo");

    const tag =
      user?.name
        ? "@" + user.name.split(" ")[0].toLowerCase() + "54"
        : "@pay54demo";

    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    if (tagEl) tagEl.textContent = tag;
    if (accEl) accEl.textContent = "1234567890";

    // stash for settings modal
    window.__pay54Profile = { name, email, phone, tag };
  }

  /* ------------------------------------------------------------
     THEME TOGGLE
  ------------------------------------------------------------ */
  function applyTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    if (saved === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }

    const btn = document.getElementById("btnThemeToggle");
    if (btn) btn.textContent = saved === "light" ? "☀" : "☾";
  }

  function toggleTheme() {
    const isLight = !document.body.classList.contains("theme-light")
      ? true
      : false;

    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
    applyTheme();
  }

  document
    .getElementById("btnThemeToggle")
    ?.addEventListener("click", toggleTheme);

  /* ------------------------------------------------------------
     WALLET BALANCE + DATA
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

    const walletName = document.getElementById("lblWalletName");
    const walletId = document.getElementById("lblWalletId");
    if (walletName) walletName.textContent = `${currentWallet} Wallet`;

    if (walletId) {
      walletId.textContent =
        currentWallet === "NGN" ? "••• 540" : currentWallet === "USD" ? "••• 120" : "••• 088";
    }
  }

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

  document
    .getElementById("btnClearAlerts")
    ?.addEventListener("click", () => {
      requests.length = 0;
      loadRequests();
      u.showToast("Alerts cleared");
    });

  /* ------------------------------------------------------------
     PROFILE MENU (Settings / Support / Logout)
  ------------------------------------------------------------ */
  const profilePill = document.getElementById("profilePill");
  const profileMenu = document.getElementById("profileMenu");

  function toggleProfileMenu() {
    profileMenu.classList.toggle("hidden");
  }

  function closeProfileMenu() {
    profileMenu.classList.add("hidden");
  }

  profilePill?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfileMenu();
  });

  document.addEventListener("click", (e) => {
    if (!profileMenu.contains(e.target) && e.target !== profilePill) {
      closeProfileMenu();
    }
  });

  profileMenu
    ?.querySelector("[data-menu='settings']")
    ?.addEventListener("click", () => {
      closeProfileMenu();
      const p = window.__pay54Profile || {};
      modal.openModal(
        "PAY54 Settings",
        `
        <p><strong>Name:</strong> ${p.name || "PAY54 User"}</p>
        <p><strong>Email:</strong> ${p.email || "demo@pay54.app"}</p>
        <p><strong>Phone:</strong> ${p.phone || "+234••• PAY54"}</p>
        <p><strong>PAY54 Tag:</strong> ${p.tag || "@pay54demo"}</p>
        <p style="margin-top:10px;font-size:0.85rem;color:#94a3b8;">
          This is a demo profile stored only on this device.
        </p>
      `
      );
    });

  profileMenu
    ?.querySelector("[data-menu='support']")
    ?.addEventListener("click", () => {
      closeProfileMenu();
      modal.openModal(
        "PAY54 Support Centre",
        `
        <p>Need help with this demo?</p>
        <p>Email: <strong>support@pay54.app</strong> (demo placeholder)</p>
        <p style="margin-top:10px;font-size:0.85rem;color:#94a3b8;">
          In production, in-app chat, phone and ticketing would be available here.
        </p>
      `
      );
    });

  profileMenu
    ?.querySelector("[data-menu='logout']")
    ?.addEventListener("click", () => {
      closeProfileMenu();
      localStorage.removeItem(STORAGE_KEY);
      u.showToast("Logged out (demo)");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    });

  /* ------------------------------------------------------------
     MODAL TEMPLATES
  ------------------------------------------------------------ */
  function tplSendP54() {
    return `
      <p>Send money from your PAY54 wallet to another PAY54 user instantly.</p>
      <div class="form-group">
        <label>Recipient PAY54 Tag</label>
        <input placeholder="@username" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" placeholder="1000" />
      </div>
      <button class="btn-pill-primary" id="btnSendDemo">Send (demo)</button>
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
      <button class="btn-pill-secondary" id="btnCopyDetails">Copy details</button>
    `;
  }

  const modalMap = {
    sendP54: tplSendP54,
    receive: tplReceive,

    add: () => `
      <p>Add money with card, bank transfer or agents.</p>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" placeholder="5000" />
      </div>
      <button class="btn-pill-primary" id="btnTopupDemo">Confirm top-up (demo)</button>
    `,

    withdraw: () => `
      <p>Withdraw to bank or via agents.</p>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" placeholder="2000" />
      </div>
      <button class="btn-pill-secondary" id="btnWithdrawDemo">Create withdrawal (demo)</button>
    `,

    bankTransfer: () => `
      <p>Send to NG banks & wallets.</p>
      <div class="form-group">
        <label>Bank</label>
        <input placeholder="Demo Bank" />
      </div>
      <div class="form-group">
        <label>Account number</label>
        <input placeholder="0123456789" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" placeholder="5000" />
      </div>
      <button class="btn-pill-secondary" id="btnBankTransferDemo">Send (demo)</button>
    `,

    request: () => `
      <p>Request money from another PAY54 user.</p>
      <div class="form-group">
        <label>From (PAY54 Tag)</label>
        <input placeholder="@friend" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" placeholder="10000" />
      </div>
      <button class="btn-pill-primary" id="btnRequestDemo">Create request (demo)</button>
    `,

    crossBorderFx: () => `
      <p>Cross-border FX rails for NGN ⇄ USD/GBP/EUR.</p>
      <p>Demo rate: NGN 1,000 = USD 1.</p>
      <button class="btn-pill-primary" id="btnFxConvert">Convert 50,000 NGN → USD (demo)</button>
    `,

    savings: () => `
      <p>Create a savings pot.</p>
      <div class="form-group">
        <label>Pot name</label>
        <input placeholder="School fees" />
      </div>
      <div class="form-group">
        <label>Target amount</label>
        <input type="number" placeholder="100000" />
      </div>
      <button class="btn-pill-primary" id="btnSavingsDemo">Create pot (demo)</button>
    `,

    bills: () => `
      <p>Pay airtime, data, electricity & TV.</p>
      <div class="form-group">
        <label>Service</label>
        <input placeholder="Airtime – MTN" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" placeholder="2000" />
      </div>
      <button class="btn-pill-secondary" id="btnBillsDemo">Pay bill (demo)</button>
    `,

    cards: () => `
      <p>Virtual & linked cards for online payments.</p>
      <p>In production you could view card details, freeze cards and set limits here.</p>
    `,

    checkout: () => `
      <p>PAY54 Smart Checkout lets merchants accept one-tap payments.</p>
      <p>In production, this connects to your PAY54 balance or linked cards.</p>
    `,

    shop: () => `
      <p>Shop on the Fly with PAY54 at partner apps & websites.</p>
      <p>This demo shows only the UX concept – no real purchases are made.</p>
    `,

    invest: () => `
      <p>Investments & stocks inside PAY54.</p>
      <ul>
        <li>🌱 Conservative – 6–8% target (demo)</li>
        <li>🚀 Growth – 12–15% target (demo)</li>
      </ul>
      <button class="btn-pill-primary" id="btnInvestDemo">Simulate invest (demo)</button>
    `,

    bet: () => `
      <p>Fund betting wallets responsibly.</p>
      <p>In production, spend caps and controls would live here.</p>
    `,

    aiRisk: () => `
      <p>AI Risk Watch scans your activity for unusual behaviour.</p>
      <p>In production it would flag risky transactions and log device changes.</p>
    `,

    agent: () => `
      <p>Become a PAY54 Agent.</p>
      <div class="form-group">
        <label>Business name</label>
        <input placeholder="Demo Agent" />
      </div>
      <div class="form-group">
        <label>Contact phone</label>
        <input placeholder="+234..." />
      </div>
      <button class="btn-pill-primary" id="btnAgentDemo">Submit application (demo)</button>
    `,
  };

  /* ------------------------------------------------------------
     MODAL HANDLER
  ------------------------------------------------------------ */
  function handleModalClick(e) {
    const key = e.currentTarget.dataset.modal;
    if (!key) return;

    const contentFn = modalMap[key];
    const html =
      typeof contentFn === "function"
        ? contentFn()
        : "<p>Feature not implemented yet.</p>";

    modal.openModal("PAY54 • " + key.toUpperCase(), html);

    // wire up special buttons inside the new modal
    const layer = document.getElementById("modalLayer");

    // FX convert
    layer.querySelector("#btnFxConvert")?.addEventListener("click", () => {
      balances.NGN -= 50000;
      balances.USD += 50;
      updateBalance();
      u.showToast("FX conversion complete (demo)");
      modal.closeModal();
    });

    // copy details for Receive
    layer.querySelector("#btnCopyDetails")?.addEventListener("click", () => {
      const acc = document.getElementById("lblAccountNo")?.textContent || "";
      const tag = document.getElementById("lblTag")?.textContent || "";
      navigator.clipboard?.writeText(`Account: ${acc} • Tag: ${tag}`);
      u.showToast("Details copied (demo)");
    });

    // Add money (demo)
    layer.querySelector("#btnTopupDemo")?.addEventListener("click", () => {
      u.showToast("Top-up created (demo only)");
      modal.closeModal();
    });

    // Withdraw demo
    layer.querySelector("#btnWithdrawDemo")?.addEventListener("click", () => {
      u.showToast("Withdrawal created (demo only)");
      modal.closeModal();
    });

    // Bank transfer demo
    layer.querySelector("#btnBankTransferDemo")?.addEventListener("click", () => {
      u.showToast("Bank transfer queued (demo)");
      modal.closeModal();
    });

    // Request money demo – adds to Requests feed
    layer.querySelector("#btnRequestDemo")?.addEventListener("click", () => {
      requests.unshift("You requested money (demo)");
      loadRequests();
      u.showToast("Request created (demo)");
      modal.closeModal();
    });

    // Savings pot demo
    layer.querySelector("#btnSavingsDemo")?.addEventListener("click", () => {
      requests.unshift("Savings pot created (demo)");
      loadRequests();
      u.showToast("Savings pot created (demo)");
      modal.closeModal();
    });

    // Bills demo
    layer.querySelector("#btnBillsDemo")?.addEventListener("click", () => {
      u.showToast("Bill paid (demo)");
      modal.closeModal();
    });

    // Invest demo
    layer.querySelector("#btnInvestDemo")?.addEventListener("click", () => {
      u.showToast("Investment simulated (demo)");
      modal.closeModal();
    });

    // Agent application demo
    layer.querySelector("#btnAgentDemo")?.addEventListener("click", () => {
      requests.unshift("Agent application received (demo)");
      loadRequests();
      u.showToast("Agent application submitted (demo)");
      modal.closeModal();
    });

    // Send demo
    layer.querySelector("#btnSendDemo")?.addEventListener("click", () => {
      u.showToast("Payment sent (demo)");
      modal.closeModal();
    });
  }

  document
    .querySelectorAll("[data-modal]")
    .forEach((btn) => btn.addEventListener("click", handleModalClick));

  /* Wallet switching */
  document.querySelectorAll("[data-wallet]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentWallet = btn.dataset.wallet;
      updateBalance();
      u.showToast(`${currentWallet} wallet selected`);
    });
  });

  /* Share details button */
  document
    .getElementById("btnShareDetails")
    ?.addEventListener("click", () => {
      const acc = document.getElementById("lblAccountNo")?.textContent || "";
      const tag = document.getElementById("lblTag")?.textContent || "";
      navigator.clipboard?.writeText(`Account: ${acc} • Tag: ${tag}`);
      u.showToast("Account details copied (demo)");
    });

  /* View all transactions: modal list */
  document
    .getElementById("btnViewAllTx")
    ?.addEventListener("click", () => {
      const html =
        "<p>Full transaction history (demo):</p>" +
        "<ul>" +
        transactions
          .map(
            (tx) =>
              `<li>${tx.desc} – ${
                tx.type === "in" ? "+" : "-"
              }${u.formatCurrency(tx.amount, tx.currency)}</li>`
          )
          .join("") +
        "</ul>";
      modal.openModal("Transactions (demo)", html);
    });

  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  initUser();
  applyTheme();
  updateBalance();
  loadTransactions();
  loadRequests();
})();
