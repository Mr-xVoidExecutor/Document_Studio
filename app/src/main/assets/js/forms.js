function buildFormForDocument(type) {
    const container = document.getElementById('dynamic-form-container');
    const titleEl = document.getElementById('studio-title');

    if (type === 'subclass482') {
        titleEl.textContent = 'SubClass 482 Application';
        container.innerHTML = `
            <div class="f-sec">Media & Photo</div>
            <div class="fg"><label>Applicant Passport Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div>
            <div class="f-sec">Part A: Personal Details</div>
            <div class="fg-row"><div class="fg"><label>Family Name</label><input id="f_fname" value="FARUK"></div><div class="fg"><label>Given Names</label><input id="f_gname" value="MD OMOR"></div></div>
            <div class="fg-row"><div class="fg"><label>Passport Number</label><input id="f_pp" value="A06301514"></div><div class="fg"><label>Nationality</label><input id="f_nat" value="BANGLADESHI"></div></div>
            <div class="fg"><label>Residential Address</label><textarea id="f_addr" rows="2">BAORKOT, WARD NO 02, SONAIMURI, NOAKHALI</textarea></div>
            <div class="fg-row"><div class="fg"><label>Mobile</label><input id="f_mob" value="+880 1613117902"></div><div class="fg"><label>Email</label><input id="f_email" value="omor91873@gmail.com"></div></div>
            <div class="fg-row"><div class="fg"><label>Signature</label><input id="f_sig" value="Md Omor Faruk"></div><div class="fg"><label>Date</label><input id="f_sdate" value="08/11/2026"></div></div>
        `;
    } else if (type === 'offerLetter') {
        titleEl.textContent = 'Job Offer Letter';
        container.innerHTML = `
            <div class="f-sec">Company Details</div>
            <div class="fg"><label>Company</label><select id="ol_comp" onchange="renderCurrentDocument()"><option>RTS Group Australia Pty Ltd</option><option>Costa Group Holdings Ltd</option></select></div>
            <div class="fg-row"><div class="fg"><label>Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div><div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div></div>
            <div class="fg-row"><div class="fg"><label>Candidate Name</label><input id="ol_name" value="MD OMOR FARUK"></div><div class="fg"><label>Passport</label><input id="ol_pp" value="A06301514"></div></div>
            <div class="fg-row"><div class="fg"><label>Role</label><input id="ol_role" value="OPERATOR"></div><div class="fg"><label>Salary</label><input id="ol_sal" value="$73,150 AUD"></div></div>
        `;
    } else if (type === 'workPermit') {
        titleEl.textContent = 'Work Permit';
        container.innerHTML = `
            <div class="f-sec">Permit Info</div>
            <div class="fg-row"><div class="fg"><label>Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div><div class="fg"><label>Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div></div>
            <div class="fg-row"><div class="fg"><label>Permit No</label><input id="wp_num" value="WP-482-994021"></div><div class="fg"><label>Worker Name</label><input id="wp_name" value="MD OMOR FARUK"></div></div>
            <div class="fg"><label>Employer</label><input id="wp_emp" value="COSTA GROUP HOLDINGS LTD"></div>
        `;
    } else if (type === 'visaGrant') {
        titleEl.textContent = 'Visa Grant Notice';
        container.innerHTML = `
            <div class="f-sec">Grant Info</div>
            <div class="fg"><label>Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div>
            <div class="fg-row"><div class="fg"><label>Grant Number</label><input id="vg_num" value="2048917364512"></div><div class="fg"><label>Applicant Name</label><input id="vg_name" value="MD OMOR FARUK"></div></div>
            <div class="fg-row"><div class="fg"><label>Passport</label><input id="vg_pp" value="A06301514"></div><div class="fg"><label>Sponsor</label><input id="vg_spon" value="RTS GROUP AUSTRALIA"></div></div>
        `;
    } else if (type === 'eMedical') {
        titleEl.textContent = 'E-Medical';
        container.innerHTML = `
            <div class="f-sec">Medical Info</div>
            <div class="fg-row"><div class="fg"><label>Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div><div class="fg"><label>Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div></div>
            <div class="fg-row"><div class="fg"><label>HAP ID</label><input id="em_hap" value="58492014"></div><div class="fg"><label>Full Name</label><input id="em_name" value="MD OMOR FARUK"></div></div>
        `;
    } else if (type === 'policeClearance') {
        titleEl.textContent = 'Police Clearance';
        container.innerHTML = `
            <div class="f-sec">PCC Info</div>
            <div class="fg-row"><div class="fg"><label>Govt Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div><div class="fg"><label>Seal/QR</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'seal')"></div></div>
            <div class="fg-row"><div class="fg"><label>Reference No</label><input id="pc_ref" value="PCC-2026-8841209"></div><div class="fg"><label>Applicant Name</label><input id="pc_name" value="MD OMOR FARUK"></div></div>
            <div class="fg"><label>Father's Name</label><input id="pc_father" value="MD ABUL KALAM"></div>
        `;
    }
}
