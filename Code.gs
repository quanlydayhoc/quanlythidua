/**
 * SỔ ĐẦU BÀI ĐIỆN TỬ — MÁY CHỦ GOOGLE APPS SCRIPT
 * Trường THPT Bình Thạnh Đông · Thiết kế: Lương Khánh Tường
 *
 * Cài đặt:
 *  1. Tạo Google Sheet mới → Tiện ích mở rộng → Apps Script → xoá nội dung mẫu, dán toàn bộ file này → Lưu.
 *  2. Cài đặt dự án (bánh răng) → Múi giờ: (GMT+07:00) Ho Chi Minh.
 *  3. Chọn hàm setup → Chạy → cấp quyền (một lần).
 *  4. Triển khai → Tùy chọn triển khai mới → Ứng dụng web · Thực thi với tư cách: Tôi · Người có quyền truy cập: Bất kỳ ai.
 *  5. Chép URL kết thúc bằng /exec, dán vào DEFAULT_API_URL trong index.html (hoặc nút "Kết nối máy chủ" trên trang).
 */

/* ===================================================================
 * LÕI NGHIỆP VỤ — dùng chung cho máy chủ Apps Script và chế độ dùng thử
 * (Không sửa trực tiếp trong Code.gs / index.html: file được ghép tự động)
 * =================================================================== */
var CORE_DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
var CORE_ROLES = { GV: 'Giáo viên', BGH: 'Ban giám hiệu', DOAN: 'Đoàn trường', XUAT: 'Được xuất báo cáo' };
var CORE_RATE = { A: 'Tốt', B: 'Khá', C: 'Trung bình', D: 'Yếu' };
var CORE_FIELDS = ['mon', 'phanMon', 'tietPPCT', 'tenBai', 'vang', 'nhanXet', 'xepLoai'];
var CORE_VERSION = 4;
var CORE_EDIT_TYPES = { sua: 'Sửa', xoa: 'Xoá', kyLai: 'Ký lại' };

function coreDefaultCatalog() {
  var r = [];
  function add(ma, nhom, ten, loai, phamVi, kieu, dHS, dLop) {
    r.push({ ma: ma, nhom: nhom, ten: ten, loai: loai, phamVi: phamVi, kieu: kieu, diemHS: dHS, diemLop: dLop, active: true });
  }
  add('CC01', 'Chuyên cần', 'Đi học trễ', 'tru', 'hs', '', 2, 1);
  add('CC02', 'Chuyên cần', 'Vắng học có phép (không báo trước)', 'tru', 'hs', '', 1, 0);
  add('CC03', 'Chuyên cần', 'Vắng học không phép', 'tru', 'hs', '', 5, 2);
  add('CC04', 'Chuyên cần', 'Bỏ tiết, trốn tiết', 'tru', 'hs', '', 5, 3);
  add('HT01', 'Học tập', 'Không học bài, không làm bài tập', 'tru', 'hs', '', 2, 1);
  add('HT02', 'Học tập', 'Không mang sách vở, dụng cụ học tập', 'tru', 'hs', '', 1, 1);
  add('HT03', 'Học tập', 'Mất trật tự, làm việc riêng trong giờ', 'tru', 'hs', '', 2, 1);
  add('HT04', 'Học tập', 'Sử dụng điện thoại trong giờ học', 'tru', 'hs', '', 3, 2);
  add('HT05', 'Học tập', 'Quay cóp, gian lận khi kiểm tra', 'tru', 'hs', '', 5, 3);
  add('NN01', 'Nề nếp, tác phong', 'Không mặc đồng phục, không đeo bảng tên', 'tru', 'hs', '', 2, 1);
  add('NN02', 'Nề nếp, tác phong', 'Đầu tóc, trang phục không đúng quy định', 'tru', 'hs', '', 2, 1);
  add('NN03', 'Nề nếp, tác phong', 'Xả rác, ăn quà trong lớp', 'tru', 'hs', '', 2, 1);
  add('NN04', 'Nề nếp, tác phong', 'Vi phạm an toàn giao thông', 'tru', 'hs', '', 5, 3);
  add('DD01', 'Đạo đức, ứng xử', 'Nói tục, chửi thề', 'tru', 'hs', '', 3, 2);
  add('DD02', 'Đạo đức, ứng xử', 'Vô lễ với thầy cô, nhân viên', 'tru', 'hs', '', 10, 5);
  add('DD03', 'Đạo đức, ứng xử', 'Gây gổ, đánh nhau', 'tru', 'hs', '', 15, 10);
  add('DD04', 'Đạo đức, ứng xử', 'Hút thuốc lá, thuốc lá điện tử', 'tru', 'hs', '', 10, 5);
  add('DD05', 'Đạo đức, ứng xử', 'Làm hư hỏng tài sản nhà trường', 'tru', 'hs', '', 10, 5);
  add('DT01', 'Thi đua lớp (Đoàn trường)', 'Vệ sinh lớp, khu vực phân công không sạch', 'tru', 'lop', '', 0, 3);
  add('DT02', 'Thi đua lớp (Đoàn trường)', 'Không trực nhật, trực sai giờ', 'tru', 'lop', '', 0, 2);
  add('DT03', 'Thi đua lớp (Đoàn trường)', 'Xếp hàng chào cờ, sinh hoạt dưới cờ chậm, mất trật tự', 'tru', 'lop', '', 0, 3);
  add('DT04', 'Thi đua lớp (Đoàn trường)', 'Không tắt đèn, quạt khi ra về', 'tru', 'lop', '', 0, 2);
  add('DT05', 'Thi đua lớp (Đoàn trường)', 'Không tham gia hoạt động, phong trào Đoàn', 'tru', 'lop', '', 0, 5);
  add('DT06', 'Thi đua lớp (Đoàn trường)', 'Lớp ồn ào trong giờ truy bài, giờ chuyển tiết', 'tru', 'lop', '', 0, 2);
  add('KT01', 'Khen thưởng', 'Điểm hồng: phát biểu xây dựng bài tốt', 'cong', 'hs', 'dh', 1, 1);
  add('KT02', 'Khen thưởng', 'Điểm hồng: đạt điểm 9–10 bài kiểm tra', 'cong', 'hs', 'dh', 1, 1);
  add('KT03', 'Khen thưởng', 'Tuyên dương: việc tốt, nhặt được của rơi trả lại', 'cong', 'hs', 'td', 3, 2);
  add('KT04', 'Khen thưởng', 'Tuyên dương: đạt giải phong trào, cuộc thi', 'cong', 'hs', 'td', 5, 3);
  add('KT05', 'Khen thưởng', 'Lớp đạt giải phong trào Đoàn trường', 'cong', 'lop', '', 0, 5);
  return r;
}
function coreDefaultCfg() {
  return {
    school: { ten: 'Trường THPT Bình Thạnh Đông', so: 'Sở GD&ĐT An Giang', diaChi: 'Xã Bình Thạnh Đông, tỉnh An Giang', hieuTruong: '', biThuDoan: '', namHoc: '2026-2027', startDate: '2026-09-07', totalWeeks: 35, logo: '' },
    points: { lopBase: 100, hsBase: 100, tiet: { A: 1, B: 0, C: -2, D: -5 }, thresholds: { tot: 90, kha: 70, dat: 50 }, congBuTru: true },
    rules: coreDefaultRules(),
    catalog: coreDefaultCatalog(),
    adminPass: 'admin123',
    accounts: [],
    classes: [],
    students: {},
    hsInfo: {}
  };
}
function coreDefaultRules() {
  return {
    graceHours: 24,          // sửa / xoá làm lại trong khoảng này: chữ đen; quá hạn: đỏ đậm
    teacherDelete: true,     // giáo viên được xoá tiết mình đã ký để ký lại
    phanMon: ['Công nghệ', 'GD Quốc phòng và An ninh', 'Hoạt động trải nghiệm, HN', 'Giáo dục địa phương', 'Tin học'],
    watch: { on: true, days: 7, vpCount: 3, truMin: 10, kpCount: 2, scoreBelow: 80 },
    backup: { period: 'week', keep: 12 }
  };
}

