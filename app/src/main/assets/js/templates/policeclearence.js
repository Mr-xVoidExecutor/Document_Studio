function getPoliceClearanceTemplate(val, logoHtml, wmHtml, sealHtml) {
    return `
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
                This is to certify that <b>${val('pc_name')}</b>, Son/Daughter of <b>${val('pc_father')}</b>, residing at <b>${val('pc_addr')}</b>, holder of Bangladeshi Passport No. <b>${val('pc_pp')}</b> issued on <b>${val('pc_pp_date')}</b>, has been thoroughly verified.
            </p>
            <p style="font-size:10.5pt; line-height:1.85; text-align:justify; margin-top:14px;">
                There is <b>nothing adverse</b> recorded against him/her in the criminal records of this police district. He/She bears a good moral character.
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
