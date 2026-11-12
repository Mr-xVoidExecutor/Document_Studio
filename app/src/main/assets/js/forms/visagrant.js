function getVisaGrantForm() {
    return `
        <div class="f-sec">Official Branding</div>
        <div class="fg-row"><div class="fg"><label>Gov Crest Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div><div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div></div>
        <div class="f-sec">Grant Information</div>
        <div class="fg-row"><div class="fg"><label>Visa Grant Number</label><input id="vg_num" value="2048917364512"></div><div class="fg"><label>Transaction Ref (TRN)</label><input id="vg_trn" value="EGO89K42LP"></div></div>
        <div class="fg-row"><div class="fg"><label>Applicant Name</label><input id="vg_name" value="MD OMOR FARUK"></div><div class="fg"><label>Date of Birth</label><input id="vg_dob" value="22 NOVEMBER 2000"></div></div>
        <div class="fg-row"><div class="fg"><label>Passport Number</label><input id="vg_pp" value="A06301514"></div><div class="fg"><label>Date of Grant</label><input id="vg_date" value="13 NOVEMBER 2026"></div></div>
        <div class="fg"><label>Sponsoring Employer</label><input id="vg_spon" value="RTS GROUP AUSTRALIA PTY LTD"></div>
    `;
}
