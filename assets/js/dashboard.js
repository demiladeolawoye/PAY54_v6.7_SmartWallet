/* ============================================================
   PAY54 Smart Wallet Engine • v6.7.2 (Production Demo)
   Controls:
   - Wallet switching
   - Modals
   - FX (NGN ⇄ USD/GBP/EUR)
   - Requests & alerts
   - Transactions
   - Investments & portfolio
   - PAY54 Smart Checkout (demo)
   - Services + shortcuts
   - Profile menu (settings/support/logout)
   ============================================================ */

(function () {
  const modal = window.pay54Modal;
  const u = window.pay54Utils;

  const STORAGE_KEY = "pay54_demo_user";
  const THEME_KEY = "pay54_theme";
  const PORTFOLIO_KEY = "pay54_portfolio";

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
    const isLight = !document.body.classList.contains("theme-light");
    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
    applyTheme();
  }

  document
    .getElementById("btnThemeToggle")
    ?.addEventListener("click", toggleTheme);

  /* ------------------------------------------------------------
     WALLET DATA
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
     PORTFOLIO (Investments & Stocks)
  ------------------------------------------------------------ */
  function loadPortfolio() {
    try {
      return JSON.parse(localStorage.getItem(PORTFOLIO_KEY)) || [];
    } catch {
      return [];
    }
  }

  function savePortfolio(portfolio) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  }

  let portfolio = loadPortfolio();

  function portfolioListHtml() {
    if (!portfolio.length) {
      return `<p style="font-size:0.85rem;">You don’t have any investments yet (demo).</p>`;
    }

    const rate = 1500; // NGN per 1 USD (mock)
    const feePct = 0.015;

    return `
      <ul>
        ${portfolio
          .map((p) => {
            const usdValue = p.amountUSD;
            const gross = usdValue * rate;
            const fee = gross * feePct;
            const net = gross - fee;
            return `<li style="margin-bottom:6px;font-size:0.85rem;">
              <strong>${p.name}</strong> – $${usdValue.toFixed(
                2
              )} ≈ ${u.formatCurrency(
              net,
              "NGN"
            )} (after ${u.formatCurrency(fee, "NGN")} FX fee)
            </li>`;
          })
          .join("")}
      </ul>
    `;
  }

  /* ------------------------------------------------------------
     RECEIPT HELPER
  ------------------------------------------------------------ */
  function showReceipt(title, detailsHtml) {
    modal.openModal(
      title,
      `
      <div>
        ${detailsHtml}
        <p style="margin-top:10px;font-size:0.8rem;color:#94a3b8;">
          Demo only – no real payment or investment is processed.
        </p>
      </div>
    `
    );
  }

  /* ------------------------------------------------------------
     MODAL CONTENT TEMPLATES
  ------------------------------------------------------------ */

  function tplSendP54() {
    return `
      <p>Send money from your PAY54 wallet to another PAY54 user instantly.</p>
      <div class="form-group">
        <label>Recipient PAY54 Tag</label>
        <input placeholder="@username54" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="sendAmount" placeholder="1000" />
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
    /* MONEY MOVES */
    sendP54: tplSendP54,
    receive: tplReceive,

    add: () => `
      <p>Add money with card, bank transfer or agents.</p>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="topupAmount" placeholder="5000" />
      </div>
      <button class="btn-pill-primary" id="btnTopupDemo">Confirm top-up (demo)</button>
    `,

    withdraw: () => `
      <p>Withdraw to bank or via agents.</p>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="withdrawAmount" placeholder="2000" />
      </div>
      <button class="btn-pill-secondary" id="btnWithdrawDemo">Create withdrawal (demo)</button>
    `,

    bankTransfer: () => `
      <p>Send to NG banks & wallets.</p>
      <div class="form-group">
        <label>Bank</label>
        <input id="bankName" placeholder="Demo Bank" />
      </div>
      <div class="form-group">
        <label>Account number</label>
        <input id="bankAccount" placeholder="0123456789" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="bankAmount" placeholder="5000" />
      </div>
      <button class="btn-pill-secondary" id="btnBankTransferDemo">Send (demo)</button>
    `,

    request: () => `
      <p>Request money from another PAY54 user.</p>
      <div class="form-group">
        <label>From (PAY54 Tag)</label>
        <input id="reqTag" placeholder="@friend54" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="reqAmount" placeholder="10000" />
      </div>
      <button class="btn-pill-primary" id="btnRequestDemo">Create request (demo)</button>
    `,

    /* SERVICES */
    crossBorderFx: () => `
      <p>Cross-border FX rails for NGN ⇄ USD/GBP/EUR.</p>
      <p>Demo rate: NGN 1,000 = USD 1.</p>
      <button class="btn-pill-primary" id="btnFxConvert">Convert 50,000 NGN → USD (demo)</button>
    `,

    savings: () => `
      <p>Create a savings pot.</p>
      <div class="form-group">
        <label>Pot name</label>
        <input id="potName" placeholder="School fees" />
      </div>
      <div class="form-group">
        <label>Target amount</label>
        <input type="number" id="potTarget" placeholder="100000" />
      </div>
      <button class="btn-pill-primary" id="btnSavingsDemo">Create pot (demo)</button>
    `,

    bills: () => `
      <p>Pay airtime, data, electricity & TV.</p>
      <div class="form-group">
        <label>Service</label>
        <input id="billService" placeholder="Airtime – MTN" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="billAmount" placeholder="2000" />
      </div>
      <button class="btn-pill-secondary" id="btnBillsDemo">Pay bill (demo)</button>
    `,

    cards: () => `
      <p>Virtual & linked cards for online payments.</p>
      <p>In production you could view card details, freeze cards and set limits here.</p>
    `,

    checkout: () => `
      <p>PAY54 Smart Checkout works like PayPal or Apple Pay on partner e-commerce sites.</p>
      <p>When you choose PAY54 at checkout, a payment request appears here for approval.</p>
      <hr/>
      <p><strong>Demo merchant payment</strong></p>
      <p>Merchant: <strong>Demo Store</strong></p>
      <p>Item: PAY54 Hoodie</p>
      <p>Total: <strong>${currentWallet === "NGN"
        ? u.formatCurrency(18000, "NGN")
        : currentWallet === "USD"
        ? u.formatCurrency(25, "USD")
        : u.formatCurrency(20, "GBP")}</strong></p>
      <button class="btn-pill-primary" id="btnCheckoutApprove">Approve payment (demo)</button>
      <button class="btn-pill-secondary" id="btnCheckoutDecline" style="margin-left:6px;">Decline</button>
    `,

    shop: () => `
      <p>Shop on the Fly with PAY54 at partner apps & websites.</p>
      <ul>
        <li>🚕 Taxi – Bolt / Uber (demo)</li>
        <li>🛒 Shopping – Jumia</li>
        <li>🍔 Food – JustEat</li>
        <li>🎟 Tickets – Event partners</li>
      </ul>
      <p>In production, tapping a partner would open their app or site with PAY54 as the payment option.</p>
    `,

    invest: () => `
      <p><strong>Explore investments</strong></p>
      <ul>
        <li>📈 PAY54 Tech Fund – global tech exposure</li>
        <li>🏙 Lagos Real Estate Fractionals</li>
        <li>🌍 PAY54 Growth Index – diversified basket</li>
      </ul>
      <button class="btn-pill-primary" id="btnInvestDemo">Buy $50 PAY54 Tech Fund (demo)</button>
      <hr/>
      <p><strong>My portfolio (demo)</strong></p>
      ${portfolioListHtml()}
    `,

    bet: () => `
      <p>Fund betting wallets responsibly.</p>
      <div class="form-group">
        <label>Betting wallet ID</label>
        <input id="betId" placeholder="BET12345" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="betAmount" placeholder="2000" />
      </div>
      <div class="form-group" style="font-size:0.8rem;">
        <label><input type="checkbox" id="betAdult" /> I confirm I am 18+ and accept responsible gambling terms.</label>
      </div>
      <button class="btn-pill-secondary" id="btnBetDemo">Fund betting wallet (demo)</button>
      <p style="margin-top:8px;font-size:0.78rem;color:#f97316;">
        Bet responsibly. PAY54 does not encourage gambling – this is a UX demo only.
      </p>
    `,

    aiRisk: () => `
      <p>AI Risk Watch scans your activity for unusual behaviour.</p>
      <ul>
        <li>New device login from Lagos – <strong>Review</strong></li>
        <li>High-value transfer flagged – <strong>Pending</strong></li>
      </ul>
      <button class="btn-pill-secondary" id="btnRiskResolve">Mark alerts as resolved (demo)</button>
    `,

    agent: () => `
      <p>Become a PAY54 Agent.</p>
      <div class="form-group">
        <label>Full name</label>
        <input id="agentName" placeholder="Demo Agent" />
      </div>
      <div class="form-group">
        <label>Business name</label>
        <input id="agentBiz" placeholder="Demo Biz Ltd" />
      </div>
      <div class="form-group">
        <label>NIN</label>
        <input id="agentNin" placeholder="1234-5678-9012" />
      </div>
      <div class="form-group">
        <label>Location</label>
        <input id="agentLocation" placeholder="Lagos, Nigeria" />
      </div>
      <p style="font-size:0.8rem;">Selfie capture: <strong>Image captured (demo only)</strong></p>
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

    const layer = document.getElementById("modalLayer");

    /* MONEY MOVES ACTIONS */

    // FX convert demo
    layer.querySelector("#btnFxConvert")?.addEventListener("click", () => {
      balances.NGN -= 50000;
      balances.USD += 50;
      updateBalance();
      transactions.push({
        type: "out",
        amount: 50000,
        desc: "FX → USD",
        currency: "NGN",
      });
      transactions.push({
        type: "in",
        amount: 50,
        desc: "FX from NGN",
        currency: "USD",
      });
      loadTransactions();
      showReceipt(
        "FX conversion (demo)",
        `<p>Converted ${u.formatCurrency(
          50000,
          "NGN"
        )} to ${u.formatCurrency(50, "USD")}.</p>`
      );
    });

    // Receive – copy details
    layer.querySelector("#btnCopyDetails")?.addEventListener("click", () => {
      const acc = document.getElementById("lblAccountNo")?.textContent || "";
      const tag = document.getElementById("lblTag")?.textContent || "";
      navigator.clipboard?.writeText(`Account: ${acc} • Tag: ${tag}`);
      u.showToast("Details copied (demo)");
    });

    // Add money
    layer.querySelector("#btnTopupDemo")?.addEventListener("click", () => {
      const amt = Number(
        layer.querySelector("#topupAmount")?.value || "5000"
      );
      if (amt > 0) {
        balances[currentWallet] += amt;
        transactions.push({
          type: "in",
          amount: amt,
          desc: "Wallet top-up",
          currency: currentWallet,
        });
        updateBalance();
        loadTransactions();
        showReceipt(
          "Top-up successful (demo)",
          `<p>Added ${u.formatCurrency(
            amt,
            currentWallet
          )} to your ${currentWallet} wallet.</p>`
        );
      }
    });

    // Withdraw
    layer.querySelector("#btnWithdrawDemo")?.addEventListener("click", () => {
      const amt = Number(
        layer.querySelector("#withdrawAmount")?.value || "2000"
      );
      if (amt > 0) {
        balances[currentWallet] -= amt;
        transactions.push({
          type: "out",
          amount: amt,
          desc: "Withdrawal to bank/agent",
          currency: currentWallet,
        });
        updateBalance();
        loadTransactions();
        showReceipt(
          "Withdrawal created (demo)",
          `<p>Withdrawal of ${u.formatCurrency(
            amt,
            currentWallet
          )} has been created in demo mode.</p>`
        );
      }
    });

    // Bank transfer
    layer
      .querySelector("#btnBankTransferDemo")
      ?.addEventListener("click", () => {
        const bank = layer.querySelector("#bankName")?.value || "Demo Bank";
        const acc =
          layer.querySelector("#bankAccount")?.value || "0123456789";
        const amt = Number(
          layer.querySelector("#bankAmount")?.value || "5000"
        );
        if (amt > 0) {
          balances[currentWallet] -= amt;
          transactions.push({
            type: "out",
            amount: amt,
            desc: `Transfer to ${bank} (${acc})`,
            currency: currentWallet,
          });
          updateBalance();
          loadTransactions();
          showReceipt(
            "Bank transfer (demo)",
            `<p>Transfer of ${u.formatCurrency(
              amt,
              currentWallet
            )} to ${bank} (${acc}) created in demo.</p>`
          );
        }
      });

    // Request money
    layer.querySelector("#btnRequestDemo")?.addEventListener("click", () => {
      const tag = layer.querySelector("#reqTag")?.value || "@friend54";
      const amt = Number(
        layer.querySelector("#reqAmount")?.value || "10000"
      );
      requests.unshift(`You requested ${u.formatCurrency(amt, "NGN")} from ${tag}`);
      loadRequests();
      u.showToast("Request created (demo)");
      showReceipt(
        "Request created (demo)",
        `<p>Requested ${u.formatCurrency(
          amt,
          "NGN"
        )} from ${tag}. This will not send a real notification in demo mode.</p>`
      );
    });

    // Send PAY54 → PAY54
    layer.querySelector("#btnSendDemo")?.addEventListener("click", () => {
      const amt = Number(
        layer.querySelector("#sendAmount")?.value || "1000"
      );
      if (amt > 0) {
        balances[currentWallet] -= amt;
        transactions.push({
          type: "out",
          amount: amt,
          desc: "Sent to PAY54 user (demo)",
          currency: currentWallet,
        });
        updateBalance();
        loadTransactions();
        showReceipt(
          "Payment sent (demo)",
          `<p>Sent ${u.formatCurrency(
            amt,
            currentWallet
          )} to another PAY54 user (demo only).</p>`
        );
      }
    });

    /* SERVICES */

    // Savings pot
    layer.querySelector("#btnSavingsDemo")?.addEventListener("click", () => {
      const name = layer.querySelector("#potName")?.value || "Savings pot";
      const target = Number(
        layer.querySelector("#potTarget")?.value || "100000"
      );
      requests.unshift(`Savings pot "${name}" created (target ${u.formatCurrency(
        target,
        "NGN"
      )})`);
      loadRequests();
      showReceipt(
        "Savings pot created (demo)",
        `<p>Pot <strong>${name}</strong> created with target ${u.formatCurrency(
          target,
          "NGN"
        )}.</p>`
      );
    });

    // Bills
    layer.querySelector("#btnBillsDemo")?.addEventListener("click", () => {
      const svc = layer.querySelector("#billService")?.value || "Airtime";
      const amt = Number(
        layer.querySelector("#billAmount")?.value || "2000"
      );
      balances[currentWallet] -= amt;
      transactions.push({
        type: "out",
        amount: amt,
        desc: `Bill payment – ${svc}`,
        currency: currentWallet,
      });
      updateBalance();
      loadTransactions();
      showReceipt(
        "Bill paid (demo)",
        `<p>Paid ${u.formatCurrency(
          amt,
          currentWallet
        )} for ${svc} in demo mode.</p>`
      );
    });

    // Invest demo
    layer.querySelector("#btnInvestDemo")?.addEventListener("click", () => {
      const item = { name: "PAY54 Tech Fund", amountUSD: 50 };
      portfolio.push(item);
      savePortfolio(portfolio);
      showReceipt(
        "Investment simulated (demo)",
        `<p>Invested $${item.amountUSD.toFixed(
          2
        )} into the PAY54 Tech Fund (demo).</p>`
      );
    });

    // Agent application
    layer.querySelector("#btnAgentDemo")?.addEventListener("click", () => {
      const name = layer.querySelector("#agentName")?.value || "Demo Agent";
      requests.unshift(`Agent application received from ${name} (demo)`);
      loadRequests();
      showReceipt(
        "Agent application submitted (demo)",
        `<p>Application for <strong>${name}</strong> recorded in demo.</p>`
      );
    });

    // AI Risk Watch
    layer.querySelector("#btnRiskResolve")?.addEventListener("click", () => {
      requests.unshift("AI Risk alerts marked as resolved (demo)");
      loadRequests();
      u.showToast("Risk alerts resolved (demo)");
    });

    // Bet funding
    layer.querySelector("#btnBetDemo")?.addEventListener("click", () => {
      const amt = Number(
        layer.querySelector("#betAmount")?.value || "2000"
      );
      const adult = layer.querySelector("#betAdult")?.checked;
      if (!adult) {
        u.showToast("You must confirm you are 18+ (demo)");
        return;
      }
      balances[currentWallet] -= amt;
      transactions.push({
        type: "out",
        amount: amt,
        desc: "Bet wallet funding (demo)",
        currency: currentWallet,
      });
      updateBalance();
      loadTransactions();
      showReceipt(
        "Bet wallet funded (demo)",
        `<p>Funded betting wallet with ${u.formatCurrency(
          amt,
          currentWallet
        )} in demo mode.</p>`
      );
    });

    // Smart Checkout
    layer
      .querySelector("#btnCheckoutApprove")
      ?.addEventListener("click", () => {
        const amt =
          currentWallet === "NGN"
            ? 18000
            : currentWallet === "USD"
            ? 25
            : 20;
        balances[currentWallet] -= amt;
        transactions.push({
          type: "out",
          amount: amt,
          desc: "PAY54 Smart Checkout – Demo Store",
          currency: currentWallet,
        });
        updateBalance();
        loadTransactions();
        showReceipt(
          "Checkout approved (demo)",
          `<p>Paid ${u.formatCurrency(
            amt,
            currentWallet
          )} to Demo Store via PAY54 Smart Checkout (demo).</p>`
        );
      });

    layer
      .querySelector("#btnCheckoutDecline")
      ?.addEventListener("click", () => {
        u.showToast("Checkout declined (demo)");
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
