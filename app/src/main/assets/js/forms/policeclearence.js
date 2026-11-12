function getPoliceClearanceForm() {
    return `
        <div class="f-sec">Govt Logo & Seals</div>
        <div class="fg-row"><div class="fg"><label>Bangladesh Govt Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div><div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div></div>
        <div class="fg"><label>QR Code / Seal</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'seal')"></div>
        <div class="f-sec">Verification Details</div>
        <div class="fg-row"><div class="fg"><label>Reference No</label><input id="pc_ref" value="PCC-2026-8841209"></div><div class="fg"><label>Issue Date</label><input id="pc_date" value="02/11/2026"></div></div>
        <div class="fg"><label>Police Station / District</label><input id="pc_ps" value="SONAIMURI POLICE STATION, DISTRICT: NOAKHALI"></div>
        <div class="fg-row"><div class="fg"><label>Applicant Full Name</label><input id="pc_name" value="MD OMOR FARUK"></div><div class="fg"><label>Father's Name</label><input id="pc_father" value="MD ABUL KALAM"></div></div>
        <div class="fg-row"><div class="fg"><label>Passport Number</label><input id="pc_pp" value="A06301514"></div><div class="fg"><label>Passport Issue Date</label><input id="pc_pp_date" value="28/12/2022"></div></div>
        <div class="fg"><label>Permanent Address</label><textarea id="pc_addr" rows="2">VILL: BAORKOT, WARD NO-02, P.O: JOYAG-3844, P.S: SONAIMURI, DIST: NOAKHALI, BANGLADESH</textarea></div>
    `;
}
