(function () {
'use strict';
const $ = id => document.getElementById(id);
const STORE = 'documentStudio.customTemplates.v1';
let active = null, selectedField = null, pageIndex = 0, mode = 'edit', sourcePages = [], pdfPageCount = 0;
const native = () => window.NativeTemplate;
const safe = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readTemplates = () => { try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (_) { return []; } };
const writeTemplates = list => localStorage.setItem(STORE, JSON.stringify(list));
const extOf = file => { const name = file.name.toLowerCase(); return name.endsWith('.pdf') || file.type === 'application/pdf' ? 'pdf' : (name.endsWith('.png') || file.type === 'image/png' ? 'png' : (name.endsWith('.webp') || file.type === 'image/webp' ? 'webp' : 'jpg')); };
function dataUrl(file) { return new Promise((resolve,reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); }); }
function assetData(id) { const result = native()?.loadAsset(id); if (!result) throw new Error('Could not read the saved template file.'); return result; }
function showHub() { $('landing').style.display='block'; $('studio').style.display='none'; $('templateHub').hidden = false; $('templateEditor').hidden = true; renderSaved(); }
function renderSaved() {
 const list = readTemplates();
 $('savedTemplates').innerHTML = list.length ? list.map(t => '<article class="saved-template"><h3>'+safe(t.name)+'</h3><p>'+safe(t.pages.length+' page(s) · '+t.fields.length+' fillable field(s)')+'</p><div class="saved-template-actions"><button onclick="TemplateStudio.fill(\''+t.id+'\')">Fill form</button><button onclick="TemplateStudio.edit(\''+t.id+'\')">Edit layout</button><button onclick="TemplateStudio.remove(\''+t.id+'\')">Delete</button></div></article>').join('') : '<p class="template-empty">No custom templates yet. Import a PDF or image to get started.</p>';
}
function pageImage(page) { return page.data || assetData(page.assetId); }
function createPageWrap(page, index, editable) {
 const wrap = document.createElement('div'); wrap.className = 'template-page-wrap';
 const label = document.createElement('p'); label.className = 'template-page-label'; label.textContent = 'Page ' + (index + 1) + (editable ? ' · tap to select' : ''); label.addEventListener('click', () => { if(editable){ pageIndex=index; renderEditor(); } });
 const canvas = document.createElement('div'); canvas.className = 'template-page'; canvas.dataset.page = index;
 const img = new Image();
 img.onload = () => { canvas.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight; };
 img.className='template-source-image'; img.alt=''; img.src = pageImage(page); canvas.appendChild(img);
 const fields = (active.fields || []).filter(f => f.page === index);
 fields.forEach(field => {
   const el = document.createElement('div'); el.className = 'template-field' + (editable && selectedField === field.id ? ' selected' : '');
   el.style.left = field.x+'%'; el.style.top = field.y+'%'; el.style.width = field.w+'%'; el.style.height = field.h+'%';
   const value = document.createElement('span'); value.className = 'template-field-value'; value.textContent = editable ? (field.label || 'Text field') : (field.value || '');
   el.appendChild(value);
   if (editable) {
     el.title = 'Drag to move · bottom-right handle to resize';
     el.addEventListener('pointerdown', event => startMove(event, field, canvas));
     const handle = document.createElement('span'); handle.className = 'resize-handle';
     handle.addEventListener('pointerdown', event => startResize(event, field, canvas));
     el.appendChild(handle);
     el.addEventListener('click', () => selectField(field.id));
   }
   canvas.appendChild(el);
 });
 if (!editable) { const wm=document.createElement('div'); wm.className='template-watermark'; wm.textContent='SAMPLE · NOT OFFICIAL'; canvas.appendChild(wm); }
 wrap.append(label, canvas); return wrap;
}
function renderEditor() {
 const host = $('templatePages'); host.innerHTML = '';
 active.pages.forEach((page, i) => host.appendChild(createPageWrap(page, i, true)));
 $('templatePageStatus').textContent = 'Editing page ' + (pageIndex + 1) + ' of ' + active.pages.length + (pdfPageCount > active.pages.length ? ' · '+(pdfPageCount-active.pages.length)+' more PDF page(s) available' : '');
}
function selectField(id) {
 selectedField = id; const field = active.fields.find(f => f.id === id);
 $('fieldLabel').value = field?.label || ''; $('fieldType').value = field?.type || 'text'; renderEditor();
}
function updateSelected() {
 const f = active?.fields.find(x => x.id === selectedField); if (!f) return;
 f.label = $('fieldLabel').value.trim() || 'Text field'; f.type = $('fieldType').value;
 renderEditor();
}
function pointerPosition(event, canvas) {
 const rect = canvas.getBoundingClientRect();
 return { x: (event.clientX - rect.left) / rect.width * 100, y: (event.clientY - rect.top) / rect.height * 100 };
}
function startMove(event, field, canvas) {
 if (event.target.classList.contains('resize-handle')) return;
 event.preventDefault(); selectField(field.id);
 const start = pointerPosition(event, canvas), ox=field.x, oy=field.y;
 const move = e => { const p=pointerPosition(e,canvas); field.x=Math.max(0,Math.min(100-field.w,ox+p.x-start.x)); field.y=Math.max(0,Math.min(100-field.h,oy+p.y-start.y)); renderEditor(); };
 const stop = () => { window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',stop); };
 window.addEventListener('pointermove',move); window.addEventListener('pointerup',stop,{once:true});
}
function startResize(event, field, canvas) {
 event.preventDefault(); event.stopPropagation();
 const start=pointerPosition(event,canvas), ow=field.w, oh=field.h;
 const move=e=>{const p=pointerPosition(e,canvas);field.w=Math.max(8,Math.min(100-field.x,ow+p.x-start.x));field.h=Math.max(3,Math.min(100-field.y,oh+p.y-start.y));renderEditor();};
 const stop=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);};
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop,{once:true});
}
async function importFile(file) {
 if (!file) return;
 if (file.size > 25*1024*1024) { alert('Choose a file smaller than 25 MB.'); return; }
 const ext=extOf(file);
 if (ext==='pdf' && file.type && file.type!=='application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { alert('Choose a PDF or image file.'); return; }
 if (ext!=='pdf' && !['image/jpeg','image/png','image/webp'].includes(file.type) && !/\\.(jpe?g|png|webp)$/i.test(file.name)) { alert('Use a PDF, JPG, PNG or WebP image.'); return; }
 if (!native()) { alert('PDF/Image import requires the Android app.'); return; }
 try {
   const data=await dataUrl(file); const assetId=native().saveAsset(data,ext);
   if (!assetId) throw new Error('The file could not be stored on this device.');
   let pages=[];
   if (ext==='pdf') {
     pdfPageCount=native().pdfPageCount(assetId);
     if (!pdfPageCount) throw new Error('Could not read this PDF. It may be encrypted or damaged.');
     const first=native().renderPdfPage(assetId,0);
     if (!first) throw new Error('Could not render the first PDF page.');
     const pageId=native().saveAsset(first,'jpg'); if (!pageId) throw new Error('Could not save the PDF preview.');
     pages=[{assetId:pageId}];
   } else { pdfPageCount=1; pages=[{assetId}]; }
   active={id:'tpl-'+Date.now(),name:file.name.replace(/\.[^.]+$/,''),sourceId:assetId,sourceType:ext,pages,fields:[]};
   pageIndex=0;selectedField=null;mode='edit';openEditor();
 } catch (error) { alert(error.message || 'Import failed.'); }
}
function openEditor() {
 $('landing').style.display='none'; $('studio').style.display='none'; $('templateHub').hidden=true; $('templateEditor').hidden=false;
 $('templateModeTitle').textContent=mode==='edit'?'Template layout editor':'Fill template';
 $('templateName').value=active.name;
 $('templateName').disabled=mode!=='edit';
 $('fieldLabel').parentElement.hidden=mode!=='edit'; $('fieldType').parentElement.hidden=mode!=='edit';
 $('templateEditor').classList.toggle('fill-mode',mode==='fill');
 $('templatePages').innerHTML='';
 if (mode==='edit') { renderEditor(); $('templateHelp').textContent='Add a field, select it, then drag it into position. Resize using the green corner handle. For multi-page PDFs, load additional pages one at a time.'; }
 else { renderFillForm(); }
}
function renderFillForm() {
 const host=$('templatePages'); host.innerHTML='';
 const form=document.createElement('div');form.className='template-fill';
 const grid=document.createElement('div');grid.className='template-fill-grid';
 active.fields.forEach(field=>{
   const label=document.createElement('label');label.textContent=field.label||'Text field';
   const input=document.createElement('input');input.type=field.type==='date'?'date':field.type==='number'?'number':'text';input.value=field.value||'';input.addEventListener('input',()=>{field.value=input.value;renderFillPages();});
   label.appendChild(input);grid.appendChild(label);
 });
 const actions=document.createElement('div');actions.className='template-fill-actions';
 const print=document.createElement('button');print.className='template-primary';print.textContent='Print / Save PDF';print.onclick=printFilled;
 const back=document.createElement('button');back.className='template-secondary';back.textContent='Back to templates';back.onclick=showHub;
 actions.append(print,back);form.append(grid,actions);host.appendChild(form);renderFillPages();
}
function renderFillPages() {
 const old=document.querySelectorAll('#templatePages .template-page-wrap');old.forEach(n=>n.remove());
 active.pages.forEach((page,i)=>{
   const wrap=createPageWrap(page,i,false);const canvas=wrap.querySelector('.template-page');
   document.querySelector('#templatePages').appendChild(wrap);
 });
}
function printFilled() {
 document.body.classList.add('template-print-mode');
 if (window.NativePrint?.printDocument) window.NativePrint.printDocument();
 else { window.print(); document.body.classList.remove('template-print-mode'); }
}
function close() { $('templateEditor').hidden=true; $('landing').style.display='block';$('studio').style.display='none';showHub(); }
function save() {
 if (mode!=='edit') return;
 active.name=$('templateName').value.trim()||'Untitled template';
 const list=readTemplates(),index=list.findIndex(t=>t.id===active.id);
 const copy=JSON.parse(JSON.stringify(active)); if(index>=0)list[index]=copy;else list.push(copy);
 try{writeTemplates(list);alert('Template saved on this device. You can fill it again from the template list.');showHub();$('templateEditor').hidden=true;$('landing').style.display='block';}
 catch(_){alert('Could not save template details. Please reduce the number of fields or pages.');}
}
function nextPage() {
 if (active.sourceType!=='pdf') { alert('This is an image template and has one page.'); return; }
 if (active.pages.length>=pdfPageCount) { alert('All pages in this PDF have been loaded.'); return; }
 if (active.pages.length>=10) { alert('This version supports up to 10 pages per template.'); return; }
 try {
   const next=active.pages.length, rendered=native().renderPdfPage(active.sourceId,next);
   if(!rendered)throw new Error('Could not render this PDF page.');
   const id=native().saveAsset(rendered,'jpg');if(!id)throw new Error('Could not save this page.');
   active.pages.push({assetId:id});pageIndex=next;renderEditor();
 } catch(e) { alert(e.message||'Could not load page.'); }
}
function addField() {
 if(mode!=='edit')return;
 const field={id:'f-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),label:'New field',type:'text',page:pageIndex,x:10,y:12,w:34,h:5,value:''};
 active.fields.push(field);selectField(field.id);
}
function removeField() { if(!selectedField)return;active.fields=active.fields.filter(f=>f.id!==selectedField);selectedField=null;$('fieldLabel').value='';renderEditor(); }
function edit(id) { const found=readTemplates().find(t=>t.id===id);if(!found)return;active=found;pdfPageCount=active.sourceType==='pdf'?native().pdfPageCount(active.sourceId):1;pageIndex=0;selectedField=null;mode='edit';openEditor(); }
function fill(id) { const found=readTemplates().find(t=>t.id===id);if(!found)return;active=JSON.parse(JSON.stringify(found));active.fields.forEach(f=>f.value='');pageIndex=0;mode='fill';openEditor(); }
function remove(id) { if(!confirm('Delete this saved template and its local source files?'))return;const list=readTemplates(),item=list.find(t=>t.id===id);if(item&&native()){native().deleteAsset(item.sourceId);item.pages.forEach(p=>native().deleteAsset(p.assetId));}writeTemplates(list.filter(t=>t.id!==id));renderSaved(); }
function chooseFile() { const input=document.createElement('input');input.type='file';input.accept='application/pdf,image/jpeg,image/png,image/webp';input.onchange=()=>importFile(input.files?.[0]);input.click(); }
$('fieldLabel').addEventListener('input',updateSelected);$('fieldType').addEventListener('change',updateSelected);
window.TemplateStudio={chooseFile,addField,save,close,nextPage,removeField,edit,fill,remove};
renderSaved();
})();
