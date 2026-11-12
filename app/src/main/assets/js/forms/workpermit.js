function getWorkPermitForm() {
    return `
        <div class="f-sec">Official Images & Logos</div>
        <div class="fg-row"><div class="fg"><label>Applicant Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div><div class="fg"><label>Authority Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div></div>
        <div class="fg-row"><div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div><div class="fg"><label>QR Code / Seal</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'seal')"></div></div>
        <div class="f-sec">Permit Details</div>
        <div class="fg-row"><div class="fg"><label>Work Permit No</label><input id="wp_num" value="WP-AUS-482-994021"></div><div class="fg"><label>Approval Date</label><input id="wp_date" value="12/11/2026"></div></div>
        <div class="fg-row"><div class="fg"><label>Worker Name</label><input id="wp_name" value="MD OMOR FARUK"></div><div class="fg"><label>Date of Birth</label><input id="wp_dob" value="22/11/2000"></div></div>
        <div class="fg-row"><div class="fg"><label>Passport Number</label><input id="wp_pp" value="A06301514"></div><div class="fg"><label>Nationality</label><input id="wp_nat" value="BANGLADESHI"></div></div>
        <div class="fg"><label>Approved Sponsor</label><input id="wp_emp" value="COSTA GROUP HOLDINGS LTD (ABN 68 151 363 129)"></div>
    `;
}
