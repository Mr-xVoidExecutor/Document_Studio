function getEMedicalForm() {
    return `
        <div class="f-sec">Photo & Clinic Logo</div>
        <div class="fg-row"><div class="fg"><label>Applicant Photo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div><div class="fg"><label>Clinic Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div></div>
        <div class="f-sec">HAP ID & Details</div>
        <div class="fg-row"><div class="fg"><label>HAP ID</label><input id="em_hap" value="58492014"></div><div class="fg"><label>Examination Date</label><input id="em_date" value="05/11/2026"></div></div>
        <div class="fg-row"><div class="fg"><label>Full Name</label><input id="em_name" value="MD OMOR FARUK"></div><div class="fg"><label>Passport Number</label><input id="em_pp" value="A06301514"></div></div>
        <div class="fg"><label>Panel Clinic</label><input id="em_clinic" value="IOM MIGRATION HEALTH ASSESSMENT CENTRE, DHAKA"></div>
    `;
}
