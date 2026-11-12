function getWorkPermitTemplate(val, photoHtml, logoHtml, wmHtml, sealHtml) {
    return `
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
                This official certificate confirms that the holder has been granted legal authorization to engage in skilled employment with the approved sponsoring entity within the Commonwealth of Australia.
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
