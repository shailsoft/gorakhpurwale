(() => {
  const config = window.gwtdConfig || {};
  const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const money = (value) => `${config.currency || '₹'}${number(value, 0).toFixed(0)}`;

  class TeeDesigner {
    constructor(root) {
      this.root = root;
      this.form = root.closest('form');
      this.preview = root.querySelector('.gwtd-print-area');
      this.textNode = root.querySelector('.gwtd-text');
      this.artwork = root.querySelector('.gwtd-artwork');
      this.output = root.querySelector('.gwtd-design-data');
      this.quote = root.querySelector('.gwtd-quote');
      this.history = [];
      this.drag = null;
      this.state = this.defaults();
      this.setupLibrary();
      this.bind();
      this.render(true);
    }

    defaults() {
      return {surface:'front',text:'Your story',note:'',font:'system',font_size:38,bold:false,color:'#101522',alignment:'center',x:50,y:42,scale:1,rotation:0,artwork_id:'',artwork_name:'',artwork_data:'',template_category:'',low_res_ack:false};
    }

    templateSvg(icon,label,color){return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" rx="80" fill="${color}"/><circle cx="300" cy="235" r="145" fill="none" stroke="white" stroke-width="28"/><text x="300" y="285" text-anchor="middle" font-size="150">${icon}</text><text x="300" y="470" text-anchor="middle" font-family="Arial" font-weight="800" font-size="58" fill="white">${label}</text></svg>`)}`;}

    setupLibrary(){
      const templates=[['Cartoon','★','POP!','#ff6b52'],['Fantasy','◆','DRAGON','#513b72'],['Anime','✦','HERO','#2e5eaa'],['Love','♥','TOGETHER','#d84c6f'],['Birthday','♫','CELEBRATE','#e09224'],['Funny','☺','GOOD VIBES','#268b7b'],['Motivation','▲','KEEP GOING','#243447'],['Gaming','⚡','LEVEL UP','#6a40c9'],['Nature','☘','WILD','#4f7c54'],['Festival','✺','SHINE','#d05b2b'],['Sports','●','MOVE','#226e8b'],['Trending','≈','NOW','#111827']].map((item,index)=>({id:`gw-original-${index+1}`,category:item[0],name:item[2],src:this.templateSvg(item[1],item[2],item[3])}));
      this.templates=templates;
      const heading=this.root.querySelector('.gwtd-heading');
      heading?.insertAdjacentHTML('afterend',`<section class="gwtd-library"><div class="gwtd-library-head"><strong>Design templates</strong><select aria-label="Template category"><option value="All">All categories</option>${[...new Set(templates.map(item=>item.category))].map(category=>`<option>${category}</option>`).join('')}</select></div><div class="gwtd-template-grid"></div></section><label class="gwtd-upload-label">Upload your own image<input class="gwtd-upload" type="file" accept="image/png,image/jpeg,image/webp"><small>Use original or licensed artwork. PNG, JPG or WebP, maximum 10 MB.</small><span class="gwtd-upload-status"></span></label>`);
      this.renderTemplates('All');
      this.root.querySelector('.gwtd-library select')?.addEventListener('change',event=>this.renderTemplates(event.target.value));
      this.root.querySelector('.gwtd-template-grid')?.addEventListener('click',event=>{const button=event.target.closest('[data-template-id]');if(!button)return;const template=this.templates.find(item=>item.id===button.dataset.templateId);if(!template)return;this.pushHistory();this.state.artwork_id=template.id;this.state.artwork_name=template.name;this.state.artwork_data=template.src;this.state.template_category=template.category;this.artwork.hidden=false;this.render();});
    }

    renderTemplates(category){const grid=this.root.querySelector('.gwtd-template-grid');if(!grid)return;grid.innerHTML=this.templates.filter(item=>category==='All'||item.category===category).map(item=>`<button type="button" data-template-id="${item.id}" aria-label="Use ${item.name} template"><img src="${item.src}" alt=""><span>${item.category}</span></button>`).join('');}

    bind() {
      this.root.querySelectorAll('input,select').forEach((field) => {
        if (field.classList.contains('gwtd-design-data') || field.classList.contains('gwtd-upload')) return;
        field.addEventListener('input', () => this.fromControls());
        field.addEventListener('change', () => this.fromControls());
      });
      this.root.querySelector('.gwtd-reset')?.addEventListener('click', () => { this.pushHistory(); this.state = this.defaults(); this.syncControls(); this.render(); });
      this.root.querySelector('.gwtd-undo')?.addEventListener('click', () => { const previous = this.history.pop(); if (previous) { this.state = previous; this.syncControls(); this.render(); } });
      this.root.querySelector('.gwtd-upload')?.addEventListener('change', (event) => this.upload(event.target.files?.[0]));
      this.root.querySelector('.gwtd-low-res input')?.addEventListener('change', (event) => { this.state.low_res_ack = event.target.checked; this.render(); });
      this.preview.addEventListener('pointerdown', (event) => this.startDrag(event));
      this.preview.addEventListener('pointermove', (event) => this.moveDrag(event));
      this.preview.addEventListener('pointerup', () => this.endDrag());
      this.preview.addEventListener('pointercancel', () => this.endDrag());
      this.form?.querySelector('select[name="variation_id"]')?.addEventListener('change', (event) => {
        const size = event.target.selectedOptions[0]?.dataset.size || '';
        const sizeInput = this.form.querySelector('.gwtd-variation-size');
        if (sizeInput) sizeInput.value = size;
        this.render();
      });
      this.form?.addEventListener('submit', (event) => {
        if (!this.state.text.trim() && !this.state.artwork_id) {
          event.preventDefault();
          alert('Add text or approved artwork before adding this tee.');
        }
      });
    }

    fromControls() {
      const prior = JSON.stringify(this.state);
      const surface = this.root.querySelector('input[type=radio]:checked')?.value || 'front';
      this.state = {...this.state,
        surface,
        text:this.root.querySelector('.gwtd-text-input').value.slice(0,80),
        note:this.root.querySelector('.gwtd-note')?.value.slice(0,200) || '',
        font:this.root.querySelector('.gwtd-font').value,
        font_size:number(this.root.querySelector('.gwtd-font-size').value,38),
        bold:this.root.querySelector('.gwtd-bold').checked,
        color:this.root.querySelector('.gwtd-color').value,
        alignment:this.root.querySelector('.gwtd-alignment')?.value || 'center',
        scale:number(this.root.querySelector('.gwtd-scale').value,1),
        rotation:number(this.root.querySelector('.gwtd-rotation').value,0)
      };
      if (prior !== JSON.stringify(this.state)) this.history.push(JSON.parse(prior));
      if (this.history.length > 30) this.history.shift();
      this.render();
    }

    syncControls() {
      const radio = this.root.querySelector(`input[type=radio][value="${this.state.surface}"]`);
      if (radio) radio.checked = true;
      this.root.querySelector('.gwtd-text-input').value = this.state.text;
      this.root.querySelector('.gwtd-font').value = this.state.font;
      this.root.querySelector('.gwtd-font-size').value = this.state.font_size;
      this.root.querySelector('.gwtd-bold').checked = this.state.bold;
      this.root.querySelector('.gwtd-color').value = this.state.color;
      if (this.root.querySelector('.gwtd-alignment')) this.root.querySelector('.gwtd-alignment').value = this.state.alignment;
      if (this.root.querySelector('.gwtd-note')) this.root.querySelector('.gwtd-note').value = this.state.note || '';
      this.root.querySelector('.gwtd-scale').value = this.state.scale;
      this.root.querySelector('.gwtd-rotation').value = this.state.rotation;
    }

    pushHistory() { this.history.push(JSON.parse(JSON.stringify(this.state))); }

    render(initial = false) {
      const fonts = {system:'system-ui, sans-serif',serif:'Georgia, serif',rounded:'Trebuchet MS, sans-serif',mono:'ui-monospace, monospace'};
      const transform = `translate(-50%,-50%) scale(${this.state.scale}) rotate(${this.state.rotation}deg)`;
      this.textNode.textContent = this.state.text;
      Object.assign(this.textNode.style,{left:`${this.state.x}%`,top:`${this.state.y}%`,fontFamily:fonts[this.state.font],fontSize:`${this.state.font_size}px`,fontWeight:this.state.bold?'800':'500',color:this.state.color,textAlign:this.state.alignment,transform});
      Object.assign(this.artwork.style,{left:`${this.state.x}%`,top:`${this.state.y}%`,transform});
      if(this.state.artwork_data){this.artwork.src=this.state.artwork_data;this.artwork.hidden=false;}else this.artwork.hidden=true;
      this.output.value = JSON.stringify(this.state);
      const baseSelect = this.form?.querySelector('select[name="variation_id"] option:checked');
      const base = baseSelect?.dataset.price || this.root.dataset.basePrice || 0;
      const printFee = this.state.surface === 'back' ? number(config.backFee,199) : number(config.frontFee,149);
      const artFee = this.state.artwork_id ? number(config.artworkFee,50) : 0;
      this.quote.textContent = `${money(number(base,0)+printFee+artFee)} total`;
      if (!initial) this.root.dispatchEvent(new CustomEvent('gwtd:change',{detail:this.state}));
    }

    startDrag(event) {
      if (event.button !== undefined && event.button !== 0) return;
      this.preview.setPointerCapture?.(event.pointerId);
      this.pushHistory();
      this.drag = {pointer:event.pointerId};
      this.moveDrag(event);
    }

    moveDrag(event) {
      if (!this.drag || this.drag.pointer !== event.pointerId) return;
      const rect = this.preview.getBoundingClientRect();
      this.state.x = Math.max(10,Math.min(90,((event.clientX-rect.left)/rect.width)*100));
      this.state.y = Math.max(10,Math.min(90,((event.clientY-rect.top)/rect.height)*100));
      this.render();
    }

    endDrag() { this.drag = null; }

    async upload(file) {
      if (!file) return;
      const allowed = ['image/png','image/jpeg','image/webp'];
      const status = this.root.querySelector('.gwtd-upload-status');
      if (!allowed.includes(file.type)) { status.textContent = 'Use a PNG, JPG or WebP image.'; return; }
      if(file.size>10*1024*1024){status.textContent='Image must be under 10 MB.';return;}
      this.pushHistory();
      const reader = new FileReader();
      reader.onload = () => { this.state.artwork_id=`upload-${Date.now()}`;this.state.artwork_name=file.name;this.state.artwork_data=reader.result;this.artwork.src=reader.result;this.artwork.hidden=false;status.textContent=`${file.name} ready`;this.render(); };
      reader.readAsDataURL(file);
      if(!config.uploadEnabled||!config.restUrl)return;
      const data = new FormData();
      data.append('artwork',file);
      this.root.classList.add('is-uploading');
      status.textContent = config.uploading || 'Uploading…';
      try {
        const response = await fetch(config.restUrl,{method:'POST',credentials:'same-origin',headers:{'X-WP-Nonce':config.nonce},body:data});
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || config.uploadError);
        this.state.artwork_id = result.id;
        this.state.artwork_name = result.name;
        this.state.low_res_ack = !result.low_resolution;
        const warning = this.root.querySelector('.gwtd-low-res');
        if (warning) warning.hidden = !result.low_resolution;
        status.textContent = `${result.name} · ${result.width}×${result.height}px`;
        this.render();
      } catch (error) {
        this.artwork.hidden = true;
        status.textContent = error.message || config.uploadError;
      } finally {
        this.root.classList.remove('is-uploading');
      }
    }
  }

  const init = () => document.querySelectorAll('.gwtd').forEach((root) => { if (!root.gwtd) root.gwtd = new TeeDesigner(root); });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
