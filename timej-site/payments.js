(() => {
  "use strict";
  const cfg = window.TIMEJ_PAYMENT_CONFIG || {};
  const button = document.getElementById("upi-support");
  const hint = document.getElementById("upi-hint");
  const modal = document.getElementById("payment-modal");
  const qrBox = document.getElementById("upi-qr");
  const payeeLabel = document.getElementById("upi-payee-label");
  const upiId = typeof cfg.upiId === "string" ? cfg.upiId.trim() : "";
  const payee = typeof cfg.payeeName === "string" ? cfg.payeeName.trim() : "";
  const amount = "49.00";
  const note = "TimeJ Support";
  const validUpi = /^[\w.\-]{2,256}@[\w]{2,64}$/.test(upiId);
  const uri = validUpi && payee
    ? "upi://pay?pa=" + encodeURIComponent(upiId) + "&pn=" + encodeURIComponent(payee) + "&am=" + amount + "&cu=INR&tn=" + encodeURIComponent(note)
    : "";
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };
  if (button && hint) {
    if (!uri) {
      button.disabled = true;
      hint.textContent = "UPI is disabled until a suitable guardian-managed payment account and matching payee name are configured.";
    } else {
      button.disabled = false;
      hint.textContent = "Review the payee and amount in your UPI app before approving.";
      button.addEventListener("click", () => {
        if (/Android/i.test(navigator.userAgent)) {
          window.location.href = uri;
          return;
        }
        if (!modal || !qrBox || !window.QRCode) {
          hint.textContent = "QR display is unavailable. Open the page on a device with a UPI app.";
          return;
        }
        payeeLabel.textContent = payee;
        qrBox.innerHTML = "";
        new QRCode(qrBox,{text:uri,width:192,height:192,colorDark:"#080808",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
        modal.classList.add("open");
        modal.setAttribute("aria-hidden","false");
      });
    }
  }
  document.querySelectorAll("[data-close-payment]").forEach(el => el.addEventListener("click",closeModal));
  document.addEventListener("keydown",event => { if(event.key === "Escape") closeModal(); });
  const internationalUrl = typeof cfg.internationalUrl === "string" ? cfg.internationalUrl.trim() : "";
  const internationalLink = document.getElementById("international-link");
  if (internationalLink && /^https:\/\//i.test(internationalUrl)) {
    internationalLink.href = internationalUrl;
    internationalLink.hidden = false;
  }
})();