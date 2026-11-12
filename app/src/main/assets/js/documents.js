function renderCurrentDocument() {
    const canvas = document.getElementById('preview-canvas');
    const wmHtml = uploadedImages.watermark ? `<img src="${uploadedImages.watermark}" class="watermark-layer">` : '';
    const logoHtml = uploadedImages.logo ? `<img src="${uploadedImages.logo}" style="max-height:65px; max-width:160px; object-fit:contain;">` : '';
    const photoHtml = uploadedImages.photo ? `<img src="${uploadedImages.photo}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:8pt; color:#666;">PHOTO</span>';
    const sealHtml = uploadedImages.seal ? `<img src="${uploadedImages.seal}" style="max-height:75px; max-width:75px; object-fit:contain;">` : '<div style="width:65px; height:65px; border:1px dashed #666; display:flex; align-items:center; justify-content:center; font-size:7pt;">QR / SEAL</div>';

    // 1. SUBCLASS 482 FORM (FORM 1296)
    if (currentDocType === 'subclass482') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:10px;">
                    <div>
                        <div style="font-size:14pt; font-weight:bold;">Application for a Work Permit</div>
                        <div style="font-size:11pt; font-weight:bold;">Visa Sub Class 482</div>
                        <div style="font-size:7.5pt; margin-top:4px;">Either type (in English) in the fields provided or complete using BLOCK LETTERS.</div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:flex-start;">
                        <div style="text-align:right;"><div style="font-weight:bold; font-size:9pt;">Australian Government</div><div style="font-size:8pt;">Department of Home Affairs</div></div>
                        <div style="width:30mm; height:38mm; border:1px solid #000; display:flex; align-items:center; justify-content:center;">${photoHtml}</div>
                    </div>
                </div>

                <div style="background:#000; color:#fff; font-weight:bold; padding:4px 8px; margin-bottom:8px; font-size:9pt;">Part A - Your Details & Passport Information</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:9pt;">
                    <div>
                        <p style="margin-bottom:6px;"><b>Family Name:</b><br><div class="box-field">${val('f_fname')}</div></p>
                        <p style="margin-bottom:6px;"><b>Given Names:</b><br><div class="box-field">${val('f_gname')}</div></p>
                        <p style="margin-bottom:6px;"><b>Date of Birth:</b><br><div class="box-field">${val('f_dob')}</div></p>
                        <p style="margin-bottom:6px;"><b>Place of Birth:</b><br><div class="box-field">${val('f_bcity')}, ${val('f_bcountry')}</div></p>
                    </div>
                    <div>
                        <p style="margin-bottom:6px;"><b>Passport Number:</b><br><div class="box-field">${val('f_pp')}</div></p>
                        <p style="margin-bottom:6px;"><b>Nationality:</b><br><div class="box-field">${val('f_nat')}</div></p>
                        <p style="margin-bottom:6px;"><b>Issue & Expiry:</b><br><div class="box-field">${val('f_pp_iss')} to ${val('f_pp_exp')}</div></p>
                        <p style="margin-bottom:6px;"><b>Issuing Authority:</b><br><div class="box-field">${val('f_pp_auth')}</div></p>
                    </div>
                </div>

                <div style="margin-top:10px; font-size:9pt;">
                    <p style="margin-bottom:6px;"><b>Usual Occupation:</b> <div class="box-field">${val('f_occ')}</div></p>
                    <p style="margin-bottom:6px;"><b>Intended Employment:</b> <div class="box-field">${val('f_emp')}</div></p>
                    <p style="margin-bottom:6px;"><b>Residential Address:</b> <div class="box-field">${val('f_addr')}</div></p>
                    <div style="display:flex; gap:10px; margin-top:6px;">
                        <div style="flex:1;"><b>Mobile:</b> <div class="box-field">${val('f_mob')}</div></div>
                        <div style="flex:1;"><b>Email:</b> <div class="box-field" style="text-transform:lowercase;">${val('f_email')}</div></div>
                    </div>
                </div>

                <div style="border:1px solid #000; padding:8px; margin-top:12px; font-size:8pt; background:#f8fafc;">
                    <b>Part C - Declaration & Warning:</b> Giving false or misleading information or documents is a serious offence under Australian Migration Legislation. I declare that the information provided on this application form is complete, correct and up-to-date.
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:12px;">
                    <div>
                        <div style="font-size:7.5pt;">Signature of applicant</div>
                        <div style="border:1px solid #000; height:34px; display:flex; align-items:center; justify-content:center;" class="sig-script">${val('f_sig')}</div>
                    </div>
                    <div>
                        <div style="font-size:7.5pt;">Date (Day / Month / Year)</div>
                        <div class="box-field">${val('f_sdate')}</div>
                    </div>
                </div>
            </div>
            <div class="a4-footer"><span>Form 1296 (10/21)</span><span>COMMONWEALTH OF AUSTRALIA, 2026</span><span>Page 1 of 4</span></div>
        </div>`;
    }

    // 2. JOB OFFER LETTER
    else if (currentDocType === 'offerLetter') {
        const comp = val('ol_comp');
        const isCosta = comp.includes('Costa');
        const brandColor = isCosta ? '#15803d' : '#1e3a8a';
        const compAddr = isCosta ? 'Unit 1, 275 Robinsons Road, Ravenhall VIC 3023, Australia' : 'Level 4, 150 Collins Street, Melbourne VIC 3000, Australia';

        canvas.innerHTML = `
        <div class="a4-sheet">
            ${wmHtml}
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid ${brandColor}; padding-bottom:12px; margin-bottom:18px;">
                    <div>
                        <div style="font-size:16pt; font-weight:bold; color:${brandColor};">${comp}</div>
                        <div style="font-size:8.5pt; color:#475569;">${compAddr}</div>
                    </div>
                    <div>${logoHtml}</div>
                </div>

                <div style="display:flex; justify-content:space-between; margin-bottom:16px; font-size:9.5pt;">
                    <div><b>Ref No:</b> ${val('ol_ref')}</div>
                    <div><b>Date:</b> ${val('ol_date')}</div>
                </div>

                <div style="margin-bottom:16px; line-height:1.5; font-size:9.5pt;">
                    <b>To,</b><br>
                    <b>${val('ol_name')}</b><br>
                    Passport No: <b>${val('ol_pp')}</b><br>
                    Address: ${val('ol_addr')}
                </div>

                <div style="font-size:11pt; font-weight:bold; text-decoration:underline; margin-bottom:14px; color:${brandColor};">
                    SUBJECT: FORMAL OFFER OF EMPLOYMENT (SUBCLASS 482 SPONSORSHIP)
                </div>

                <p style="line-height:1.6; margin-bottom:12px; font-size:9.5pt;">
                    Dear <b>${val('ol_name')}</b>,<br><br>
                    We are delighted to offer you full-time employment with <b>${comp}</b> under the Australian Temporary Skill Shortage (Subclass 482) visa program. Your skills and background match our operational requirements in Australia.
                </p>

                <table class="official-table">
                    <tr><th>Position / Role</th><td><b>${val('ol_role')}</b></td></tr>
                    <tr><th>Sponsoring Employer</th><td>${comp}</td></tr>
                    <tr><th>Work Location</th><td>${val('ol_loc')}</td></tr>
                    <tr><th>Remuneration / Salary</th><td><b>${val('ol_sal')}</b> + Superannuation (11.5%)</td></tr>
                    <tr><th>Employment Type</th><td>Full-Time Permanent (38 hours per week)</td></tr>
                </table>

                <p style="line-height:1.55; margin:14px 0; font-size:9.5pt;">
                    This offer is subject to the successful grant of your Subclass 482 visa by the Department of Home Affairs and meeting standard medical and police clearance requirements.
                </p>

                <div style="display:flex; justify-content:space-between; margin-top:40px; font-size:9.5pt;">
                    <div style="width:45%;">
                        <div class="sig-script" style="border-bottom:1px solid #000; padding-bottom:4px;">${val('ol_hr')}</div>
                        <div style="font-size:8.5pt; margin-top:4px;"><b>${val('ol_hr')}</b><br>Head of Human Resources<br>${comp}</div>
                    </div>
                    <div style="width:45%;">
                        <div class="sig-script" style="border-bottom:1px solid #000; padding-bottom:4px;">${val('ol_name')}</div>
                        <div style="font-size:8.5pt; margin-top:4px;"><b>Candidate Acceptance:</b><br>${val('ol_name')}<br>Passport: ${val('ol_pp')}</div>
                    </div>
                </div>
            </div>
            <div class="a4-footer"><span>${comp}</span><span>CONFIDENTIAL OFFER</span><span>Page 1 of 1</span></div>
        </div>`;
    }

    // 3. WORK PERMIT
    else if (currentDocType === 'workPermit') {
        canvas.innerHTML = `
        <div class="a4-sheet" style="border:6px double #1e3a8a; padding:12mm;">
            ${wmHtml}
            <div class="sheet-content">
                <div style="text-align:center; border-bottom:2px solid #1e3a8a; padding-bottom:12px; margin-bottom:16px;">
                    ${logoHtml}
                    <div style="font-size:11pt; font-weight:bold; letter-spacing:1px; margin-top:6px;">COMMONWEALTH OF AUSTRALIA</div>
                    <div style="font-size:15pt; font-weight:bold; color:#1e3a8a; margin-top:2px;">OFFICIAL WORK PERMIT CERTIFICATE</div>
                    <div style="font-size:9pt; color:#475569;">Temporary Skill Shortage (Subclass 482) Authorization</div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <div style="font-size:10pt;"><b>Permit Number:</b> <span style="color:#b91c1c; font-weight:bold;">${val('wp_num')}</span></div>
                        <div style="font-size:10pt; margin-top:4px;"><b>Approval Date:</b> ${val('wp_date')}</div>
                        <div style="font-size:10pt; margin-top:4px;"><b>Status:</b> <span style="background:#dcfce7; color:#166534; padding:2px 8px; font-weight:bold;">VERIFIED & ACTIVE</span></div>
                    </div>
                    <div style="width:32mm; height:40mm; border:1.5px solid #000;">${photoHtml}</div>
                </div>

                <table class="official-table">
                    <tr><th>Full Name of Worker</th><td><b>${val('wp_name')}</b></td></tr>
                    <tr><th>Date of Birth</th><td>${val('wp_dob')}</td></tr>
                    <tr><th>Passport Number</th><td><b>${val('wp_pp')}</b> (${val('wp_nat')})</td></tr>
                    <tr><th>Approved Sponsor</th><td><b>${val('wp_emp')}</b></td></tr>
                    <tr><th>Nominated Visa Class</th><td>Temporary Skill Shortage (Subclass 482)</td></tr>
                    <tr><th>Validity Period</th><td>4 Years (Authorized Employment)</td></tr>
                </table>

                <p style="font-size:9pt; line-height:1.55; margin:16px 0; text-align:justify;">
                    This official certificate confirms that the holder has been granted legal authorization to engage in skilled employment with the approved sponsoring entity within the Commonwealth of Australia pursuant to the Migration Act 1958.
                </p>

                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:35px;">
                    <div>${sealHtml}</div>
                    <div style="text-align:center; width:220px;">
                        <div class="sig-script" style="border-bottom:1px solid #000;">Authorized Delegate</div>
                        <div style="font-size:8.5pt; margin-top:4px;"><b>Department of Home Affairs</b><br>Canberra ACT, Australia</div>
                    </div>
                </div>
            </div>
            <div class="a4-footer"><span>REF: ${val('wp_num')}</span><span>OFFICIAL RECORD</span><span>Page 1 of 1</span></div>
        </div>`;
    }

    // 4. VISA GRANT NOTICE
    else if (currentDocType === 'visaGrant') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            ${wmHtml}
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:16px;">
                    <div>
                        <div style="font-size:13pt; font-weight:bold;">Australian Government</div>
                        <div style="font-size:10.5pt;">Department of Home Affairs</div>
                    </div>
                    <div>${logoHtml}</div>
                </div>

                <div style="font-size:13pt; font-weight:bold; margin-bottom:12px;">
                    NOTIFICATION OF GRANT OF A TEMPORARY SKILL SHORTAGE (SUBCLASS 482) VISA
                </div>

                <p style="line-height:1.5; margin-bottom:14px; font-size:9.5pt;">
                    Dear <b>${val('vg_name')}</b>,<br><br>
                    We are pleased to advise that your visa application has been <b>GRANTED</b> on <b>${val('vg_date')}</b>.
                </p>

                <table class="official-table">
                    <tr><th>Applicant Name</th><td><b>${val('vg_name')}</b></td></tr>
                    <tr><th>Date of Birth</th><td>${val('vg_dob')}</td></tr>
                    <tr><th>Passport Number</th><td><b>${val('vg_pp')}</b></td></tr>
                    <tr><th>Visa Grant Number</th><td><b>${val('vg_num')}</b></td></tr>
                    <tr><th>Transaction Ref (TRN)</th><td>${val('vg_trn')}</td></tr>
                    <tr><th>Approved Sponsor</th><td>${val('vg_spon')}</td></tr>
                    <tr><th>Travel Facility</th><td>Multiple Entries</td></tr>
                </table>

                <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; font-size:8.5pt; line-height:1.45; margin-top:14px;">
                    <b>Important Notice:</b> Your visa is electronically linked to passport <b>${val('vg_pp')}</b>. You must carry this notice when travelling to Australia.
                </div>

                <div style="margin-top:30px; font-size:9.5pt;">
                    Yours sincerely,<br><br>
                    <div class="sig-script">Delegate of the Minister</div>
                    <b>Department of Home Affairs, Australian Government</b>
                </div>
            </div>
            <div class="a4-footer"><span>VGN: ${val('vg_num')}</span><span>© COMMONWEALTH OF AUSTRALIA</span><span>Page 1 of 1</span></div>
        </div>`;
    }

    // 5. E-MEDICAL
    else if (currentDocType === 'eMedical') {
        canvas.innerHTML = `
        <div class="a4-sheet">
            <div class="sheet-content">
                <div style="display:flex; justify-content:space-between; align-items:center; background:#0f172a; color:#fff; padding:12px 16px; margin-bottom:16px;">
                    <div>
                        <div style="font-size:14pt; font-weight:bold;">eMedical - Immigration Health Examination</div>
                        <div style="font-size:8.5pt; color:#cbd5e1;">Australian Department of Home Affairs Assessment</div>
                    </div>
                    <div>${logoHtml}</div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; border:1px solid #000; padding:10px; margin-bottom:16px;">
                    <div>
                        <div style="font-size:9pt; color:#475569;">HEALTH CASE IDENTIFIER (HAP ID)</div>
                        <div style="font-size:18pt; font-weight:bold; letter-spacing:2px;">${val('em_hap')}</div>
                        <div style="font-size:8.5pt; margin-top:4px;"><b>Assessment Date:</b> ${val('em_date')}</div>
                    </div>
                    <div style="width:30mm; height:38mm; border:1px solid #000;">${photoHtml}</div>
                </div>

                <table class="official-table">
                    <tr><th>Client Full Name</th><td><b>${val('em_name')}</b></td></tr>
                    <tr><th>Passport Number</th><td><b>${val('em_pp')}</b></td></tr>
                    <tr><th>Panel Clinic</th><td>${val('em_clinic')}</td></tr>
                    <tr><th>Required Tests</th><td>501 Medical Examination, 502 Chest X-ray</td></tr>
                    <tr><th>Health Clearance Status</th><td><b style="color:#15803d;">HEALTH REQUIREMENT MET - CLEARED</b></td></tr>
                </table>

                <p style="font-size:8.5pt; line-height:1.5; margin-top:14px;">
                    This eMedical certificate confirms that the applicant has successfully completed all required health examinations through an approved panel physician. Results are officially recorded in the immigration health system.
                </p>

                <div style="margin-top:40px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-family:monospace; font-size:13pt; letter-spacing:3px; border:1px solid #000; padding:6px 12px;">*HAP-${val('em_hap')}*</div>
                    <div style="text-align:right;">
                        <div class="sig-script">Panel Physician</div>
                        <div style="font-size:8pt;"><b>Authorized Medical Officer</b></div>
                    </div>
                </div>
            </div>
            <div class="a4-footer"><span>HAP ID: ${val('em_hap')}</span><span>eMedical System Generated</span><span>Page 1 of 1</span></div>
        </div>`;
    }

    // 6. POLICE CLEARANCE CERTIFICATE (BANGLADESH)
    else if (currentDocType === 'policeClearance') {
        canvas.innerHTML = `
        <div class="a4-sheet" style="border:4px double #006a4e; padding:14mm;">
            ${wmHtml}
            <div class="sheet-content">
                <div style="text-align:center; border-bottom:2px solid #006a4e; padding-bottom:10px; margin-bottom:14px;">
                    ${logoHtml}
                    <div style="font-size:12pt; font-weight:bold; color:#006a4e; margin-top:4px;">GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH</div>
                    <div style="font-size:10.5pt; font-weight:bold;">BANGLADESH POLICE</div>
                    <div style="font-size:9pt;">${val('pc_ps')}</div>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:9.5pt; margin-bottom:16px;">
                    <div><b>Ref No:</b> ${val('pc_ref')}</div>
                    <div><b>Date:</b> ${val('pc_date')}</div>
                </div>

                <div style="text-align:center; font-size:13pt; font-weight:bold; text-decoration:underline; margin:16px 0; letter-spacing:1px;">
                    POLICE CLEARANCE CERTIFICATE
                </div>

                <p style="font-size:10pt; line-height:1.85; text-align:justify; margin-top:16px;">
                    This is to certify that <b>${val('pc_name')}</b>, Son/Daughter of <b>${val('pc_father')}</b>, residing at <b>${val('pc_addr')}</b>, holder of Bangladeshi Passport No. <b>${val('pc_pp')}</b> issued on <b>${val('pc_pp_date')}</b>, has been thoroughly verified through police records.
                </p>

                <p style="font-size:10.5pt; line-height:1.85; text-align:justify; margin-top:14px;">
                    There is <b>nothing adverse</b> recorded against him/her in the criminal records of this police district. He/She bears a good moral character and has no objection against travelling abroad.
                </p>

                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:65px;">
                    <div style="text-align:center; width:32%;">
                        <div class="sig-script" style="border-bottom:1px solid #000;">Verified</div>
                        <div style="font-size:8.5pt; margin-top:4px;"><b>Officer-in-Charge</b><br>${val('pc_ps')}</div>
                    </div>
                    <div style="text-align:center;">
                        ${sealHtml}
                        <div style="font-size:7pt; margin-top:2px;">Official Seal</div>
                    </div>
                    <div style="text-align:center; width:34%;">
                        <div class="sig-script" style="border-bottom:1px solid #000;">Countersigned</div>
                        <div style="font-size:8.5pt; margin-top:4px;"><b>Superintendent of Police</b><br>District Police HQ</div>
                    </div>
                </div>
            </div>
            <div class="a4-footer"><span>PCC REF: ${val('pc_ref')}</span><span>BANGLADESH POLICE PORTAL</span><span>Page 1 of 1</span></div>
        </div>`;
    }
}
