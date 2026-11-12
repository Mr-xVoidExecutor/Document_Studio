function buildFormForDocument(type) {
    const container = document.getElementById('dynamic-form-container');
    const titleEl = document.getElementById('studio-title');

    if (type === 'subclass482') {
        titleEl.textContent = 'SubClass 482 Application (Form 1296)';
        container.innerHTML = `
            <div class="f-sec">Applicant Photo</div>
            <div class="fg"><label>Passport Photo Upload</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div>

            <div class="f-sec">Part A: Personal & Passport Details</div>
            <div class="fg-row">
                <div class="fg"><label>Family Name</label><input id="f_fname" value="FARUK"></div>
                <div class="fg"><label>Given Names</label><input id="f_gname" value="MD OMOR"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Date of Birth</label><input id="f_dob" value="22/11/2000"></div>
                <div class="fg"><label>Sex</label><select id="f_sex"><option>Male</option><option>Female</option></select></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Town of Birth</label><input id="f_bcity" value="NOAKHALI"></div>
                <div class="fg"><label>Country of Birth</label><input id="f_bcountry" value="BANGLADESH"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Passport Number</label><input id="f_pp" value="A06301514"></div>
                <div class="fg"><label>Nationality</label><input id="f_nat" value="BANGLADESHI"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Passport Issue Date</label><input id="f_pp_iss" value="28/12/2022"></div>
                <div class="fg"><label>Passport Expiry Date</label><input id="f_pp_exp" value="27/12/2032"></div>
            </div>
            <div class="fg"><label>Issuing Authority</label><input id="f_pp_auth" value="DIP/DHAKA"></div>
            <div class="fg"><label>Usual Occupation</label><input id="f_occ" value="EMPLOYED / PRIVATE SERVICE"></div>
            <div class="fg"><label>Intended Employment</label><input id="f_emp" value="SKILLED WORK / GENERAL EMPLOYMENT"></div>
            
            <div class="f-sec">English Proficiency & Address</div>
            <div class="fg-row">
                <div class="fg"><label>English Test</label><select id="f_eng"><option>IELTS</option><option>PTE Academic</option></select></div>
                <div class="fg"><label>Test Date</label><input id="f_eng_date" value="08/11/2026"></div>
            </div>
            <div class="fg"><label>Test Reference Number</label><input id="f_eng_ref" value="24BD0148413MDOMORFARUK"></div>
            <div class="fg"><label>Current Residential Address</label><textarea id="f_addr" rows="2">BAORKOT, WARD NO 02, SONAIMURI, NOAKHALI, BANGLADESH</textarea></div>
            <div class="fg-row">
                <div class="fg"><label>Mobile Number</label><input id="f_mob" value="+880 1613117902"></div>
                <div class="fg"><label>Email Address</label><input id="f_email" value="omor91873@gmail.com"></div>
            </div>

            <div class="f-sec">Part C: Declaration & Signature</div>
            <div class="fg-row">
                <div class="fg"><label>Applicant Signature Name</label><input id="f_sig" value="Md Omor Faruk"></div>
                <div class="fg"><label>Declaration Date</label><input id="f_sdate" value="08/11/2026"></div>
            </div>
        `;
    } else if (type === 'offerLetter') {
        titleEl.textContent = 'Job Offer Letter (RTS / Costa)';
        container.innerHTML = `
            <div class="f-sec">Company Selection & Branding</div>
            <div class="fg">
                <label>Australian Company</label>
                <select id="ol_comp" onchange="renderCurrentDocument()">
                    <option value="RTS Group Australia Pty Ltd">RTS Group Australia Pty Ltd</option>
                    <option value="Costa Group Holdings Ltd">Costa Group Holdings Ltd (Australia)</option>
                </select>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Company Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div>
                <div class="fg"><label>Company Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div>
            </div>
            <div class="f-sec">Offer Details</div>
            <div class="fg-row">
                <div class="fg"><label>Offer Ref No</label><input id="ol_ref" value="AUS/EMP/2026/8841"></div>
                <div class="fg"><label>Issue Date</label><input id="ol_date" value="10/11/2026"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Candidate Name</label><input id="ol_name" value="MD OMOR FARUK"></div>
                <div class="fg"><label>Passport Number</label><input id="ol_pp" value="A06301514"></div>
            </div>
            <div class="fg"><label>Candidate Address</label><input id="ol_addr" value="SONAIMURI, NOAKHALI, BANGLADESH"></div>
            <div class="fg-row">
                <div class="fg"><label>Job Position</label><input id="ol_role" value="SKILLED AGRICULTURAL & PACKING OPERATOR"></div>
                <div class="fg"><label>Work Location</label><input id="ol_loc" value="MELBOURNE, VICTORIA, AUSTRALIA"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Salary Package</label><input id="ol_sal" value="$73,150 AUD / Year"></div>
                <div class="fg"><label>HR Manager</label><input id="ol_hr" value="David Henderson"></div>
            </div>
        `;
    } else if (type === 'workPermit') {
        titleEl.textContent = 'Australian Work Permit';
        container.innerHTML = `
            <div class="f-sec">Official Images & Logos</div>
            <div class="fg-row">
                <div class="fg"><label>Applicant Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div>
                <div class="fg"><label>Authority Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div>
                <div class="fg"><label>QR Code / Seal</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'seal')"></div>
            </div>
            <div class="f-sec">Permit Details</div>
            <div class="fg-row">
                <div class="fg"><label>Work Permit No</label><input id="wp_num" value="WP-AUS-482-994021"></div>
                <div class="fg"><label>Approval Date</label><input id="wp_date" value="12/11/2026"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Worker Name</label><input id="wp_name" value="MD OMOR FARUK"></div>
                <div class="fg"><label>Date of Birth</label><input id="wp_dob" value="22/11/2000"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Passport Number</label><input id="wp_pp" value="A06301514"></div>
                <div class="fg"><label>Nationality</label><input id="wp_nat" value="BANGLADESHI"></div>
            </div>
            <div class="fg"><label>Approved Sponsor</label><input id="wp_emp" value="COSTA GROUP HOLDINGS LTD (ABN 68 151 363 129)"></div>
        `;
    } else if (type === 'visaGrant') {
        titleEl.textContent = 'Australian Visa Grant Notice';
        container.innerHTML = `
            <div class="f-sec">Official Branding</div>
            <div class="fg-row">
                <div class="fg"><label>Gov Crest Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div>
                <div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div>
            </div>
            <div class="f-sec">Grant Information</div>
            <div class="fg-row">
                <div class="fg"><label>Visa Grant Number</label><input id="vg_num" value="2048917364512"></div>
                <div class="fg"><label>Transaction Ref (TRN)</label><input id="vg_trn" value="EGO89K42LP"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Applicant Name</label><input id="vg_name" value="MD OMOR FARUK"></div>
                <div class="fg"><label>Date of Birth</label><input id="vg_dob" value="22 NOVEMBER 2000"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Passport Number</label><input id="vg_pp" value="A06301514"></div>
                <div class="fg"><label>Date of Grant</label><input id="vg_date" value="13 NOVEMBER 2026"></div>
            </div>
            <div class="fg"><label>Sponsoring Employer</label><input id="vg_spon" value="RTS GROUP AUSTRALIA PTY LTD"></div>
        `;
    } else if (type === 'eMedical') {
        titleEl.textContent = 'E-Medical Health Examination';
        container.innerHTML = `
            <div class="f-sec">Photo & Clinic Logo</div>
            <div class="fg-row">
                <div class="fg"><label>Applicant Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div>
                <div class="fg"><label>Clinic Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div>
            </div>
            <div class="f-sec">HAP ID & Details</div>
            <div class="fg-row">
                <div class="fg"><label>HAP ID</label><input id="em_hap" value="58492014"></div>
                <div class="fg"><label>Examination Date</label><input id="em_date" value="05/11/2026"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Full Name</label><input id="em_name" value="MD OMOR FARUK"></div>
                <div class="fg"><label>Passport Number</label><input id="em_pp" value="A06301514"></div>
            </div>
            <div class="fg"><label>Panel Clinic</label><input id="em_clinic" value="IOM MIGRATION HEALTH ASSESSMENT CENTRE, DHAKA"></div>
        `;
    } else if (type === 'policeClearance') {
        titleEl.textContent = 'Bangladesh Police Clearance';
        container.innerHTML = `
            <div class="f-sec">Govt Logo & Seals</div>
            <div class="fg-row">
                <div class="fg"><label>Bangladesh Govt Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div>
                <div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div>
            </div>
            <div class="fg"><label>QR Code / Seal</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'seal')"></div>
            <div class="f-sec">Verification Details</div>
            <div class="fg-row">
                <div class="fg"><label>Reference No</label><input id="pc_ref" value="PCC-2026-8841209"></div>
                <div class="fg"><label>Issue Date</label><input id="pc_date" value="02/11/2026"></div>
            </div>
            <div class="fg"><label>Police Station / District</label><input id="pc_ps" value="SONAIMURI POLICE STATION, DISTRICT: NOAKHALI"></div>
            <div class="fg-row">
                <div class="fg"><label>Applicant Full Name</label><input id="pc_name" value="MD OMOR FARUK"></div>
                <div class="fg"><label>Father's Name</label><input id="pc_father" value="MD ABUL KALAM"></div>
            </div>
            <div class="fg-row">
                <div class="fg"><label>Passport Number</label><input id="pc_pp" value="A06301514"></div>
                <div class="fg"><label>Passport Issue Date</label><input id="pc_pp_date" value="28/12/2022"></div>
            </div>
            <div class="fg"><label>Permanent Address</label><textarea id="pc_addr" rows="2">VILL: BAORKOT, WARD NO-02, P.O: JOYAG-3844, P.S: SONAIMURI, DIST: NOAKHALI, BANGLADESH</textarea></div>
        `;
    }
}
