(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const state = { pages: [], pageIndex: 0, words: [], selected: -1, worker: null, workerLang: '', addTextMode: false, originalFileName: 'edited-image' };
  const CDN = {
    tesseract: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.5/dist/tesseract.min.js',
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    pdfWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
  };
  function status(message) { $('ocrStatus').textContent = message; }
  function loadScript(src, globalName) {
    if (window[globalName]) return Promise.resolve(window[globalName]);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-ocr-src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window[globalName]), { once: true });
        existing.addEventListener('error', () => reject(new Error('Could not load ' + globalName)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.ocrSrc = src;
      script.onload = () => window[globalName] ? resolve(window[globalName]) : reject(new Error(globalName + ' did not initialize'));
      script.onerror = () => reject(new Error('Could not load ' + globalName + '. Check your internet connection.'));
      document.head.appendChild(script);
    });
  }
  function open() {
    $('landing').style.display = 'none';
    $('studio').style.display = 'none';
    $('ocrEditor').hidden = false;
    $('ocrEditor').scrollTop = 0;
  }
  function close() {
    $('ocrEditor').hidden = true;
    $('landing').style.display = 'block';
    state.addTextMode = false;
  }
  function currentPage() { return state.pages[state.pageIndex]; }
  function fitCanvas(source, maxEdge) {
    const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(source.width * scale));
    canvas.height = Math.max(1, Math.round(source.height * scale));
    canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  function setPages(pages, name) {
    state.pages = pages.map(canvas => ({ base: fitCanvas(canvas, 2200), canvas: fitCanvas(canvas, 2200) }));
    state.pageIndex = 0;
    state.words = [];
    state.selected = -1;
    state.originalFileName = (name || 'edited-image').replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 48) || 'edited-image';
    const select = $('ocrPage');
    select.innerHTML = '';
    state.pages.forEach((page, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = 'Page ' + (index + 1);
      select.appendChild(option);
    });
    select.disabled = state.pages.length < 2;
    showPage();
  }
  function showPage() {
    const page = currentPage();
    if (!page) return;
    const canvas = $('ocrCanvas');
    canvas.width = page.canvas.width;
    canvas.height = page.canvas.height;
    canvas.style.display = 'block';
    $('ocrEmpty').style.display = 'none';
    canvas.getContext('2d').drawImage(page.canvas, 0, 0);
    drawBoxes();
    state.words = [];
    state.selected = -1;
    $('ocrText').value = '';
    $('ocrApply').disabled = true;
    $('ocrDelete').disabled = true;
  }
  async function openFile(file) {
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) { status('File is larger than 30 MB. Please choose a smaller file.'); return; }
    status('Opening ' + file.name + '…');
    try {
      if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
        const pdfjs = await loadScript(CDN.pdf, 'pdfjsLib');
        pdfjs.GlobalWorkerOptions.workerSrc = CDN.pdfWorker;
        const data = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data }).promise;
        if (pdf.numPages > 30) throw new Error('This editor currently supports up to 30 PDF pages per file.');
        const pages = [];
        for (let n = 1; n <= pdf.numPages; n++) {
          status('Rendering PDF page ' + n + ' of ' + pdf.numPages + '…');
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(2, 2200 / Math.max(base.width, base.height));
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          pages.push(canvas);
          page.cleanup();
        }
        setPages(pages, file.name);
      } else if (/^image\/(jpeg|png|webp)$/i.test(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name)) {
        const image = new Image();
        const url = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error('Could not decode this image.'));
          image.src = url;
        });
        const source = document.createElement('canvas');
        source.width = image.naturalWidth;
        source.height = image.naturalHeight;
        source.getContext('2d').drawImage(image, 0, 0);
        URL.revokeObjectURL(url);
        setPages([source], file.name);
      } else {
        throw new Error('Choose a JPG, PNG, WebP or PDF file.');
      }
      status('File ready. Choose “Scan text (OCR)” to detect text.');
    } catch (error) {
      status(error.message || 'Could not open this file.');
    }
  }
  async function ensureWorker() {
    await loadScript(CDN.tesseract, 'Tesseract');
    const language = $('ocrLanguage').value || 'eng+ben';
    if (state.worker && state.workerLang !== language) {
      await state.worker.terminate();
      state.worker = null;
    }
    if (!state.worker) {
      state.worker = await window.Tesseract.createWorker(language, 1, {
        logger: event => {
          if (event.status === 'recognizing text' && event.progress != null) status('Recognizing text… ' + Math.round(event.progress * 100) + '%');
          else if (event.status) status(event.status + '…');
        }
      });
      state.workerLang = language;
    }
    return state.worker;
  }
  function drawBoxes() {
    const page = currentPage();
    if (!page) return;
    const canvas = $('ocrCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(page.canvas, 0, 0);
    state.words.forEach((word, index) => {
      const b = word.targetBox || word.bbox;
      ctx.save();
      ctx.lineWidth = Math.max(2, canvas.width / 700);
      ctx.strokeStyle = index === state.selected ? '#ff7a00' : '#0b9b72';
      ctx.fillStyle = index === state.selected ? '#ff9c0022' : '#10a37f12';
      ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      if (index === state.selected) {
        const handle = Math.max(9, canvas.width / 100);
        ctx.fillStyle = '#ff7a00';
        ctx.fillRect(b.x1 - handle / 2, b.y1 - handle / 2, handle, handle);
      }
      ctx.restore();
    });
  }
  async function scan() {
    if (!currentPage()) { status('Upload an image or PDF first.'); return; }
    $('ocrScan').disabled = true;
    try {
      const worker = await ensureWorker();
      const result = await worker.recognize(currentPage().canvas);
      state.words = (result.data.lines || []).filter(word => word.text && word.bbox && word.confidence > 12).map(word => {
        const box = { x0: word.bbox.x0, y0: word.bbox.y0, x1: word.bbox.x1, y1: word.bbox.y1 };
        return { text: word.text, confidence: word.confidence, bbox: box, targetBox: { ...box } };
      });
      state.selected = -1;
      drawBoxes();
      status(state.words.length ? 'Detected ' + state.words.length + ' text regions. Tap a box to edit it.' : 'No clear text found. Try a sharper image or another language.');
    } catch (error) {
      status(error.message || 'OCR could not complete. Check your connection and try again.');
    } finally {
      $('ocrScan').disabled = false;
    }
  }
  function sampleColors(canvas, box) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const x0 = Math.max(0, Math.floor(box.x0)), y0 = Math.max(0, Math.floor(box.y0));
    const x1 = Math.min(canvas.width, Math.ceil(box.x1)), y1 = Math.min(canvas.height, Math.ceil(box.y1));
    const pad = Math.max(2, Math.round((y1 - y0) * .18));
    const pixels = [];
    const sample = (x, y) => {
      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
      const d = ctx.getImageData(x, y, 1, 1).data;
      pixels.push([d[0], d[1], d[2]]);
    };
    for (let x = x0 - pad; x <= x1 + pad; x += Math.max(1, Math.floor((x1 - x0) / 18))) { for (let k = 1; k <= pad; k++) { sample(x, y0 - k); sample(x, y1 + k); } }
    for (let y = y0; y <= y1; y += Math.max(1, Math.floor((y1 - y0) / 10))) { for (let k = 1; k <= pad; k++) { sample(x0 - k, y); sample(x1 + k, y); } }
    const bg = pixels.length ? pixels.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map(v => Math.round(v / pixels.length)) : [255, 255, 255];
    const inkData = ctx.getImageData(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)).data;
    let ink = [35, 35, 35], best = 765;
    for (let i = 0; i < inkData.length; i += 4) {
      const sum = inkData[i] + inkData[i + 1] + inkData[i + 2];
      if (sum < best && sum < 600) { best = sum; ink = [inkData[i], inkData[i + 1], inkData[i + 2]]; }
    }
    return { background: 'rgb(' + bg.join(',') + ')', color: '#' + ink.map(v => v.toString(16).padStart(2, '0')).join('') };
  }
  function selectWord(index) {
    const word = state.words[index];
    if (!word) return;
    state.selected = index;
    $('ocrText').value = word.text;
    const box = word.targetBox || word.bbox;
    $('ocrFontSize').value = Math.max(6, Math.round((box.y1 - box.y0) * .82));
    $('ocrColor').value = sampleColors(currentPage().canvas, word.bbox || box).color;
    $('ocrApply').disabled = false;
    $('ocrDelete').disabled = false;
    drawBoxes();
  }
  function repairAndDraw(text) {
    const word = state.words[state.selected];
    if (!word) return;
    const page = currentPage(), canvas = page.canvas, ctx = canvas.getContext('2d');
    const source = word.bbox;
    const target = word.targetBox || source;
    const pad = Math.max(2, Math.round((target.y1 - target.y0) * .12));
    const colors = sampleColors(canvas, source || target);
    ctx.save();
    if (source) {
      const x = Math.max(0, Math.floor(source.x0 - pad)), y = Math.max(0, Math.floor(source.y0 - pad));
      const w = Math.min(canvas.width - x, Math.ceil(source.x1 - source.x0 + pad * 2));
      const h = Math.min(canvas.height - y, Math.ceil(source.y1 - source.y0 + pad * 2));
      const repair = $('ocrRepair').value;
      if (repair === 'white') ctx.fillStyle = '#ffffff';
      else if (repair === 'manual') ctx.fillStyle = $('ocrBackground').value || '#ffffff';
      else ctx.fillStyle = colors.background;
      ctx.fillRect(x, y, w, h);
    }
    if (text) {
      const x = Math.max(0, target.x0), y = Math.max(0, target.y0);
      const w = Math.max(5, Math.min(canvas.width - x, target.x1 - target.x0));
      const h = Math.max(6, Math.min(canvas.height - y, target.y1 - target.y0));
      const fontSize = Math.max(6, Math.min(180, Number($('ocrFontSize').value) || h * .8));
      ctx.fillStyle = $('ocrColor').value || colors.color;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = fontSize + 'px "' + $('ocrFont').value.replace(/["\\]/g, '') + '"';
      const measured = ctx.measureText(text).width;
      if (measured > w) ctx.font = Math.max(6, fontSize * w / measured) + 'px "' + $('ocrFont').value.replace(/["\\]/g, '') + '"';
      ctx.fillText(text, x, y + h / 2, w);
    }
    ctx.restore();
    word.text = text;
    word.bbox = { ...target };
    word.targetBox = { ...target };
    drawBoxes();
  }
  function applyText() {
    if (state.selected < 0) return;
    const text = $('ocrText').value;
    repairAndDraw(text);
    status('Text updated. Review the background and positioning before exporting.');
  }
  function deleteText() {
    if (state.selected < 0) return;
    const word = state.words[state.selected];
    repairAndDraw('');
    state.words.splice(state.selected, 1);
    state.selected = -1;
    $('ocrText').value = '';
    $('ocrApply').disabled = true;
    $('ocrDelete').disabled = true;
    drawBoxes();
    status('Selected text region removed. Background repair is an approximation.');
  }
  function resetPage() {
    const page = currentPage();
    if (!page) return;
    page.canvas = fitCanvas(page.base, 2200);
    state.words = [];
    state.selected = -1;
    $('ocrText').value = '';
    $('ocrApply').disabled = true;
    $('ocrDelete').disabled = true;
    drawBoxes();
    status('Page reset to the original upload. Scan again to edit text.');
  }
  let dragState = null;
  function pointerPosition(event) {
    const canvas = $('ocrCanvas'), rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  }
  function startBoxDrag(event) {
    if (state.selected < 0 || state.addTextMode) return;
    const word = state.words[state.selected], box = word && (word.targetBox || word.bbox);
    if (!box) return;
    const point = pointerPosition(event);
    if (point.x < box.x0 || point.x > box.x1 || point.y < box.y0 || point.y > box.y1) return;
    const edge = Math.max(16, $('ocrCanvas').width / 45);
    dragState = { pointerId: event.pointerId, mode: point.x >= box.x1 - edge && point.y >= box.y1 - edge ? 'resize' : 'move', start: point, box: { ...box } };
    $('ocrCanvas').setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  function moveBox(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const point = pointerPosition(event), word = state.words[state.selected];
    if (!word) return;
    const dx = point.x - dragState.start.x, dy = point.y - dragState.start.y;
    const box = { ...dragState.box };
    if (dragState.mode === 'move') {
      const width = box.x1 - box.x0, height = box.y1 - box.y0;
      box.x0 = Math.max(0, Math.min($('ocrCanvas').width - width, box.x0 + dx));
      box.y0 = Math.max(0, Math.min($('ocrCanvas').height - height, box.y0 + dy));
      box.x1 = box.x0 + width; box.y1 = box.y0 + height;
    } else {
      box.x1 = Math.max(box.x0 + 8, Math.min($('ocrCanvas').width, box.x1 + dx));
      box.y1 = Math.max(box.y0 + 8, Math.min($('ocrCanvas').height, box.y1 + dy));
    }
    word.targetBox = box;
    dragState.start = point;
    dragState.box = { ...box };
    drawBoxes();
  }
  function endBoxDrag(event) {
    if (dragState && dragState.pointerId === event.pointerId) dragState = null;
  }
  function canvasClick(event) {
    const canvas = $('ocrCanvas'), rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
    if (state.addTextMode) {
      const value = $('ocrText').value.trim() || window.prompt('Enter text to add:');
      state.addTextMode = false;
      if (!value) return;
      const height = Math.max(18, Number($('ocrFontSize').value) || 24);
      const box = { x0: x, y0: y - height, x1: Math.min(canvas.width, x + 320), y1: y + 5 };
      state.words.push({ text: value, bbox: null, targetBox: box, confidence: 100 });
      state.selected = state.words.length - 1;
      $('ocrText').value = value;
      $('ocrApply').disabled = false;
      $('ocrDelete').disabled = false;
      applyText();
      return;
    }
    const index = state.words.findIndex(word => x >= word.bbox.x0 && x <= word.bbox.x1 && y >= word.bbox.y0 && y <= word.bbox.y1);
    if (index >= 0) selectWord(index);
  }
  function exportData(dataUrl, filename) {
    if (window.NativeTemplate && typeof window.NativeTemplate.beginExport === 'function') {
      const mime = dataUrl.slice(0, dataUrl.indexOf(';'));
      const token = window.NativeTemplate.beginExport(filename, mime.replace('data:', ''));
      if (!token) { status('Could not start the export on this device.'); return; }
      const encoded = dataUrl.slice(dataUrl.indexOf(',') + 1);
      for (let offset = 0; offset < encoded.length; offset += 120000) {
        if (!window.NativeTemplate.appendExport(token, encoded.slice(offset, offset + 120000))) {
          window.NativeTemplate.cancelExport(token);
          status('Export stopped because the file could not be saved.');
          return;
        }
      }
      const saved = window.NativeTemplate.finishExport(token);
      status(saved ? 'Saved to Downloads / Document Studio: ' + saved : 'Could not finish saving this file.');
      return;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    status('Export started: ' + filename);
  }
  function exportImage() {
    const page = currentPage();
    if (!page) { status('Upload a file first.'); return; }
    const canvas = page.canvas;
    exportData(canvas.toDataURL('image/png'), state.originalFileName + '-page-' + (state.pageIndex + 1) + '.png');
  }
  async function exportPdf() {
    if (!state.pages.length) { status('Upload a file first.'); return; }
    try {
      const lib = await loadScript(CDN.jspdf, 'jspdf');
      const JsPDF = lib.jsPDF;
      const first = state.pages[0].canvas;
      const pdf = new JsPDF({ orientation: first.width > first.height ? 'landscape' : 'portrait', unit: 'px', format: [first.width, first.height], compress: true });
      state.pages.forEach((page, index) => {
        if (index) pdf.addPage([page.canvas.width, page.canvas.height], page.canvas.width > page.canvas.height ? 'landscape' : 'portrait');
        pdf.addImage(page.canvas.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, page.canvas.width, page.canvas.height);
      });
      const blob = pdf.output('datauristring');
      exportData(blob, state.originalFileName + '-edited.pdf');
    } catch (error) {
      status(error.message || 'Could not create the PDF.');
    }
  }
  function bind() {
    $('ocrFile').addEventListener('change', event => openFile(event.target.files && event.target.files[0]));
    $('ocrPage').addEventListener('change', event => { state.pageIndex = Number(event.target.value) || 0; state.words = []; showPage(); status('Page ' + (state.pageIndex + 1) + ' ready. Scan to detect text.'); });
    $('ocrScan').addEventListener('click', scan);
    $('ocrApply').addEventListener('click', applyText);
    $('ocrDelete').addEventListener('click', deleteText);
    $('ocrReset').addEventListener('click', resetPage);
    $('ocrAddText').addEventListener('click', () => { state.addTextMode = true; status('Tap the canvas where you want to place the new text.'); });
    $('ocrSaveImage').addEventListener('click', exportImage);
    $('ocrSavePdf').addEventListener('click', exportPdf);
    $('ocrCanvas').addEventListener('click', canvasClick);
    $('ocrCanvas').addEventListener('pointerdown', startBoxDrag);
    $('ocrCanvas').addEventListener('pointermove', moveBox);
    $('ocrCanvas').addEventListener('pointerup', endBoxDrag);
    $('ocrCanvas').addEventListener('pointercancel', endBoxDrag);
  }
  document.addEventListener('DOMContentLoaded', bind);
  window.OCREditor = { open, close };
})();