function getOfferLetterForm() {
    return `
        <div class="f-sec">Company Selection & Branding</div>
        <div class="fg"><label>Australian Company</label><select id="ol_comp" onchange="renderCurrentDocument()"><option value="RTS Group Australia Pty Ltd">RTS Group Australia Pty Ltd</option><option value="Costa Group Holdings Ltd">Costa Group Holdings Ltd (Australia)</option></select></div>
        <div class="fg-row"><div class="fg"><label>Company Logo</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'logo')"></div><div class="fg"><label>Watermark</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'watermark')"></div></div>
        <div class="f-sec">Offer Details</div>
        <div class="fg-row"><div class="fg"><label>Offer Ref No</label><input id="ol_ref" value="AUS/EMP/2026/8841"></div><div class="fg"><label>Issue Date</label><input id="ol_date" value="10/11/2026"></div></div>
        <div class="fg-row"><div class="fg"><label>Candidate Name</label><input id="ol_name" value="MD OMOR FARUK"></div><div class="fg"><label>Passport Number</label><input id="ol_pp" value="A06301514"></div></div>
        <div class="fg"><label>Candidate Address</label><input id="ol_addr" value="SONAIMURI, NOAKHALI, BANGLADESH"></div>
        <div class="fg-row"><div class="fg"><label>Job Position</label><input id="ol_role" value="SKILLED AGRICULTURAL & PACKING OPERATOR"></div><div class="fg"><label>Work Location</label><input id="ol_loc" value="MELBOURNE, VICTORIA, AUSTRALIA"></div></div>
        <div class="fg-row"><div class="fg"><label>Salary Package</label><input id="ol_sal" value="$73,150 AUD / Year"></div><div class="fg"><label>HR Manager</label><input id="ol_hr" value="David Henderson"></div></div>
    `;
}
