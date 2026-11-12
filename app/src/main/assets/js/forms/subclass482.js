function getSubclass482Form() {
    return `
        <div class="f-sec">Applicant Photo</div>
        <div class="fg"><label>Passport Photo Upload</label><input type="file" accept="image/*" onchange="handleImageUpload(this, 'photo')"></div>
        <div class="f-sec">Part A: Personal & Passport Details</div>
        <div class="fg-row"><div class="fg"><label>Family Name</label><input id="f_fname" value="FARUK"></div><div class="fg"><label>Given Names</label><input id="f_gname" value="MD OMOR"></div></div>
        <div class="fg-row"><div class="fg"><label>Date of Birth</label><input id="f_dob" value="22/11/2000"></div><div class="fg"><label>Sex</label><select id="f_sex"><option>Male</option><option>Female</option></select></div></div>
        <div class="fg-row"><div class="fg"><label>Town of Birth</label><input id="f_bcity" value="NOAKHALI"></div><div class="fg"><label>Country of Birth</label><input id="f_bcountry" value="BANGLADESH"></div></div>
        <div class="fg-row"><div class="fg"><label>Passport Number</label><input id="f_pp" value="A06301514"></div><div class="fg"><label>Nationality</label><input id="f_nat" value="BANGLADESHI"></div></div>
        <div class="fg-row"><div class="fg"><label>Passport Issue Date</label><input id="f_pp_iss" value="28/12/2022"></div><div class="fg"><label>Passport Expiry Date</label><input id="f_pp_exp" value="27/12/2032"></div></div>
        <div class="fg"><label>Issuing Authority</label><input id="f_pp_auth" value="DIP/DHAKA"></div>
        <div class="fg"><label>Usual Occupation</label><input id="f_occ" value="EMPLOYED / PRIVATE SERVICE"></div>
        <div class="fg"><label>Intended Employment</label><input id="f_emp" value="SKILLED WORK / GENERAL EMPLOYMENT"></div>
        <div class="f-sec">Contact & Signature</div>
        <div class="fg"><label>Residential Address</label><textarea id="f_addr" rows="2">BAORKOT, WARD NO 02, SONAIMURI, NOAKHALI</textarea></div>
        <div class="fg-row"><div class="fg"><label>Mobile</label><input id="f_mob" value="+880 1613117902"></div><div class="fg"><label>Email</label><input id="f_email" value="omor91873@gmail.com"></div></div>
        <div class="fg-row"><div class="fg"><label>Signature Name</label><input id="f_sig" value="Md Omor Faruk"></div><div class="fg"><label>Date</label><input id="f_sdate" value="08/11/2026"></div></div>
    `;
}