/* ---------- Tiện ích ---------- */
function coreStr(v) { return v === null || v === undefined ? '' : String(v); }
function coreNum(v, d) { var n = Number(v); return isFinite(n) ? n : (d || 0); }
function coreErr(msg, code) { var e = new Error(msg); e.code = code || ''; throw e; }
function coreList(s) { return coreStr(s).split(/[,;\n]+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; }); }
function coreUp(s) { return coreStr(s).trim().toUpperCase(); }
function coreClone(o) { return JSON.parse(JSON.stringify(o)); }
function coreP2(n) { return (n < 10 ? '0' : '') + n; }
// Ngày dạng 'yyyy-mm-dd', tính bằng UTC để không lệch múi giờ
function coreParseISO(s) { var a = coreStr(s).split('-').map(Number); return Date.UTC(a[0], a[1] - 1, a[2]); }
function coreISO(t) { var d = new Date(t); return d.getUTCFullYear() + '-' + coreP2(d.getUTCMonth() + 1) + '-' + coreP2(d.getUTCDate()); }
function coreDateOf(cfg, week, day) { return coreISO(coreParseISO(cfg.school.startDate) + ((week - 1) * 7 + day) * 864e5); }
function coreWeekOf(cfg, iso) { return Math.floor(Math.floor((coreParseISO(iso) - coreParseISO(cfg.school.startDate)) / 864e5) / 7) + 1; }
function coreDayIdx(cfg, iso) { return Math.floor((coreParseISO(iso) - coreParseISO(cfg.school.startDate)) / 864e5) % 7; }
function coreVN(iso) { var a = coreStr(iso).split('-'); return a.length === 3 ? a[2] + '/' + a[1] + '/' + a[0] : ''; }

/* ---------- Cấu hình ---------- */
function coreMergeCfg(c) {
  var d = coreDefaultCfg();
  c = c || {};
  var out = {
    school: Object.assign({}, d.school, c.school || {}),
    points: Object.assign({}, d.points, c.points || {}),
    catalog: Array.isArray(c.catalog) && c.catalog.length ? c.catalog : d.catalog,
    adminPass: coreStr(c.adminPass) || d.adminPass,
    accounts: Array.isArray(c.accounts) ? c.accounts : [],
    classes: Array.isArray(c.classes) ? c.classes : [],
    students: c.students && typeof c.students === 'object' ? c.students : {},
    hsInfo: c.hsInfo && typeof c.hsInfo === 'object' ? c.hsInfo : {},
    rules: Object.assign({}, d.rules, c.rules || {})
  };
  out.rules.watch = Object.assign({}, d.rules.watch, (c.rules && c.rules.watch) || {});
  out.rules.backup = Object.assign({}, d.rules.backup, (c.rules && c.rules.backup) || {});
  if (!Array.isArray(out.rules.phanMon)) out.rules.phanMon = coreList(out.rules.phanMon);
  out.points.tiet = Object.assign({}, d.points.tiet, (c.points && c.points.tiet) || {});
  out.points.thresholds = Object.assign({}, d.points.thresholds, (c.points && c.points.thresholds) || {});
  out.school.totalWeeks = Math.max(1, Math.min(52, coreNum(out.school.totalWeeks, 35)));
  return out;
}
function coreCleanCfg(cfg, prev) {
  var c = coreMergeCfg(cfg);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(coreStr(c.school.startDate))) c.school.startDate = prev.school.startDate;
  ['ten', 'so', 'diaChi', 'hieuTruong', 'biThuDoan', 'namHoc'].forEach(function (k) { c.school[k] = coreStr(c.school[k]).trim().slice(0, 200); });
  c.school.logo = coreStr(c.school.logo);
  if (c.school.logo && (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(c.school.logo) || c.school.logo.length > 45000)) coreErr('Logo không hợp lệ hoặc quá lớn. Chọn ảnh khác (PNG/JPG).', 'bad');
  c.points.lopBase = coreNum(c.points.lopBase, 100);
  c.points.hsBase = coreNum(c.points.hsBase, 100);
  ['A', 'B', 'C', 'D'].forEach(function (k) { c.points.tiet[k] = coreNum(c.points.tiet[k], 0); });
  ['tot', 'kha', 'dat'].forEach(function (k) { c.points.thresholds[k] = coreNum(c.points.thresholds[k], 0); });
  c.points.congBuTru = !!c.points.congBuTru;
  var seen = {}, n = 0;
  c.catalog = c.catalog.filter(function (it) { return it && coreStr(it.ten).trim(); }).map(function (it) {
    var loai = it.loai === 'cong' ? 'cong' : 'tru';
    var ma = coreUp(it.ma).replace(/[^A-Z0-9_-]/g, '');
    while (!ma || seen[ma]) { n++; ma = (loai === 'cong' ? 'KT' : 'VP') + coreP2(n); }
    seen[ma] = 1;
    var phamVi = it.phamVi === 'lop' ? 'lop' : 'hs';
    return {
      ma: ma, nhom: coreStr(it.nhom).trim().slice(0, 80) || (loai === 'cong' ? 'Khen thưởng' : 'Khác'), ten: coreStr(it.ten).trim().slice(0, 200),
      loai: loai, phamVi: phamVi, kieu: loai === 'cong' && phamVi === 'hs' ? (it.kieu === 'td' ? 'td' : 'dh') : '',
      diemHS: phamVi === 'lop' ? 0 : Math.abs(coreNum(it.diemHS, 0)), diemLop: Math.abs(coreNum(it.diemLop, 0)), active: it.active !== false
    };
  });
  var tks = {};
  c.accounts = c.accounts.filter(function (a) { return a && coreStr(a.name).trim() && coreStr(a.tk).trim(); }).map(function (a) {
    var tk = coreStr(a.tk).trim().toLowerCase();
    if (tks[tk]) coreErr('Tài khoản "' + tk + '" bị trùng.', 'bad');
    tks[tk] = 1;
    var roles = (Array.isArray(a.roles) ? a.roles : coreList(a.roles)).map(coreUp).filter(function (r) { return CORE_ROLES[r]; });
    if (!roles.length) roles = ['GV'];
    return {
      id: coreStr(a.id).trim() || ('tk_' + tk), name: coreStr(a.name).trim(), tk: tk, mk: coreStr(a.mk) || '123456', mon: coreStr(a.mon).trim(),
      lop: (Array.isArray(a.lop) ? a.lop : coreList(a.lop)).map(coreUp).filter(function (x) { return x; }), cn: coreUp(a.cn), roles: roles
    };
  });
  c.classes = c.classes.map(coreUp).filter(function (x) { return x; });
  var st = {};
  Object.keys(c.students).forEach(function (l) { var L = coreUp(l); if (L) st[L] = coreRoster(c.students[l]); });
  c.students = st;
  var info = {};
  Object.keys(c.hsInfo || {}).forEach(function (l) { var L = coreUp(l); if (st[L]) info[L] = coreCleanInfo(c.hsInfo[l], st[L]); });
  c.hsInfo = info;
  var R = c.rules;
  R.graceHours = Math.max(0, Math.min(720, coreNum(R.graceHours, 24)));
  R.teacherDelete = R.teacherDelete !== false;
  R.phanMon = (Array.isArray(R.phanMon) ? R.phanMon : coreList(R.phanMon)).map(function (x) { return coreStr(x).trim(); }).filter(function (x) { return x; }).slice(0, 40);
  var W = R.watch;
  R.watch = { on: W.on !== false, days: Math.max(1, Math.min(60, coreNum(W.days, 7))), vpCount: Math.max(0, coreNum(W.vpCount, 3)), truMin: Math.max(0, coreNum(W.truMin, 10)), kpCount: Math.max(0, coreNum(W.kpCount, 2)), scoreBelow: Math.max(0, coreNum(W.scoreBelow, 80)) };
  R.backup = { period: ['off', 'day', 'week', 'month'].indexOf(R.backup.period) >= 0 ? R.backup.period : 'week', keep: Math.max(1, Math.min(60, coreNum(R.backup.keep, 12))) };
  c.adminPass = coreStr(cfg && cfg.adminPass) || prev.adminPass;
  return c;
}
function coreRoster(list) {
  var seen = {}, out = [];
  (Array.isArray(list) ? list : coreList(list)).forEach(function (n) { n = coreStr(n).replace(/\s+/g, ' ').trim(); if (n && !seen[n.toLowerCase()]) { seen[n.toLowerCase()] = 1; out.push(n); } });
  return out.slice(0, 80);
}
function coreCleanInfo(map, names) {
  var out = {};
  Object.keys(map || {}).forEach(function (n) {
    if (names.indexOf(n) < 0) return;
    var x = map[n] || {}, o = { ns: coreStr(x.ns).trim().slice(0, 20), ph: coreStr(x.ph).trim().slice(0, 80), sdt: coreStr(x.sdt).replace(/[^0-9+ .]/g, '').trim().slice(0, 20) };
    if (o.ns || o.ph || o.sdt) out[n] = o;
  });
  return out;
}
function corePublicCfg(cfg, me) {
  var c = coreClone(cfg);
  c.adminPass = '';
  if (!me.admin) c.accounts = c.accounts.map(function (a) { return { id: a.id, name: a.name, mon: a.mon, lop: a.lop, cn: a.cn, roles: a.roles }; });
  // Thông tin phụ huynh: chỉ quản trị, BGH, người được xuất báo cáo toàn trường; GVCN thấy lớp mình
  if (!(me.admin || coreHas(me, 'BGH') || coreHas(me, 'XUAT'))) {
    var keep = {}; if (me.cn && c.hsInfo[me.cn]) keep[me.cn] = c.hsInfo[me.cn]; c.hsInfo = keep;
  }
  return c;
}
// Tiết bị sửa / xoá làm lại quá thời gian cho phép tính từ lần ký đầu → hiển thị đỏ đậm
function coreLastEdit(e) { var ed = (e && e.edits) || []; return ed.length ? ed[ed.length - 1] : null; }
function coreIsLate(e, rules) {
  if (!e || !e.edits || !e.edits.length) return false;
  var first = Date.parse(e.firstSignedAt || e.signedAt), g = coreNum(rules && rules.graceHours, 24) * 3600e3;
  if (!isFinite(first)) return true;
  return e.edits.some(function (x) { return Date.parse(x.at) - first > g; });
}
// Lấy TKB áp dụng cho một lớp ở một tuần: phiên bản có "từ tuần" lớn nhất mà ≤ tuần đang xem
function coreTkbFor(rows, lop, week) {
  var best = 0;
  rows.forEach(function (r) { if (r.lop === lop && r.from <= week && r.from > best) best = r.from; });
  var out = {};
  if (best) rows.forEach(function (r) { if (r.lop === lop && r.from === best) out[r.thu + r.buoi + r.tiet] = { mon: r.mon, phanMon: r.phanMon, gvId: r.gvId, gvName: r.gvName }; });
  return { from: best, slots: out };
}
function coreMe(a) {
  if (!a) return null;
  return { id: a.id, name: a.name, mon: a.mon, lop: a.lop || [], cn: a.cn || '', roles: a.roles || ['GV'], admin: false };
}
var CORE_ADMIN = { id: 'admin', name: 'Quản trị', mon: '', lop: [], cn: '', roles: ['BGH', 'DOAN'], admin: true };
function coreHas(u, r) { return !!u && (u.admin || (u.roles || []).indexOf(r) >= 0); }
function coreCanSign(u, lop) { return !!u && (u.admin || (u.lop || []).indexOf(lop) >= 0); }
function coreCanNeNep(u, lop) { return !!u && (u.admin || coreHas(u, 'DOAN') || coreHas(u, 'BGH') || (u.cn && u.cn === lop)); }
function coreCanRoster(u, lop) { return !!u && (u.admin || (u.cn && u.cn === lop)); }
// Xuất báo cáo: GVCN (lớp mình), Đoàn trường, Ban giám hiệu, hoặc người được quản trị cấp quyền XUAT (toàn trường)
function coreExportAll(u) { return !!u && (u.admin || coreHas(u, 'BGH') || coreHas(u, 'DOAN') || coreHas(u, 'XUAT')); }
function coreCanExport(u) { return coreExportAll(u) || !!(u && u.cn); }

