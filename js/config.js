/* =============================================================================
 * config.js — SINGLE SOURCE OF TRUTH
 * Tech Spec §26: tập trung mọi giá trị dễ thay đổi tại một nơi.
 * Sửa giá / hotline / URL / pixel ở ĐÂY, không hard-code rải rác.
 * =========================================================================== */

window.SADU_CONFIG = {

  /* --- PRICING (chốt theo Quyết định #6) ------------------------------------
   * Giá lẻ:   1 gói = 109.000đ
   * Combo:    4 gói = 396.000đ
   * Từ 5 gói: comboCount = floor(qty/4); remain = qty % 4
   *           total = comboCount*COMBO_PRICE + remain*UNIT_PRICE
   * Khuyến mại = (qty * UNIT_PRICE) - total
   * -------------------------------------------------------------------------*/
  UNIT_PRICE: 109000,        // đơn giá 1 gói 250g
  COMBO_QTY: 4,              // số gói tạo thành 1 combo 1kg
  COMBO_PRICE: 396000,       // giá 1 combo 1kg (4 gói)

  /* --- SHIPPING (chốt theo Quyết định #7) ----------------------------------- */
  FREE_SHIP_THRESHOLD: 250000, // tổng tiền >= 250.000 => freeship
  SHIPPING_FEE: 30000,         // ngược lại => 30.000

  /* --- QUANTITY SELECTOR ----------------------------------------------------- */
  QTY_MIN: 1,
  QTY_MAX: 99,               // TODO-CONFIG: xác nhận trần số lượng nếu cần
  QTY_DEFAULT: 4,            // mặc định đẩy về Combo (mục tiêu chuyển đổi)

  /* --- CONTACT --------------------------------------------------------------- */
  HOTLINE: '1900 8952',                 // TODO-CONFIG: số hotline thật
  HOTLINE_HREF: 'tel:19008952',         // TODO-CONFIG
  COMPANY_NAME: 'SADU',                 // TODO-CONFIG: tên công ty đầy đủ
  COMPANY_ADDRESS: 'Thong tin dia chi showroom dang duoc cap nhat',
  WEBSITE: 'https://sadu.vn',
  FANPAGE: 'https://facebook.com/sadu.vn',
  EMAIL: 'hello@sadu.vn',

  /* --- INTEGRATIONS (để trống, không hard-code khóa bí mật) ----------------- */
  GAS_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbz0qnIJ7NaiDIW-zrBTvUfuxpM52vjDrxiwlnB7l50k98vGFxDKIUxkZrrBcJz8kQQS/exec',        // TODO-INTEGRATION: URL Google Apps Script Web App
  // Telegram: token KHÔNG đặt phía client (Tech Spec §25). Gửi qua GAS server-side.
  TELEGRAM_ENABLED: false,   // TODO-INTEGRATION: bật khi GAS đã cấu hình Telegram

  FB_PIXEL_ID: '',           // TODO-INTEGRATION
  TIKTOK_PIXEL_ID: '',       // TODO-INTEGRATION
  GA4_ID: '',                // TODO-INTEGRATION
  GTM_ID: '',                // TODO-INTEGRATION

  /* --- LOCALE ---------------------------------------------------------------- */
  LOCALE: 'vi-VN',
  CURRENCY_SUFFIX: 'đ',
};
