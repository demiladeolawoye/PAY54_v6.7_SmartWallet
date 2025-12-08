/* ============================================================
   PAY54 v6.7 Dashboard Engine
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
     Demo data
  ------------------------------------------------------------ */

  let currentWallet = "NGN";

  const balances = {
    NGN: 540000,
    USD: 1200,
    GBP: 880,
  };

  const transactions = [
    { type: "in", amount: 52000, desc: "Wallet top-up", currency: "NGN" },
    { type: "out", amount: 12000, desc: "Airtime MTN", currency: "NGN" },
    { type: "in", amount: 100, desc: "FX → USD", currency: "USD" },
  ];

  const requests = [
    "Prem requested ₦12,000",
    "Agent onboarding pending",
    "FX spotlight: NGN weakening to USD",
  ];

  /* ------------------------------------------------------------
     UI Update Functions
  ------------------------------------------------------------ */

  function updateBalance() {
    const el = document.getElementById("lblBalance");
    if (!el) return;
    el.textContent = u.formatCurrency(balances[currentWallet], currentWallet);

    document.getElementById("lblWalletName").textContent =
      currentWallet + " Wallet";
    document.getElementById("lblWalletId").textContent = "••• " +
      (currentWallet === "NGN" ? "540" : currentWallet === "USD" ? "120" : "088");
  }

  function loadTransactions() {
    const list = document.getElementById("listTx");
    if (!list) return;
    list.innerHTML = "";

    transactions.forEach((tx) => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      left.textContent = tx.desc;

      const right = document.createElement("span");
      right.textContent = (tx.type === "in" ? "+" : "-") +
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

  /* ------------------------------------------------------------
     Modal Content Templates
  ------------------------------------------------------------ */

  const templateSend = `
    <p>Send money to wallet, bank or mobile money.</p>
    <p><strong>Demo only</strong> — no real transfer occurs.</p>
  `;

  const templateReceive = `
    <p>Your PAY54 receiving details:</p>
    <p><strong>PAY54 Tag:</strong> @premOlawoye</p>
    <p><strong>Account:</strong> 123456789 (Demo Bank)</p>
  `;

  const templateAdd = `
    <p>Add funds using card, bank or agents.</p>
    <p>This is a UI-only simulation.</p>
  `;

  const templateWithdraw = `
    <p>Withdraw to bank or via agent.</p>
    <p>Demo only.</p>
  `;

  const templateFX = `
    <p>Convert between NGN ⇄ USD/GBP.</p>
    <p>Demo rate: NGN 1,000 = USD 1</p>
    <button id="btnFxConvert" class="btn-soft" style="margin-top:10px;">Convert 50,000 NGN → USD</button>
  `;

  const templateBills = `
    <p>Pay Airtime • Data • Power • TV</p>
    <p>Demo mode shows UI only.</p>
  `;

  const templateAgent = `
    <p>Become a PAY54 agent.</p>
    <p>You earn commissions on transactions.</p>
  `;

  const templateInvest = `
    <p>Invest in curated low-risk portfolios.</p>
    <p>Demo only.</p>
  `;

  const templateShop = `
    <p>Shop on the Fly — PAY54 instant payments.</p>
  `;

  /* ------------------------------------------------------------
     Modal triggers
  ------------------------------------------------------------ */

  const modalMap = {
    send: templateSend,
    receive: templateReceive,
    add: templateAdd,
    withdraw: templateWithdraw,
    fx: templateFX,
    bills: templateBills,
    agent: templateAgent,
    invest: templateInvest,
    shop: templateShop,
  };

  function handleModalClick(e) {
    const key = e.currentTarget.dataset.modal;
    if (!key) return;

    const content = modalMap[key] || "<p>Feature under development.</p>";
    modal.openModal("PAY54 • " + key.toUpperCase(), content);

    // FX special case
    if (key === "fx") {
      const btn = document.getElementById("btnFxConvert");
      if (btn) {
        btn.addEventListener("click", () => {
          balances.NGN -= 50000;
          balances.USD += 50;
          updateBalance();
          loadTransactions();
          u.showToast("FX conversion complete");
          modal.closeModal();
        });
      }
    }
  }

  /* ------------------------------------------------------------
     Event Listeners
  ------------------------------------------------------------ */

  // Money moves, services, shortcuts
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", handleModalClick);
  });

  // Wallet switching (NGN / USD / GBP)
  document.querySelectorAll("[data-wallet]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentWallet = btn.dataset.wallet;
      updateBalance();
      u.showToast(currentWallet + " wallet selected");
    });
  });

  // Clear Alerts
  const btnClear = document.getElementById("btnClearAlerts");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      requests.length = 0;
      loadRequests();
      u.showToast("Alerts cleared");
    });
  }

  /* ------------------------------------------------------------
     Initial Load
  ------------------------------------------------------------ */

  updateBalance();
  loadRequests();
  loadTransactions();

})();