/* Gắn mục danh mục vào bản ghi (chụp lại tên và điểm tại thời điểm ghi) */
function coreResolve(cfg, items, loai, lop, needHS) {
  var roster = cfg.students[lop] || [];
  return (items || []).slice(0, 60).map(function (x) {
    var it = cfg.catalog.filter(function (c) { return c.ma === coreUp(x.ma) && c.loai === loai; })[0];
    if (!it) coreErr('Mục "' + coreStr(x.ma) + '" không có trong danh mục.', 'bad');
    var hs = coreStr(x.hs).replace(/\s+/g, ' ').trim();
    if (it.phamVi === 'hs' || needHS) {
      if (!hs) coreErr('Chọn học sinh cho mục "' + it.ten + '".', 'bad');
      if (roster.length && roster.indexOf(hs) < 0) coreErr('Học sinh "' + hs + '" không có trong danh sách lớp ' + lop + '.', 'bad');
    } else hs = '';
    return { hs: hs, ma: it.ma, ten: it.ten, kieu: it.kieu, diemHS: it.diemHS, diemLop: it.diemLop, ghiChu: coreStr(x.ghiChu).trim().slice(0, 300) };
  });
}
function coreSig(o) {
  var a = CORE_FIELDS.map(function (k) { return coreStr(o[k]); });
  ['vp', 'cong'].forEach(function (k) { (o[k] || []).forEach(function (x) { a.push(k + ':' + x.hs + ':' + x.ma + ':' + x.ghiChu); }); });
  (o.vangDs || []).forEach(function (x) { a.push('v:' + x.hs + ':' + x.loai); });
  return a.join('\u0001');
}
function coreVangText(ds) { return (ds || []).map(function (x) { return x.hs + ' (' + x.loai + ')'; }).join(', '); }
function coreSigOk(s) { return !s || (/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(s) && s.length <= 32000); }
function coreSlotKey(k) { if (!/^[0-5][SC][1-5]$/.test(coreStr(k))) coreErr('Tiết học không hợp lệ.', 'bad'); return k; }

