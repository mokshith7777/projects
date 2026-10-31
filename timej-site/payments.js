(() => {
  "use strict";
  const cfg = window.TIMEJ_PAYMENT_CONFIG || {};
  const amount = "49.00";
  const note = "TimeJ Support";
  const supportButton = document.getElementById("upi-support");
  const hint = document.getElementById("upi-hint");
  const modal = document.getElementById("payment-modal");
  const qrBox = document.getElementById("upi-qr");
  const payeeLabel = document.getElementById("upi-payee-label");
  const validUpi = typeof cfg.upiId === "string" && /^[\w.\-]{2,256}@[\w]{2,64}$/.test(cfg.upiId.trim());
  const payee = (cfg.payeeName || "").trim();
  const upiUrl = validUpi && payee
    ? "upi://pay?pa=" + encodeURIComponent(cfg.upiId.trim()) + "&pn=" + encodeURIComponent(payee) + "&am=" + amount + "&cu=INR&tn=" + encodeURIComponent(note)
    : "";
  if (!upiUrl) {
    supportButton.disabled = true;
    hint.textContent = "UPI is not active yet. The account holder must add a valid UPI ID and payee name in the private payment setup before accepting payments.";
  } else {
    hint.textContent = "UPI payment opens in your installed payment app. Verify the payee and amount before approving.";
    supportButton.addEventListener("click", () => {
      const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (mobile) {
        window.location.href = upiUrl;
        return;
      }
      payeeLabel.textContent = payee;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden","false");
      qrBox.innerHTML = "";
      if (window.QRCode) new QRCode(qrBox,{text:upiUrl,width:192,height:192,colorDark:"#080808",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
      else qrBox.textContent = "QR generator unavailable. Open this page on an Android device.";
    });
  }
  document.querySelectorAll("[data-close-payment]").forEach(el => el.addEventListener("click",() => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
  }));
  document.addEventListener("keydown",e => { if(e.key === "Escape"){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");} });
  const intl = (cfg.internationalUrl || "").trim();
  const intlLink = document.getElementById("international-link");
  if (intl && /^https:\/\//i.test(intl)) { intlLink.href = intl; intlLink.hidden = false; }
  // Public GitHub release metadata only. Counts are GitHub asset download totals, not unique people.
  const api = "https://api.github.com/repos/mokshith7777/projects/releases/latest";
  fetch(api,{headers:{Accept:"application/vnd.github+json"}}).then(r => {
    if(!r.ok) throw new Error("No published release");
    return r.json();
  }).then(release => {
    const asset = (release.assets || []).find(a => a.name === "TimeJ.apk");
    const status = document.getElementById("release-status");
    const meta = document.getElementById("release-meta");
    const version = document.getElementById("release-version");
    const ready = document.getElementById("release-ready");
    if (!asset) throw new Error("TimeJ.apk is not attached to the latest release");
    status.classList.add("is-ready");
    status.querySelector("span").textContent = "LATEST RELEASE AVAILABLE";
    version.textContent = (release.tag_name || "LATEST").toUpperCase() + " · APK";
    ready.textContent = "● READY";
    meta.textContent = "PUBLISHED " + new Date(release.published_at).toLocaleDateString() + " · " + asset.download_count.toLocaleString() + " DOWNLOADS";
    document.querySelectorAll(".release-download").forEach(a => a.href = "https://github.com/mokshith7777/projects/releases/latest/download/TimeJ.apk");
  }).catch(() => {
    const status = document.getElementById("release-status");
    status.classList.add("is-error");
    status.querySelector("span").textContent = "APK RELEASE NOT PUBLISHED YET";
    document.getElementById("release-version").textContent = "AWAITING GITHUB RELEASE";
    document.getElementById("release-ready").textContent = "● PENDING";
    document.getElementById("release-meta").textContent = "The latest release must include an asset named TimeJ.apk before downloads are available.";
  });
})();