function getVisaGrantTemplate(val, logoHtml, wmHtml) {
    return `
    <div class="a4-sheet">
        ${wmHtml}
        <div class="sheet-content">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:16px;">
                <div>
                    <div style="font-size:13pt; font-weight:bold;">Australian Government</div>
                    <div style="font-size:10.5pt;">Department of Home Affairs</div>
                </div>
                <div>${logoHtml}</div>
            </div>
            <div style="font-size:13pt; font-weight:bold; margin-bottom:12px;">
                NOTIFICATION OF GRANT OF A TEMPORARY SKILL SHORTAGE (SUBCLASS 482) VISA
            </div>
            <p style="line-height:1.5; margin-bottom:14px; font-size:9.5pt;">
                Dear <b>${val('vg_name')}</b>,<br><br>
                We are pleased to advise that your visa application has been <b>GRANTED</b> on <b>${val('vg_date')}</b>.
            </p>
            <table class="official-table">
                <tr><th>Applicant Name</th><td><b>${val('vg_name')}</b></td></tr>
                <tr><th>Date of Birth</th><td>${val('vg_dob')}</td></tr>
                <tr><th>Passport Number</th><td><b>${val('vg_pp')}</b></td></tr>
                <tr><th>Visa Grant Number</th><td><b>${val('vg_num')}</b></td></tr>
                <tr><th>Transaction Ref (TRN)</th><td>${val('vg_trn')}</td></tr>
                <tr><th>Approved Sponsor</th><td>${val('vg_spon')}</td></tr>
                <tr><th>Travel Facility</th><td>Multiple Entries</td></tr>
            </table>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; font-size:8.5pt; line-height:1.45; margin-top:14px;">
                <b>Important Notice:</b> Your visa is electronically linked to passport <b>${val('vg_pp')}</b>.
            </div>
            <div style="margin-top:30px; font-size:9.5pt;">
                Yours sincerely,<br><br>
                <div class="sig-script">Delegate of the Minister</div>
                <b>Department of Home Affairs, Australian Government</b>
            </div>
        </div>
        <div class="a4-footer"><span>VGN: ${val('vg_num')}</span><span>© COMMONWEALTH OF AUSTRALIA</span><span>Page 1 of 1</span></div>
    </div>`;
}