/* ---------- Các thao tác ---------- */
function coreActions(store) {
  function cfg() { return store.getCfg(); }
  function auth(p) {
    var s = p.token ? store.sessGet(p.token) : null;
    if (!s) coreErr('Phiên đăng nhập đã hết hạn. Mời đăng nhập lại.', 'auth');
    if (s.role === 'admin') return CORE_ADMIN;
    var a = cfg().accounts.filter(function (x) { return x.id === s.id; })[0];
    if (!a) coreErr('Tài khoản không còn trong danh sách.', 'auth');
    return coreMe(a);
  }
  function admin(p) { var u = auth(p); if (!u.admin) coreErr('Chỉ quản trị được thực hiện thao tác này.', 'perm'); return u; }
  function lopWeek(p, c) {
    var lop = coreUp(p.lop), week = coreNum(p.week, 0);
    if (!lop || week < 1 || week > c.school.totalWeeks) coreErr('Lớp hoặc tuần không hợp lệ.', 'bad');
    return { lop: lop, week: week };
  }
  return {
    ping: function () { return 'Sổ đầu bài điện tử — máy chủ đang chạy'; },
    brand: function () { var sc = cfg().school; return { ten: sc.ten, so: sc.so, namHoc: sc.namHoc, logo: sc.logo || '' }; },

    login: function (p) {
      var c = cfg();
      if (p.role === 'admin') {
        if (coreStr(p.mk) !== c.adminPass) coreErr('Mật khẩu quản trị không đúng.', 'login');
        var t1 = store.uuid();
        store.sessPut(t1, { role: 'admin' });
        return { token: t1, me: CORE_ADMIN, cfg: corePublicCfg(c, CORE_ADMIN) };
      }
      var tk = coreStr(p.tk).trim().toLowerCase();
      var a = c.accounts.filter(function (x) { return x.tk === tk; })[0];
      if (!a || coreStr(a.mk) !== coreStr(p.mk)) coreErr(c.accounts.length ? 'Sai tài khoản hoặc mật khẩu.' : 'Chưa có tài khoản nào. Quản trị cần nhập danh sách trước.', 'login');
      var t2 = store.uuid();
      store.sessPut(t2, { role: 'user', id: a.id });
      var me = coreMe(a);
      return { token: t2, me: me, cfg: corePublicCfg(c, me) };
    },
    logout: function (p) { if (p.token) store.sessDel(p.token); return true; },
    getPublic: function (p) { var u = auth(p); return { me: u, cfg: corePublicCfg(cfg(), u) }; },
    changePass: function (p) {
      var u = auth(p);
      if (u.admin) coreErr('Quản trị đổi mật khẩu trong Cấu hình.', 'bad');
      var np = coreStr(p.newPass);
      if (np.length < 4) coreErr('Mật khẩu mới cần ít nhất 4 ký tự.', 'bad');
      return store.lock(function () {
        var c = cfg();
        var a = c.accounts.filter(function (x) { return x.id === u.id; })[0];
        if (coreStr(a.mk) !== coreStr(p.oldPass)) coreErr('Mật khẩu hiện tại không đúng.', 'bad');
        a.mk = np;
        store.setCfg(c);
        return true;
      });
    },

    version: function () { return CORE_VERSION; },
    getWeek: function (p) {
      auth(p); var lw = lopWeek(p, cfg());
      var doc = store.getWeek(lw.lop, lw.week);
      doc.tkb = coreTkbFor(store.tkbRows(lw.lop), lw.lop, lw.week);
      return doc;
    },

    saveSlot: function (p) {
      var u = auth(p), c = cfg(), lw = lopWeek(p, c), key = coreSlotKey(p.key);
      if (!coreCanSign(u, lw.lop)) coreErr('Bạn không dạy lớp ' + lw.lop + ' nên không được ký sổ lớp này.', 'perm');
      var f = p.fields || {}, n = {}, roster = c.students[lw.lop] || [];
      CORE_FIELDS.forEach(function (k) { n[k] = coreStr(f[k]).trim().slice(0, 1500); });
      if (!/^[ABCD]?$/.test(n.xepLoai)) n.xepLoai = '';
      if (!n.mon || !n.tenBai) coreErr('Cần nhập Môn học và Tên bài.', 'bad');
      n.vp = coreResolve(c, f.vp, 'tru', lw.lop, true);
      n.cong = coreResolve(c, f.cong, 'cong', lw.lop, true);
      var seenV = {};
      n.vangDs = (Array.isArray(f.vangDs) ? f.vangDs : []).slice(0, 80).map(function (x) {
        var hs = coreStr(x.hs).replace(/\s+/g, ' ').trim();
        if (!hs || seenV[hs]) return null; seenV[hs] = 1;
        if (roster.length && roster.indexOf(hs) < 0) coreErr('Học sinh vắng "' + hs + '" không có trong danh sách lớp.', 'bad');
        return { hs: hs, loai: x.loai === 'KP' ? 'KP' : 'P' };
      }).filter(function (x) { return x; });
      if (n.vangDs.length) n.vang = coreVangText(n.vangDs);
      return store.lock(function () {
        var doc = store.getWeek(lw.lop, lw.week), prev = doc.slots[key], now = store.now(), changed = true, e;
        if (prev && !prev.deleted) {
          if (!u.admin && prev.gvId !== u.id) coreErr('Tiết này do ' + prev.gvName + ' ký, bạn chỉ được xem.', 'perm');
          changed = coreSig(prev) !== coreSig(n);
          if (!changed) return { changed: false, doc: doc };
          e = Object.assign({}, prev, n);
          e.firstSignedAt = prev.firstSignedAt || prev.signedAt;
          e.edits = (prev.edits || []).concat([{ by: u.name, at: now, type: 'sua' }]);
        } else if (prev && prev.deleted) {
          // ký lại sau khi đã xoá: giữ lịch sử, tính thời điểm ký đầu tiên
          e = Object.assign({}, n, { gvId: u.id, gvName: u.name, signedAt: now, firstSignedAt: prev.firstSignedAt || prev.signedAt,
            edits: (prev.edits || []).concat([{ by: u.name, at: now, type: 'kyLai' }]) });
        } else {
          e = Object.assign({}, n, { gvId: u.id, gvName: u.name, signedAt: now, firstSignedAt: now, edits: [] });
        }
        store.putSlot(lw.lop, lw.week, key, e);
        return { changed: changed, doc: store.getWeek(lw.lop, lw.week) };
      });
    },
    deleteSlot: function (p) {
      var u = auth(p), c = cfg(), lw = lopWeek(p, c), key = coreSlotKey(p.key);
      return store.lock(function () {
        var doc = store.getWeek(lw.lop, lw.week), prev = doc.slots[key];
        if (!prev) coreErr('Tiết này chưa được ghi.', 'bad');
        if (u.admin && (p.hard || prev.deleted)) { store.putSlot(lw.lop, lw.week, key, null); }
        else {
          if (prev.deleted) coreErr('Tiết này đã được xoá.', 'bad');
          if (!u.admin && (prev.gvId !== u.id || !c.rules.teacherDelete)) coreErr(prev.gvId !== u.id ? 'Chỉ người đã ký tiết này được xoá.' : 'Quản trị chưa cho phép giáo viên xoá tiết đã ký.', 'perm');
          var t = Object.assign({}, prev, { deleted: true, firstSignedAt: prev.firstSignedAt || prev.signedAt, edits: (prev.edits || []).concat([{ by: u.name, at: store.now(), type: 'xoa' }]) });
          store.putSlot(lw.lop, lw.week, key, t);
        }
        return { changed: true, doc: store.getWeek(lw.lop, lw.week) };
      });
    },
    // Danh sách tiết bị sửa / xoá gần đây (chuông cảnh báo)
    recentEdits: function (p) {
      var u = auth(p), c = cfg(), days = Math.max(1, Math.min(120, coreNum(p.days, 14)));
      var since = new Date(Date.parse(store.now()) - days * 864e5).toISOString();
      var all = u.admin || coreHas(u, 'BGH');
      var out = store.editedSlots(since).filter(function (x) {
        return all || (u.cn && x.lop === u.cn) || x.e.gvId === u.id;
      }).map(function (x) {
        var last = coreLastEdit(x.e);
        return { lop: x.lop, week: x.week, key: x.key, mon: x.e.mon, tenBai: x.e.tenBai, gvName: x.e.gvName, deleted: !!x.e.deleted,
          firstSignedAt: x.e.firstSignedAt || x.e.signedAt, last: last, n: x.e.edits.length, late: coreIsLate(x.e, c.rules) };
      });
      out.sort(function (a, b) { return a.last.at < b.last.at ? 1 : -1; });
      return out.slice(0, 300);
    },

    getRange: function (p) {
      auth(p);
      var c = cfg(), w1 = Math.max(1, coreNum(p.w1, 1)), w2 = Math.min(c.school.totalWeeks + 1, coreNum(p.w2, w1));
      var lops = (p.lops || []).map(coreUp);
      return { weeks: store.weeks(lops, w1, w2), nenep: store.nenep(w1, w2).filter(function (r) { return lops.indexOf(r.lop) >= 0; }) };
    },

    addNeNep: function (p) {
      var u = auth(p), c = cfg(), r = p.rec || {};
      var lop = coreUp(r.lop);
      if (!lop) coreErr('Chọn lớp.', 'bad');
      if (!coreCanNeNep(u, lop)) coreErr('Bạn chỉ ghi nề nếp cho lớp chủ nhiệm của mình.', 'perm');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(coreStr(r.ngay))) coreErr('Ngày không hợp lệ.', 'bad');
      var week = coreWeekOf(c, r.ngay);
      if (week < 1 || week > c.school.totalWeeks) coreErr('Ngày nằm ngoài năm học (tuần 1–' + c.school.totalWeeks + ').', 'bad');
      var loai = r.loai === 'cong' ? 'cong' : 'tru';
      var it = coreResolve(c, [{ hs: r.hs, ma: r.ma, ghiChu: r.ghiChu }], loai, lop, false)[0];
      var rec = {
        id: store.uuid().slice(0, 12), ngay: r.ngay, tuan: week, thang: r.ngay.slice(0, 7), lop: lop, hs: it.hs, loai: loai,
        ma: it.ma, ten: it.ten, kieu: it.kieu, diemHS: it.diemHS, diemLop: it.diemLop, ghiChu: it.ghiChu,
        nguon: u.admin ? 'Quản trị' : coreHas(u, 'DOAN') ? 'Đoàn trường' : coreHas(u, 'BGH') ? 'Ban giám hiệu' : 'GVCN',
        by: u.name, byId: u.id, at: store.now()
      };
      return store.lock(function () { store.nenepAdd(rec); return rec; });
    },
    delNeNep: function (p) {
      var u = auth(p);
      return store.lock(function () {
        var r = store.nenepGet(coreStr(p.id));
        if (!r) coreErr('Không tìm thấy bản ghi.', 'bad');
        if (!u.admin && r.byId !== u.id) coreErr('Chỉ người ghi hoặc quản trị được xoá.', 'perm');
        store.nenepDel(r.id);
        return true;
      });
    },

    saveRoster: function (p) {
      var u = auth(p), lop = coreUp(p.lop);
      if (!coreCanRoster(u, lop)) coreErr('Chỉ GVCN lớp ' + lop + ' hoặc quản trị được cập nhật danh sách.', 'perm');
      var list = Array.isArray(p.students) ? p.students : coreList(p.students), map = {};
      var names = coreRoster(list.map(function (x) { if (x && typeof x === 'object') { var t = coreStr(x.ten).replace(/\s+/g, ' ').trim(); map[t] = x; return t; } return x; }));
      return store.lock(function () {
        var c = cfg();
        c.students[lop] = names;
        c.hsInfo = c.hsInfo || {};
        if (p.withInfo) c.hsInfo[lop] = coreCleanInfo(map, names);
        else if (c.hsInfo[lop]) c.hsInfo[lop] = coreCleanInfo(c.hsInfo[lop], names);
        store.setCfg(c);
        return { lop: lop, students: names, info: c.hsInfo[lop] || {} };
      });
    },

    getSigs: function (p) { auth(p); return store.sigGet((p.ids || []).slice(0, 200).map(coreStr)); },
    setSig: function (p) {
      var u = auth(p), id = coreStr(p.id) || u.id, c = cfg();
      if (!u.admin && id !== u.id) coreErr('Bạn chỉ cập nhật chữ ký của mình.', 'perm');
      if (!coreSigOk(p.sig)) coreErr('Ảnh chữ ký không hợp lệ hoặc quá lớn.', 'bad');
      var a = c.accounts.filter(function (x) { return x.id === id; })[0];
      if (!a && id !== 'admin') coreErr('Không tìm thấy tài khoản.', 'bad');
      return store.lock(function () { store.sigSet(id, a ? a.name : 'Quản trị', coreStr(p.sig)); return true; });
    },

    tkbImport: function (p) {
      admin(p);
      var c = cfg(), from = coreNum(p.fromWeek, 1);
      if (from < 1 || from > c.school.totalWeeks) coreErr('Tuần áp dụng không hợp lệ.', 'bad');
      var byTk = {}, byName = {}, unmatched = {};
      c.accounts.forEach(function (a) { byTk[a.tk] = a; byName[a.name.toLowerCase()] = a; });
      var seen = {}, rows = [];
      (p.rows || []).forEach(function (r) {
        var lop = coreUp(r.lop), thu = coreNum(r.thu, -1), buoi = r.buoi === 'C' ? 'C' : 'S', tiet = coreNum(r.tiet, 0), mon = coreStr(r.mon).trim();
        if (!lop || thu < 0 || thu > 5 || tiet < 1 || tiet > 5 || !mon) return;
        var k = lop + thu + buoi + tiet; if (seen[k]) return; seen[k] = 1;
        var g = coreStr(r.gv).trim(), a = byTk[g.toLowerCase()] || byName[g.toLowerCase()];
        if (g && !a) unmatched[g] = 1;
        rows.push({ from: from, lop: lop, thu: thu, buoi: buoi, tiet: tiet, mon: mon.slice(0, 80), phanMon: coreStr(r.phanMon).trim().slice(0, 80), gvId: a ? a.id : '', gvName: a ? a.name : g.slice(0, 80) });
      });
      if (!rows.length) coreErr('Không có dòng thời khoá biểu hợp lệ.', 'bad');
      var lops = {}; rows.forEach(function (r) { lops[r.lop] = 1; });
      return store.lock(function () {
        store.tkbReplace(from, Object.keys(lops), rows);
        var added = 0;
        if (p.updateAssign) {
          var c2 = cfg();
          rows.forEach(function (r) { var a = c2.accounts.filter(function (x) { return x.id === r.gvId; })[0]; if (a && a.lop.indexOf(r.lop) < 0) { a.lop.push(r.lop); added++; } });
          if (added) store.setCfg(c2);
        }
        return { count: rows.length, lops: Object.keys(lops).length, unmatched: Object.keys(unmatched), added: added };
      });
    },
    tkbVersions: function (p) {
      auth(p);
      var v = {};
      store.tkbRows('').forEach(function (r) { var x = v[r.from] = v[r.from] || { from: r.from, n: 0, lops: {} }; x.n++; x.lops[r.lop] = 1; });
      return Object.keys(v).map(function (k) { return { from: v[k].from, n: v[k].n, lops: Object.keys(v[k].lops).sort() }; }).sort(function (a, b) { return a.from - b.from; });
    },
    tkbExport: function (p) { admin(p); return store.tkbRows(''); },
    tkbDelete: function (p) { admin(p); var f = coreNum(p.fromWeek, 0); return store.lock(function () { store.tkbReplace(f, null, []); return true; }); },

    backupInfo: function (p) { admin(p); var b = store.backupInfo ? store.backupInfo() : { supported: false }; b.rules = cfg().rules.backup; return b; },
    backupNow: function (p) { admin(p); if (!store.backupNow) coreErr('Chế độ dùng thử không có sao lưu tự động. Dùng "Tải file sao lưu".', 'bad'); return store.backupNow('Thủ công'); },

    setConfig: function (p) {
      var u = admin(p);
      return store.lock(function () {
        var c = coreCleanCfg(p.cfg || {}, cfg());
        store.setCfg(c);
        return { cfg: corePublicCfg(c, u) };
      });
    },
    restore: function (p) {
      var u = admin(p);
      return store.lock(function () {
        var c = coreCleanCfg(p.cfg || {}, cfg());
        store.setCfg(c);
        store.replaceAll(p.weeks || [], p.nenep || []);
        if (Array.isArray(p.tkb) && store.tkbReplaceAll) store.tkbReplaceAll(p.tkb);
        return { cfg: corePublicCfg(c, u) };
      });
    }
  };
}
function coreDispatch(store, p) {
  try {
    var acts = coreActions(store);
    var fn = acts[coreStr(p && p.action)];
    if (!fn) coreErr('Thao tác không hợp lệ.', 'bad');
    return { ok: true, data: fn(p || {}) };
  } catch (e) {
    return { ok: false, error: e.message || String(e), code: e.code || '' };
  }
}
/* =================== HẾT LÕI NGHIỆP VỤ =================== */

