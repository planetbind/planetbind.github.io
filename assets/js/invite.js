// Nuralis invite page: on an iPhone or iPad, go straight to the App Store (or the offer-code
// redeem page when the link carries a code); elsewhere the page and its button are the invite.
(function () {
  "use strict";
  var id = "6813225909";
  var url = "https://apps.apple.com/app/id" + id;
  var code = new URLSearchParams(window.location.search).get("code");
  if (code && /^[A-Za-z0-9_-]{1,40}$/.test(code)) {
    url = "https://apps.apple.com/redeem?ctx=offercodes&id=" + id + "&code=" + encodeURIComponent(code);
  }
  var button = document.getElementById("get");
  if (button) button.setAttribute("href", url);
  var ua = navigator.userAgent || "";
  var iPad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || iPad) window.location.replace(url);
})();
