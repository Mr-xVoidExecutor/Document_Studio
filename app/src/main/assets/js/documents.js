function renderCurrentDocument() {
    const canvas = document.getElementById('preview-canvas');
    const wmHtml = uploadedImages.watermark ? `<img src="${uploadedImages.watermark}" class="watermark-layer">` : '';
    const logoHtml = uploadedImages.logo ? `<img src="${uploadedImages.logo}" style="max-height:60px; max-width:150px; object-fit:contain;">` : '';
    const photoHtml = uploadedImages.photo ? `<img src="${uploadedImages.photo}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:8pt; color:#666;">PHOTO</span>';
    const sealHtml = uploadedImages.seal ? `<img src="${uploadedImages.seal}" style="max-height:70px; max-width:70px; object-fit:contain;">` : '<div style="width:60px; height:60px; border:1px dashed #666; display:flex; align-items:center; justify-content:center; font-size:7pt;">QR/SEAL</div>';

    if (currentDocType === 'subclass482') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:10px;">
                    <div><div style="font-size:14pt; font-weight:bold;">Application for a Work Permit</div><div style="font-size:11pt; font-weight:bold;">Visa Sub Class 482</div></div>
                    <div style="width:30mm; height:38mm; border:1px solid #000; display:flex; align-items:center; justify-content:center;">${photoHtml}</div>
                </div>
                <div style="background:#000; color:#fff; font-weight:bold; padding:4px 8px; margin-bottom:8px;">Part A - Your Details</div>
                <p><b>Family Name:</b> ${val('f_fname')}</p>
                <p><b>Given Names:</b> ${val('f_gname')}</p>
                <p><b>Passport:</b> ${val('f_pp')} (${val('f_nat')})</p>
                <p><b>Address:</b> ${val('f_addr')}</p>
                <p><b>Email:</b> ${val('f_email')} | <b>Mobile:</b> ${val('f_mob')}</p>
                <div style="margin-top:20px;"><b>Signature:</b> <span class="sig-script">${val('f_sig')}</span> (${val('f_sdate')})</div>
            </div>
            <div class="a4-footer"><span>Form 1296</span><span>Australia</span><span>Page 1</span></div>
        </div>`;
    } else if (currentDocType === 'offerLetter') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            ${wmHtml}
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">
                    <div style="font-size:16pt; font-weight:bold; color:#1e3a8a;">${val('ol_comp')}</div><div>${logoHtml}</div>
                </div>
                <h3>JOB OFFER LETTER</h3>
                <p style="margin:15px 0;">Dear <b>${val('ol_name')}</b> (Passport: ${val('ol_pp')}), we are pleased to offer you the position of <b>${val('ol_role')}</b> with an annual package of <b>${val('ol_sal')}</b>.</p>
                <div style="margin-top:40px;"><b>HR Manager</b><br>${val('ol_comp')}</div>
            </div>
            <div class="a4-footer"><span>Offer Letter</span><span>Confidential</span><span>Page 1</span></div>
        </div>`;
    } else if (currentDocType === 'workPermit') {
        canvas.innerHTML = `
        <div class="a4-sheet" style="border:4px double #1e3a8a;">
            ${wmHtml}
            <div class="sheet-content" style="text-align:center;">
                ${logoHtml}
                <h2 style="color:#1e3a8a; margin:10px 0;">AUSTRALIAN WORK PERMIT</h2>
                <div style="width:32mm; height:40mm; border:1px solid #000; margin:15px auto; display:flex; align-items:center; justify-content:center;">${photoHtml}</div>
                <p><b>Permit No:</b> ${val('wp_num')}</p><p><b>Worker Name:</b> ${val('wp_name')}</p><p><b>Approved Employer:</b> ${val('wp_emp')}</p>
                <div style="margin-top:50px; display:flex; justify-content:space-around;"><div>${sealHtml}</div><div><b>Authorized Officer</b><br>Department of Home Affairs</div></div>
            </div>
            <div class="a4-footer"><span>Work Permit</span><span>Official Document</span><span>Page 1</span></div>
        </div>`;
    } else if (currentDocType === 'visaGrant') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            ${wmHtml}
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:10px;">
                    <h3>Australian Government - Visa Grant Notice</h3><div>${logoHtml}</div>
                </div>
                <h3 style="margin:15px 0;">Subclass 482 Visa Granted</h3>
                <p><b>Applicant Name:</b> ${val('vg_name')}</p><p><b>Passport:</b> ${val('vg_pp')}</p><p><b>Visa Grant Number:</b> ${val('vg_num')}</p><p><b>Sponsor:</b> ${val('vg_spon')}</p>
                <div style="margin-top:30px;">Department of Home Affairs</div>
            </div>
            <div class="a4-footer"><span>Visa Grant</span><span>Australia</span><span>Page 1</span></div>
        </div>`;
    } else if (currentDocType === 'eMedical') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            <div class="sheet-content">
                <div style="background:#0f172a; color:#fff; padding:10px; margin-bottom:15px;">eMedical Health Examination Assessment</div>
                <div style="display:flex; justify-content:space-between;">
                    <div><h3>HAP ID: ${val('em_hap')}</h3><p><b>Name:</b> ${val('em_name')}</p></div>
                    <div style="width:30mm; height:38mm; border:1px solid #000; display:flex; align-items:center; justify-content:center;">${photoHtml}</div>
                </div>
                <p style="margin-top:20px; color:#15803d; font-weight:bold;">Status: HEALTH REQUIREMENT MET - CLEARED</p>
            </div>
            <div class="a4-footer"><span>eMedical</span><span>Health Stream</span><span>Page 1</span></div>
        </div>`;
    } else if (currentDocType === 'policeClearance') {
        canvas.innerHTML = `
        <div class="a4-sheet" style="border:4px double #006a4e;">
            ${wmHtml}
            <div class="sheet-content" style="text-align:center;">
                ${logoHtml}
                <h3 style="color:#006a4e; margin-top:5px;">BANGLADESH POLICE</h3><p>Police Clearance Certificate</p><hr style="margin:10px 0;">
                <p style="text-align:left; margin-top:15px;"><b>Reference No:</b> ${val('pc_ref')}</p>
                <p style="text-align:left;">This is to certify that <b>${val('pc_name')}</b>, Father: <b>${val('pc_father')}</b> has no adverse record.</p>
                <div style="margin-top:60px; display:flex; justify-content:space-between; align-items:flex-end;">
                    <div><b>Officer-in-Charge</b><br>Bangladesh Police</div><div>${sealHtml}</div><div><b>Superintendent of Police</b><br>District Police</div>
                </div>
            </div>
            <div class="a4-footer"><span>Police Clearance</span><span>Bangladesh</span><span>Page 1</span></div>
        </div>`;
    }
}