/* ===================================================================
 * BỘ LƯU GOOGLE SHEETS — mỗi loại dữ liệu một trang tính dễ đọc, sửa tay được
 * =================================================================== */
var TZ = 'Asia/Ho_Chi_Minh';
var SESSION_SECONDS = 21600; // phiên đăng nhập 6 giờ
var SH = {
  CFG: { name: 'CauHinh', head: ['Khoá', 'Giá trị', 'Ý nghĩa'] },
  DM: { name: 'DanhMuc', head: ['Mã', 'Nhóm', 'Nội dung', 'Loại (Trừ/Cộng)', 'Phạm vi (Học sinh/Cả lớp)', 'Kiểu khen (Điểm hồng/Tuyên dương)', 'Điểm học sinh', 'Điểm thi đua lớp', 'Đang dùng (Có/Không)'] },
  TK: { name: 'TaiKhoan', head: ['ID', 'Họ và tên', 'Tài khoản', 'Mật khẩu', 'Môn', 'Lớp giảng dạy', 'Lớp chủ nhiệm', 'Vai trò (GV, BGH, DOAN, XUAT)'] },
  HS: { name: 'HocSinh', head: ['Lớp', 'STT', 'Họ và tên', 'Ngày sinh', 'Họ tên phụ huynh', 'SĐT phụ huynh'] },
  SDB: { name: 'SoDauBai', head: ['Khoá', 'Lớp|Tuần', 'Lớp', 'Tuần', 'Thứ', 'Ngày', 'Buổi', 'Tiết', 'Môn', 'Tiết PPCT', 'Tên bài', 'Vắng', 'HS vi phạm', 'Điểm hồng', 'Tuyên dương', 'Nhận xét giờ dạy', 'Xếp loại', 'GV ký', 'GV ID', 'Thời điểm ký', 'Số lần sửa', 'Lần sửa cuối', 'Vi phạm (JSON)', 'Khen (JSON)', 'Lịch sử sửa (JSON)', 'Phân môn', 'Ký lần đầu', 'Trạng thái', 'Điểm danh (JSON)'] },
  NN: { name: 'NeNep', head: ['ID', 'Ngày', 'Ngày ISO', 'Tuần', 'Tháng', 'Lớp', 'Học sinh', 'Loại', 'Mã', 'Nội dung', 'Điểm học sinh', 'Điểm thi đua lớp', 'Ghi chú', 'Nguồn', 'Người ghi', 'ID người ghi', 'Thời điểm ghi', 'Kiểu khen'] },
  TKB: { name: 'TKB', head: ['Từ tuần', 'Lớp', 'Thứ', 'Buổi', 'Tiết', 'Môn', 'Phân môn', 'ID giáo viên', 'Giáo viên'] },
  CK: { name: 'ChuKy', head: ['ID tài khoản', 'Họ và tên', 'Ảnh chữ ký (mã hoá)', 'Cập nhật'] }
};
var CFG_KEYS = [
  ['ten', 'Tên trường'], ['so', 'Đơn vị chủ quản'], ['diaChi', 'Địa chỉ'], ['hieuTruong', 'Họ tên Hiệu trưởng'], ['biThuDoan', 'Họ tên Bí thư Đoàn trường'],
  ['namHoc', 'Năm học'], ['logo', 'Logo trường (ảnh mã hoá, đổi trong trang web)'], ['startDate', 'Thứ Hai đầu tuần 1 (yyyy-mm-dd, theo vnEdu)'], ['totalWeeks', 'Số tuần trong năm học'],
  ['points', 'Cấu hình điểm (JSON) — sửa trong trang web'], ['rules', 'Quy tắc sổ, cảnh báo, sao lưu (JSON) — sửa trong trang web'], ['classes', 'Lớp thêm riêng (JSON)'], ['adminPass', 'Mật khẩu quản trị']
];
var CFG_CACHE = 'cfg_v4';

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
var HDR_OK_ = {};
function sh_(def) {
  var s = ss_(), sh = s.getSheetByName(def.name);
  var styleHead = function () { sh.getRange(1, 1, 1, def.head.length).setValues([def.head]).setFontWeight('bold').setBackground('#1d3557').setFontColor('#ffffff'); };
  if (!sh) { sh = s.insertSheet(def.name); styleHead(); sh.setFrozenRows(1); HDR_OK_[def.name] = 1; }
  if (!HDR_OK_[def.name]) {
    // Bảng tính từ phiên bản cũ: tự bổ sung các cột mới vào hàng tiêu đề
    var cache = CacheService.getScriptCache();
    if (!cache.get('hdr4_' + def.name)) { if (sh.getLastColumn() < def.head.length) styleHead(); cache.put('hdr4_' + def.name, '1', 21600); }
    HDR_OK_[def.name] = 1;
  }
  return sh;
}
function s_(v) { return v === null || v === undefined ? '' : String(v); }
// Dấu ' giữ nguyên chữ (không bị Sheets đổi thành ngày, số, công thức); khi đọc lại tự mất
function t_(v) { var s = s_(v); return s === '' ? '' : "'" + s; }
function rows_(def) { var sh = sh_(def), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, def.head.length).getValues(); }
function rewrite_(def, rows) {
  var sh = sh_(def), n = sh.getLastRow();
  if (n > 1) sh.getRange(2, 1, n - 1, def.head.length).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, def.head.length).setValues(rows);
}
function find_(def, col, val) {
  var sh = sh_(def), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, col, n - 1, 1).createTextFinder(val).matchEntireCell(true).matchCase(true).findAll().map(function (r) { return r.getRow(); });
}
function jparse_(s, d) { try { var v = JSON.parse(s_(s)); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
function fmtDT_(iso) { return iso ? Utilities.formatDate(new Date(iso), TZ, 'dd/MM/yyyy HH:mm') : ''; }

/* ----- Cấu hình ----- */
function readCfgSheets_() {
  var kv = {};
  rows_(SH.CFG).forEach(function (r) { if (r[0] !== '') kv[s_(r[0])] = r[1]; });
  var hasCfg = Object.keys(kv).length > 0;
  var catalog = rows_(SH.DM).filter(function (r) { return s_(r[2]).trim(); }).map(function (r) {
    var loai = /c[ộo]ng/i.test(s_(r[3])) ? 'cong' : 'tru';
    var phamVi = /l[ớo]p/i.test(s_(r[4])) ? 'lop' : 'hs';
    return { ma: s_(r[0]), nhom: s_(r[1]), ten: s_(r[2]), loai: loai, phamVi: phamVi, kieu: /tuy[êe]n/i.test(s_(r[5])) ? 'td' : (loai === 'cong' && phamVi === 'hs' ? 'dh' : ''),
      diemHS: Number(r[6]) || 0, diemLop: Number(r[7]) || 0, active: !/kh[ôo]ng|^0$|false/i.test(s_(r[8])) };
  });
  var accounts = rows_(SH.TK).filter(function (r) { return s_(r[1]).trim() && s_(r[2]).trim(); }).map(function (r) {
    var tk = s_(r[2]).trim().toLowerCase();
    return { id: s_(r[0]).trim() || ('tk_' + tk), name: s_(r[1]).trim(), tk: tk, mk: s_(r[3]), mon: s_(r[4]).trim(),
      lop: coreList(s_(r[5]).toUpperCase()), cn: s_(r[6]).trim().toUpperCase(), roles: coreList(s_(r[7]).toUpperCase()) };
  });
  var students = {}, info = {};
  rows_(SH.HS).forEach(function (r) {
    var l = s_(r[0]).trim().toUpperCase(), n = s_(r[2]).trim();
    if (!l || !n) return;
    (students[l] = students[l] || []).push(n);
    var ns = r[3] instanceof Date ? Utilities.formatDate(r[3], TZ, 'dd/MM/yyyy') : s_(r[3]);
    if (ns || s_(r[4]) || s_(r[5])) (info[l] = info[l] || {})[n] = { ns: ns, ph: s_(r[4]), sdt: s_(r[5]) };
  });
  var c = coreMergeCfg({
    school: { ten: s_(kv.ten), so: s_(kv.so), diaChi: s_(kv.diaChi), hieuTruong: s_(kv.hieuTruong), biThuDoan: s_(kv.biThuDoan), namHoc: s_(kv.namHoc), startDate: s_(kv.startDate), totalWeeks: Number(kv.totalWeeks) || 35, logo: s_(kv.logo) },
    points: jparse_(kv.points, null) || undefined,
    rules: jparse_(kv.rules, null) || undefined,
    catalog: catalog,
    adminPass: s_(kv.adminPass),
    accounts: accounts,
    classes: jparse_(kv.classes, []),
    students: students,
    hsInfo: info
  });
  var d = coreDefaultCfg();
  ['ten', 'so', 'diaChi', 'namHoc', 'startDate'].forEach(function (k) { if (!c.school[k]) c.school[k] = d.school[k]; });
  c._fresh = !hasCfg;
  return c;
}
function writeCfgSheets_(c) {
  var vals = { ten: c.school.ten, so: c.school.so, diaChi: c.school.diaChi, hieuTruong: c.school.hieuTruong, biThuDoan: c.school.biThuDoan, namHoc: c.school.namHoc, logo: c.school.logo || '',
    startDate: c.school.startDate, totalWeeks: c.school.totalWeeks, points: JSON.stringify(c.points), rules: JSON.stringify(c.rules || {}), classes: JSON.stringify(c.classes || []), adminPass: c.adminPass };
  rewrite_(SH.CFG, CFG_KEYS.map(function (k) { return [k[0], typeof vals[k[0]] === 'number' ? vals[k[0]] : t_(vals[k[0]]), k[1]]; }));
  rewrite_(SH.DM, c.catalog.map(function (it) {
    return [t_(it.ma), t_(it.nhom), t_(it.ten), it.loai === 'cong' ? 'Cộng' : 'Trừ', it.phamVi === 'lop' ? 'Cả lớp' : 'Học sinh',
      it.kieu === 'td' ? 'Tuyên dương' : it.kieu === 'dh' ? 'Điểm hồng' : '', it.diemHS, it.diemLop, it.active ? 'Có' : 'Không'];
  }));
  rewrite_(SH.TK, c.accounts.map(function (a) {
    return [t_(a.id), t_(a.name), t_(a.tk), t_(a.mk), t_(a.mon), t_((a.lop || []).join(', ')), t_(a.cn), t_((a.roles || []).join(', '))];
  }));
  var hs = [], info = c.hsInfo || {};
  Object.keys(c.students).sort().forEach(function (l) {
    c.students[l].forEach(function (n, i) { var x = (info[l] || {})[n] || {}; hs.push([t_(l), i + 1, t_(n), t_(x.ns), t_(x.ph), t_(x.sdt)]); });
  });
  rewrite_(SH.HS, hs);
}

/* ----- Sổ đầu bài ----- */
function slotRow_(c, lop, week, key, e) {
  var d = Number(key.charAt(0)), b = key.charAt(1), t = Number(key.charAt(2));
  var last = coreLastEdit(e);
  var vpTxt = (e.vp || []).map(function (x) { return x.hs + ': ' + x.ten + ' (-' + x.diemHS + ')' + (x.ghiChu ? ' – ' + x.ghiChu : ''); }).join('\n');
  function kt(k) { return (e.cong || []).filter(function (x) { return x.kieu === k; }).map(function (x) { return x.hs + ': ' + x.ten + (x.ghiChu ? ' – ' + x.ghiChu : ''); }).join('\n'); }
  var late = coreIsLate(e, c.rules);
  var status = e.deleted ? 'Đã xoá' + (late ? ' (muộn)' : '') : late ? 'Sửa muộn' : (e.edits || []).length ? 'Đã sửa' : '';
  return [t_(lop + '|' + week + '|' + key), t_(lop + '|' + week), t_(lop), week, t_(CORE_DAYS[d]), t_(coreVN(coreDateOf(c, week, d))), b === 'S' ? 'Sáng' : 'Chiều', t,
    t_(e.mon), t_(e.tietPPCT), t_(e.tenBai), t_(e.vang), t_(vpTxt), t_(kt('dh')), t_(kt('td')), t_(e.nhanXet),
    e.xepLoai ? e.xepLoai + ' - ' + CORE_RATE[e.xepLoai] : '', t_(e.gvName), t_(e.gvId), t_(e.signedAt), (e.edits || []).length,
    t_(last ? (CORE_EDIT_TYPES[last.type] || 'Sửa') + ': ' + last.by + ' – ' + fmtDT_(last.at) : ''), t_(JSON.stringify(e.vp || [])), t_(JSON.stringify(e.cong || [])), t_(JSON.stringify(e.edits || [])),
    t_(e.phanMon), t_(e.firstSignedAt || e.signedAt), t_(status), t_(JSON.stringify(e.vangDs || []))];
}
function rowSlot_(r) {
  var e = { mon: s_(r[8]), phanMon: s_(r[25]), tietPPCT: s_(r[9]), tenBai: s_(r[10]), vang: s_(r[11]), nhanXet: s_(r[15]), xepLoai: s_(r[16]).charAt(0),
    gvName: s_(r[17]), gvId: s_(r[18]), signedAt: s_(r[19]), firstSignedAt: s_(r[26]) || s_(r[19]), vp: jparse_(r[22], []), cong: jparse_(r[23], []), edits: jparse_(r[24], []), vangDs: jparse_(r[28], []) };
  if (/^Đã xoá/.test(s_(r[27]))) e.deleted = true;
  return e;
}
/* ----- Nề nếp ----- */
function nnRow_(r) {
  return [t_(r.id), t_(coreVN(r.ngay)), t_(r.ngay), r.tuan, t_(r.thang), t_(r.lop), t_(r.hs), r.loai === 'cong' ? 'Cộng' : 'Trừ', t_(r.ma), t_(r.ten),
    r.diemHS, r.diemLop, t_(r.ghiChu), t_(r.nguon), t_(r.by), t_(r.byId), t_(r.at), r.kieu === 'td' ? 'Tuyên dương' : r.kieu === 'dh' ? 'Điểm hồng' : ''];
}
function rowNN_(r) {
  return { id: s_(r[0]), ngay: s_(r[2]), tuan: Number(r[3]), thang: s_(r[4]), lop: s_(r[5]), hs: s_(r[6]), loai: /c[ộo]ng/i.test(s_(r[7])) ? 'cong' : 'tru',
    ma: s_(r[8]), ten: s_(r[9]), kieu: /tuy[êe]n/i.test(s_(r[17])) ? 'td' : /h[ồo]ng/i.test(s_(r[17])) ? 'dh' : '', diemHS: Number(r[10]) || 0, diemLop: Number(r[11]) || 0,
    ghiChu: s_(r[12]), nguon: s_(r[13]), by: s_(r[14]), byId: s_(r[15]), at: s_(r[16]) };
}
/* ----- Thời khoá biểu ----- */
function tkbRow_(r) { return [r.from, t_(r.lop), t_(CORE_DAYS[r.thu]), r.buoi === 'C' ? 'Chiều' : 'Sáng', r.tiet, t_(r.mon), t_(r.phanMon), t_(r.gvId), t_(r.gvName)]; }
function rowTkb_(r) {
  var thu = CORE_DAYS.indexOf(s_(r[2]).trim()); if (thu < 0) thu = Number(r[2]) - 2;
  return { from: Number(r[0]) || 0, lop: s_(r[1]).trim().toUpperCase(), thu: thu, buoi: /chi/i.test(s_(r[3])) ? 'C' : 'S', tiet: Number(r[4]) || 0, mon: s_(r[5]), phanMon: s_(r[6]), gvId: s_(r[7]), gvName: s_(r[8]) };
}
function tkbVer_() { return PropertiesService.getScriptProperties().getProperty('tkbVer') || '0'; }
function tkbBump_() { var p = PropertiesService.getScriptProperties(); p.setProperty('tkbVer', String(Number(p.getProperty('tkbVer') || 0) + 1)); }
/* ----- Sao lưu định kỳ vào Google Drive ----- */
function backupFolder_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('backupFolder');
  if (id) { try { var f0 = DriveApp.getFolderById(id); if (!f0.isTrashed()) return f0; } catch (e) { /* thư mục đã bị xoá */ } }
  var f = DriveApp.createFolder('SaoLuu_' + ss_().getName());
  props.setProperty('backupFolder', f.getId());
  return f;
}
function doBackup_(note) {
  var ss = ss_(), folder = backupFolder_(), cfg = SheetStore.getCfg();
  var name = ss.getName() + '_SaoLuu_' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd_HH-mm');
  var file = DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
  file.setDescription('Sao lưu ' + (note || '') + ' lúc ' + Utilities.formatDate(new Date(), TZ, 'dd/MM/yyyy HH:mm'));
  PropertiesService.getScriptProperties().setProperty('lastBackup', new Date().toISOString());
  var files = [], it = folder.getFiles();
  while (it.hasNext()) files.push(it.next());
  files.sort(function (a, b) { return b.getDateCreated() - a.getDateCreated(); });
  files.slice(cfg.rules.backup.keep).forEach(function (f) { f.setTrashed(true); });
  return { name: name, url: file.getUrl(), at: new Date().toISOString() };
}

var SheetStore = {
  getCfg: function () {
    var cache = CacheService.getScriptCache(), raw = cache.get(CFG_CACHE);
    if (raw) return JSON.parse(raw);
    var c = readCfgSheets_();
    try { cache.put(CFG_CACHE, JSON.stringify(c), 300); } catch (e) { /* cấu hình quá lớn để lưu đệm: bỏ qua */ }
    return c;
  },
  setCfg: function (c) { delete c._fresh; writeCfgSheets_(c); SpreadsheetApp.flush(); CacheService.getScriptCache().remove(CFG_CACHE); },
  getWeek: function (lop, week) {
    var sh = sh_(SH.SDB), slots = {};
    find_(SH.SDB, 2, lop + '|' + week).forEach(function (row) {
      var r = sh.getRange(row, 1, 1, SH.SDB.head.length).getValues()[0];
      var key = s_(r[0]).split('|')[2];
      if (key) slots[key] = rowSlot_(r);
    });
    return { lop: lop, week: week, slots: slots };
  },
  putSlot: function (lop, week, key, e) {
    var sh = sh_(SH.SDB), rows = find_(SH.SDB, 1, lop + '|' + week + '|' + key);
    if (!e) { rows.sort(function (a, b) { return b - a; }).forEach(function (r) { sh.deleteRow(r); }); return; }
    var row = slotRow_(this.getCfg(), lop, week, key, e);
    if (rows.length) sh.getRange(rows[0], 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    SpreadsheetApp.flush();
  },
  weeks: function (lops, w1, w2) {
    var docs = {};
    rows_(SH.SDB).forEach(function (r) {
      var k = s_(r[0]).split('|');
      if (k.length !== 3) return;
      var w = Number(k[1]);
      if (lops.indexOf(k[0]) < 0 || w < w1 || w > w2) return;
      var id = k[0] + '|' + w;
      (docs[id] = docs[id] || { lop: k[0], week: w, slots: {} }).slots[k[2]] = rowSlot_(r);
    });
    return Object.keys(docs).map(function (k) { return docs[k]; });
  },
  editedSlots: function (since) {
    var out = [];
    rows_(SH.SDB).forEach(function (r) {
      if (!(Number(r[20]) > 0)) return;
      var k = s_(r[0]).split('|'); if (k.length !== 3) return;
      var e = rowSlot_(r), last = coreLastEdit(e);
      if (last && last.at >= since) out.push({ lop: k[0], week: Number(k[1]), key: k[2], e: e });
    });
    return out;
  },
  nenep: function (w1, w2) { return rows_(SH.NN).map(rowNN_).filter(function (r) { return r.id && r.tuan >= w1 && r.tuan <= w2; }); },
  nenepAdd: function (r) { sh_(SH.NN).appendRow(nnRow_(r)); SpreadsheetApp.flush(); },
  nenepGet: function (id) {
    var rows = find_(SH.NN, 1, id);
    return rows.length ? rowNN_(sh_(SH.NN).getRange(rows[0], 1, 1, SH.NN.head.length).getValues()[0]) : null;
  },
  nenepDel: function (id) { var sh = sh_(SH.NN); find_(SH.NN, 1, id).sort(function (a, b) { return b - a; }).forEach(function (r) { sh.deleteRow(r); }); },
  tkbRows: function (lop) {
    var cache = CacheService.getScriptCache(), key = 'tkb4_' + tkbVer_() + '_' + (lop || '*'), raw = cache.get(key);
    if (raw) return JSON.parse(raw);
    var rows = rows_(SH.TKB).map(rowTkb_).filter(function (r) { return r.from && r.lop && (!lop || r.lop === lop); });
    try { cache.put(key, JSON.stringify(rows), 21600); } catch (e) { /* lớn quá: bỏ qua */ }
    return rows;
  },
  tkbReplace: function (from, lops, rows) {
    var keep = rows_(SH.TKB).map(rowTkb_).filter(function (r) { return r.from && !(r.from === from && (!lops || lops.indexOf(r.lop) >= 0)); });
    var all = keep.concat(rows).sort(function (a, b) { return a.from - b.from || natCmp_(a.lop, b.lop) || a.thu - b.thu || (a.buoi < b.buoi ? 1 : a.buoi > b.buoi ? -1 : 0) || a.tiet - b.tiet; });
    rewrite_(SH.TKB, all.map(tkbRow_));
    SpreadsheetApp.flush(); tkbBump_();
  },
  tkbReplaceAll: function (rows) { rewrite_(SH.TKB, rows.filter(function (r) { return r && r.lop; }).map(tkbRow_)); tkbBump_(); },
  sigGet: function (ids) {
    var cache = CacheService.getScriptCache(), out = {}, miss = [];
    ids.forEach(function (id) { var v = cache.get('sig4_' + id); if (v !== null) { if (v) out[id] = v; } else miss.push(id); });
    if (miss.length) {
      var sh = sh_(SH.CK);
      miss.forEach(function (id) {
        var r = find_(SH.CK, 1, id), v = r.length ? s_(sh.getRange(r[0], 3).getValue()) : '';
        if (v) out[id] = v;
        try { cache.put('sig4_' + id, v, 21600); } catch (e) { /* bỏ qua */ }
      });
    }
    return out;
  },
  sigSet: function (id, name, url) {
    var sh = sh_(SH.CK), r = find_(SH.CK, 1, id), row = [t_(id), t_(name), t_(url), t_(new Date().toISOString())];
    if (r.length) sh.getRange(r[0], 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    SpreadsheetApp.flush();
    CacheService.getScriptCache().remove('sig4_' + id);
  },
  replaceAll: function (weeks, nn) {
    var c = this.getCfg(), rows = [];
    weeks.forEach(function (d) { Object.keys(d.slots || {}).forEach(function (k) { if (d.slots[k] && /^[0-5][SC][1-5]$/.test(k)) rows.push(slotRow_(c, coreUp(d.lop), Number(d.week), k, d.slots[k])); }); });
    rewrite_(SH.SDB, rows);
    rewrite_(SH.NN, nn.filter(function (r) { return r && r.id; }).map(nnRow_));
  },
  backupInfo: function () {
    var props = PropertiesService.getScriptProperties(), out = { supported: true, last: props.getProperty('lastBackup') || '', files: [], trigger: false };
    try {
      out.trigger = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'saoLuuDinhKy'; });
      var id = props.getProperty('backupFolder');
      if (id) {
        var f = DriveApp.getFolderById(id), it = f.getFiles();
        out.folder = f.getUrl();
        while (it.hasNext()) { var x = it.next(); out.files.push({ name: x.getName(), url: x.getUrl(), at: x.getDateCreated().toISOString() }); }
        out.files.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
      }
    } catch (e) { out.needAuth = true; out.error = e.message; }
    return out;
  },
  backupNow: function (note) {
    try { return doBackup_(note); }
    catch (e) { coreErr('Chưa sao lưu được: ' + e.message + ' — Mở Apps Script, chạy hàm caiDatSaoLuu một lần để cấp quyền Google Drive.', 'bad'); }
  },
  sessPut: function (t, s) { CacheService.getScriptCache().put('tok_' + t, JSON.stringify(s), SESSION_SECONDS); },
  sessGet: function (t) { var v = CacheService.getScriptCache().get('tok_' + t); return v ? JSON.parse(v) : null; },
  sessDel: function (t) { CacheService.getScriptCache().remove('tok_' + t); },
  uuid: function () { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''); },
  now: function () { return new Date().toISOString(); },
  lock: function (fn) { var l = LockService.getScriptLock(); l.waitLock(25000); try { return fn(); } finally { l.releaseLock(); } }
};
function natCmp_(a, b) { return String(a).localeCompare(String(b), 'vi', { numeric: true }); }

