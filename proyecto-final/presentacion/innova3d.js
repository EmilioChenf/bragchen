/* InnovaArte 3D — visor de productos personalizados (three.js r128, global THREE).
   INNOVA3D.create(canvas, opciones) -> { set(cambios), spin(bool), dispose() }
   Foto: imageMode 'marcos' (frameShape, frameCount, frameBorder) o 'completa' (cubre todo el producto). */
(function () {
  'use strict';
  var PATTERNS = ['liso', 'rayas', 'puntos', 'ondas', 'confeti', 'cuadros'];

  function shade(hex, amt) {
    var c = parseInt(hex.slice(1), 16), r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt)))); };
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }
  function luminance(hex) {
    var c = parseInt(hex.slice(1), 16);
    return (0.299 * ((c >> 16) & 255) + 0.587 * ((c >> 8) & 255) + 0.114 * (c & 255)) / 255;
  }


  function shapePath(ctx, shape, cx, cy, s) {
    ctx.beginPath();
    var r = s / 2, i;
    if (shape === 'circulo') { ctx.arc(cx, cy, r, 0, Math.PI * 2); }
    else if (shape === 'cuadro' || shape === 'rectangulo') {
      var w = shape === 'cuadro' ? s : s * 0.74, h = s, rr = s * 0.07, x = cx - w / 2, y = cy - h / 2;
      ctx.moveTo(x + rr, y); ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
    } else if (shape === 'triangulo') {
      var tr = s * 0.6; ctx.moveTo(cx, cy - tr);
      ctx.lineTo(cx + tr * Math.cos(Math.PI / 6), cy + tr * 0.5 + s * 0.08); ctx.lineTo(cx - tr * Math.cos(Math.PI / 6), cy + tr * 0.5 + s * 0.08);
    } else if (shape === 'estrella') {
      for (i = 0; i < 10; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.48 : r * 1.06;
        ctx[i ? 'lineTo' : 'moveTo'](cx + rad * Math.cos(a), cy + 0.04 * s + rad * Math.sin(a));
      }
    } else { // corazón
      var top = cy - s * 0.26;
      ctx.moveTo(cx, cy + s * 0.48);
      ctx.bezierCurveTo(cx - s * 0.12, cy + s * 0.36, cx - s * 0.56, cy + s * 0.08, cx - s * 0.52, top);
      ctx.bezierCurveTo(cx - s * 0.48, cy - s * 0.58, cx - s * 0.06, cy - s * 0.58, cx, top + s * 0.02);
      ctx.bezierCurveTo(cx + s * 0.06, cy - s * 0.58, cx + s * 0.48, cy - s * 0.58, cx + s * 0.52, top);
      ctx.bezierCurveTo(cx + s * 0.56, cy + s * 0.08, cx + s * 0.12, cy + s * 0.36, cx, cy + s * 0.48);
    }
    ctx.closePath();
  }
  function coverDraw(ctx, img, x, y, w, h) {
    var r = Math.max(w / img.width, h / img.height), iw = img.width * r, ih = img.height * r;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  }
  function drawFrame(ctx, img, shape, cx, cy, s, border) {
    ctx.save();
    if (border) { ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = s * 0.05; ctx.shadowOffsetY = s * 0.015; }
    shapePath(ctx, shape, cx, cy, s);
    ctx.fillStyle = border || 'rgba(0,0,0,0)'; if (border) ctx.fill();
    ctx.restore();
    ctx.save(); shapePath(ctx, shape, cx, cy, s); ctx.clip();
    coverDraw(ctx, img, cx - s * 0.62, cy - s * 0.62, s * 1.24, s * 1.24);
    ctx.restore();
    if (border) { ctx.save(); shapePath(ctx, shape, cx, cy, s); ctx.lineWidth = Math.max(8, s * 0.045); ctx.strokeStyle = border; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
  }

  function drawDesign(ctx, W, H, st) {
    var base = st.color || '#1d2a6b';
    ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
    var ink = st.patternColor || (luminance(base) > 0.6 ? shade(base, -0.18) : shade(base, 0.22));
    ctx.save(); ctx.fillStyle = ink; ctx.strokeStyle = ink;
    var p = st.pattern || 'liso', i, j;
    if (p === 'rayas') {
      ctx.lineWidth = 34;
      for (i = -H; i < W + H; i += 120) { ctx.beginPath(); ctx.moveTo(i, H); ctx.lineTo(i + H * 0.6, 0); ctx.stroke(); }
    } else if (p === 'puntos') {
      for (j = 40; j < H; j += 90) for (i = (j / 90 % 2) * 45 + 30; i < W; i += 90) { ctx.beginPath(); ctx.arc(i, j, 13, 0, 7); ctx.fill(); }
    } else if (p === 'ondas') {
      ctx.lineWidth = 16;
      for (j = 40; j < H + 60; j += 95) { ctx.beginPath(); for (i = 0; i <= W; i += 16) ctx.lineTo(i, j + Math.sin(i / 70) * 26); ctx.stroke(); }
    } else if (p === 'confeti') {
      var seed = 7, rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      var cols = ['#FFC93C', '#FF6B8B', '#4FD1C5', '#FFFFFF', ink];
      for (i = 0; i < 260; i++) {
        ctx.save(); ctx.translate(rnd() * W, rnd() * H); ctx.rotate(rnd() * 6); ctx.fillStyle = cols[i % cols.length];
        ctx.globalAlpha = 0.85; ctx.fillRect(-14, -5, 28, 10); ctx.restore();
      }
    } else if (p === 'cuadros') {
      ctx.globalAlpha = 0.55;
      for (j = 0; j < H; j += 128) for (i = 0; i < W; i += 128) if (((i + j) / 128) % 2 === 0) ctx.fillRect(i, j, 128, 128);
    }
    ctx.restore();

    // zona de impresión al frente: u = 0.5 -> x = W/2
    var cx = W / 2, hasImg = !!st.image, txt = (st.text || '').trim();
    var txtColor = st.textColor || (luminance(base) > 0.6 ? '#141833' : '#FFFFFF');
    var mode = st.imageMode || 'marcos';
    if (hasImg && mode === 'completa') {
      coverDraw(ctx, st.image, 0, 0, W, H);
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 0, W, H * 0.02);
    } else if (hasImg) {
      var n = Math.max(1, Math.min(8, st.frameCount || 1)), slot = W / n;
      var s = Math.min(txt ? H * 0.52 : H * 0.66, slot * (n === 1 ? 1 : 0.84));
      var fy = txt ? H * 0.39 : H * 0.5;
      for (var k = 0; k < n; k++) {
        var fx = ((0.5 + k / n) % 1) * W;
        [fx, fx - W, fx + W].forEach(function (x) {
          if (x + s < 0 || x - s > W) return;
          drawFrame(ctx, st.image, st.frameShape || 'corazon', x, fy, s, st.frameBorder === undefined ? '#FFFFFF' : st.frameBorder);
        });
      }
    }
    if (txt) {
      var font = st.font || 'Montserrat';
      var wt = font === 'Caveat' ? '700 ' : font === 'DM Serif Display' ? '400 ' : '800 ';
      var size = font === 'Caveat' ? 190 : font === 'DM Serif Display' ? 170 : 140;
      ctx.font = wt + size + 'px "' + font + '", Georgia, system-ui, sans-serif';
      while (ctx.measureText(txt).width > W * 0.36 && size > 50) { size -= 6; ctx.font = wt + size + 'px "' + font + '", Georgia, system-ui, sans-serif'; }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var ty = hasImg && mode !== 'completa' ? H * 0.84 : H * 0.5;
      if (hasImg && mode === 'completa') { ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 24; txtColor = st.textColor || '#FFFFFF'; }
      ctx.fillStyle = txtColor; ctx.fillText(txt, cx, ty); ctx.shadowBlur = 0;
      if (st.subtitle) {
        ctx.font = '600 52px "Montserrat", system-ui, sans-serif';
        ctx.globalAlpha = 0.85; ctx.fillText(st.subtitle, cx, ty + size * 0.62); ctx.globalAlpha = 1;
      }
    }
  }

  function lathe(points, segs) {
    var g = new THREE.LatheGeometry(points.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), segs || 96, Math.PI, Math.PI * 2);
    // v según la altura real (no según el índice del punto) para que el diseño no se deforme
    var pos = g.attributes.position, uv = g.attributes.uv, minY = Infinity, maxY = -Infinity, k;
    for (k = 0; k < pos.count; k++) { minY = Math.min(minY, pos.getY(k)); maxY = Math.max(maxY, pos.getY(k)); }
    for (k = 0; k < pos.count; k++) uv.setY(k, (pos.getY(k) - minY) / ((maxY - minY) || 1));
    uv.needsUpdate = true;
    g.computeVertexNormals(); return g;
  }

  function buildProduct(type, bodyMat, accentMat) {
    var g = new THREE.Group(), m;
    if (type === 'taza') {
      var outer = [[0.001, 0], [0.86, 0], [0.95, 0.06], [1.0, 0.2], [1.0, 1.75], [1.02, 1.82]];
      g.add(new THREE.Mesh(lathe(outer), bodyMat));
      var inner = [[1.02, 1.82], [0.94, 1.8], [0.93, 0.25], [0.001, 0.22]];
      var inMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.35, side: THREE.DoubleSide });
      g.add(new THREE.Mesh(lathe(inner), inMat));
      var handle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.11, 20, 48, Math.PI * 1.15), bodyMat.userData.plain);
      handle.position.set(-0.98, 0.95, 0); handle.rotation.z = Math.PI * 0.42 + Math.PI / 2; handle.rotation.y = 0;
      g.add(handle);
      g.position.y = -0.9; g.scale.setScalar(1.25);
    } else if (type === 'pachon') {
      var prof = [[0.001, 0], [0.72, 0], [0.8, 0.08], [0.82, 0.25], [0.82, 2.35], [0.78, 2.6], [0.6, 2.88], [0.46, 3.02], [0.46, 3.12]];
      g.add(new THREE.Mesh(lathe(prof), bodyMat));
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5, 48), accentMat); m.position.y = 3.36; g.add(m);
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.08, 48), accentMat); m.position.y = 3.64; g.add(m);
      var loop = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 14, 32), accentMat); loop.position.set(0, 3.82, 0); g.add(loop);
      g.position.y = -1.95; g.scale.setScalar(0.98);
    } else { // termo / vaso térmico 20 oz
      var tp = [[0.001, 0], [0.66, 0], [0.72, 0.05], [0.74, 0.18], [0.92, 2.85], [0.94, 2.92]];
      g.add(new THREE.Mesh(lathe(tp), bodyMat));
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.95, 0.26, 64), accentMat); m.position.y = 3.04; g.add(m);
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.97, 0.06, 64), accentMat); m.position.y = 3.2; g.add(m);
      var straw = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.75 }));
      straw.position.set(0.25, 3.6, 0); straw.rotation.z = -0.12; g.add(straw);
      g.position.y = -1.7; g.scale.setScalar(1.02);
    }
    return g;
  }

  function create(canvas, opts) {
    opts = opts || {};
    var st = Object.assign({ product: 'termo', color: '#2E2F80', pattern: 'liso', text: 'Valeria', font: 'Montserrat', image: null, imageMode: 'marcos', frameShape: 'corazon', frameCount: 1, frameBorder: '#FFFFFF' }, opts.state || {});
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.outputEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(opts.fov || 28, 1, 0.1, 100);
    camera.position.set(0, 0.6, opts.distance || 10.5); camera.lookAt(0, 0.1, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8890b0, 0.95));
    var key = new THREE.DirectionalLight(0xffffff, 0.85); key.position.set(4, 6, 7); scene.add(key);
    var rim = new THREE.DirectionalLight(0xbfd0ff, 0.55); rim.position.set(-6, 3, -4); scene.add(rim);
    var fill = new THREE.DirectionalLight(0xffffff, 0.25); fill.position.set(-3, -2, 6); scene.add(fill);

    // sombra suave
    var sc = document.createElement('canvas'); sc.width = sc.height = 128;
    var sx = sc.getContext('2d'), grd = sx.createRadialGradient(64, 64, 4, 64, 64, 62);
    grd.addColorStop(0, 'rgba(10,14,40,0.38)'); grd.addColorStop(1, 'rgba(10,14,40,0)');
    sx.fillStyle = grd; sx.fillRect(0, 0, 128, 128);
    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

    var tc = document.createElement('canvas'); tc.width = 2048; tc.height = 1024;
    var tctx = tc.getContext('2d');
    var tex = new THREE.CanvasTexture(tc);
    if (renderer.capabilities.getMaxAnisotropy) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (tex.encoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    var bodyMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.38, metalness: 0.08 });
    bodyMat.userData.plain = new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.32, metalness: 0.05 });
    var accentMat = new THREE.MeshStandardMaterial({ color: 0x1b1d26, roughness: 0.45, metalness: 0.2 });

    var holder = new THREE.Group(); scene.add(holder);
    var product = null, curType = null;
    function rebuild() {
      if (product) holder.remove(product);
      product = buildProduct(st.product, bodyMat, accentMat); holder.add(product); curType = st.product;
      shadow.position.y = product.position.y - 0.01;
      var mats = { termo: [0.32, 0.25], pachon: [0.28, 0.45], taza: [0.22, 0.02] }[st.product];
      bodyMat.roughness = mats[0]; bodyMat.metalness = mats[1];
    }
    function paint() {
      drawDesign(tctx, tc.width, tc.height, st); tex.needsUpdate = true;
      bodyMat.userData.plain.color.set(st.color);
      accentMat.color.set(luminance(st.color) > 0.75 ? 0x2a2d3a : 0x15161d);
    }
    rebuild(); paint();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint);

    // interacción: arrastrar para girar
    var rotY = opts.startRotation || -0.35, vel = 0, dragging = false, lastX = 0, autoSpin = opts.autoSpin !== false, idle = 0, tilt = 0, tiltT = 0;
    function down(e) { dragging = true; lastX = (e.touches ? e.touches[0] : e).clientX; vel = 0; canvas.style.cursor = 'grabbing'; }
    function move(e) {
      if (!dragging) return; var x = (e.touches ? e.touches[0] : e).clientX;
      var dx = (x - lastX) * 0.01; rotY += dx; vel = dx; lastX = x; idle = 0;
    }
    function up() { dragging = false; canvas.style.cursor = 'grab'; }
    if (opts.interactive !== false) {
      canvas.style.cursor = 'grab'; canvas.style.touchAction = 'pan-y';
      canvas.addEventListener('pointerdown', function (e) { canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); down(e); });
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
      canvas.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { tiltT = 0; } });
      canvas.addEventListener('mousemove', function (e) { var r = canvas.getBoundingClientRect(); tiltT = ((e.clientY - r.top) / r.height - 0.5) * 0.25; });
    }
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
    }
    var raf, last = performance.now(), visible = true, pop = 1;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
    function frame(t) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!visible) return;
      resize();
      if (!dragging) {
        idle += dt; rotY += vel; vel *= 0.94;
        if (autoSpin && !reduce && idle > 1.2) rotY += dt * 0.45;
      }
      tilt += (tiltT - tilt) * 0.06;
      pop += (1 - pop) * 0.12;
      holder.rotation.y = rotY; holder.rotation.x = tilt * 0.4;
      holder.scale.setScalar(pop);
      holder.position.y = reduce ? 0 : Math.sin(t / 1400) * 0.06;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(frame);

    return {
      set: function (ch) {
        var needRebuild = ch.product && ch.product !== curType;
        Object.assign(st, ch);
        if (needRebuild) { rebuild(); pop = 0.82; }
        paint();
      },
      face: function () { rotY = Math.round((rotY) / (Math.PI * 2)) * Math.PI * 2; vel = 0; idle = -2; },
      spin: function (on) { autoSpin = on; },
      state: function () { return st; },
      dispose: function () { cancelAnimationFrame(raf); renderer.dispose(); }
    };
  }

  window.INNOVA3D = { create: create, patterns: PATTERNS, shapePath: shapePath };
})();