/* ===== Các hàm chạy trong trình soạn Apps Script ===== */
// 1) Chạy một lần khi cài mới hoặc nâng cấp: tạo / bổ sung các trang tính
function setup() {
  Object.keys(SH).forEach(function (k) { sh_(SH[k]); });
  var c = readCfgSheets_();
  if (c._fresh) { delete c._fresh; writeCfgSheets_(c); }
  CacheService.getScriptCache().remove(CFG_CACHE);
  return 'Đã tạo / cập nhật các trang tính. Mật khẩu quản trị mặc định: admin123';
}
// 2) Chạy một lần để bật sao lưu tự động (cấp quyền Google Drive + tạo lịch chạy hằng ngày lúc 1 giờ sáng)
function caiDatSaoLuu() {
  setup();
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'saoLuuDinhKy') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('saoLuuDinhKy').timeBased().everyDays(1).atHour(1).create();
  var r = doBackup_('Lần đầu');
  return 'Đã bật sao lưu tự động. Bản sao đầu tiên: ' + r.name;
}
// Được gọi tự động mỗi ngày; sao lưu theo chu kỳ quản trị chọn (ngày / tuần / tháng)
function saoLuuDinhKy() {
  var period = SheetStore.getCfg().rules.backup.period;
  if (period === 'off') return;
  var last = Date.parse(PropertiesService.getScriptProperties().getProperty('lastBackup') || 0) || 0;
  var need = { day: 20, week: 6.5 * 24, month: 29 * 24 }[period] * 3600e3;
  if (Date.now() - last >= need) doBackup_('Tự động');
}

/* ----- Điểm vào ứng dụng web ----- */
function doGet() { return ContentService.createTextOutput(JSON.stringify({ ok: true, data: 'Sổ đầu bài điện tử — máy chủ đang chạy (phiên bản ' + CORE_VERSION + ').' })).setMimeType(ContentService.MimeType.JSON); }
function doPost(e) {
  var p = {};
  try { p = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (x) { p = {}; }
  return ContentService.createTextOutput(JSON.stringify(coreDispatch(SheetStore, p))).setMimeType(ContentService.MimeType.JSON);
}
