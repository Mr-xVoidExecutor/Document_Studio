function getOfferLetterTemplate(val, logoHtml, wmHtml) {
    const comp = val('ol_comp');
    const isCosta = comp.includes('Costa');
    const brandColor = isCosta ? '#15803d' : '#1e3a8a';
    const compAddr = isCosta ? 'Unit 1, 275 Robinsons Road, Ravenhall VIC 3023, Australia' : 'Level 4, 150 Collins Street, Melbourne VIC 3000, Australia';

    return `
    <div class="a4-sheet">
        ${wmHtml}
        <div class="sheet-content">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid ${brandColor}; padding-bottom:12px; margin-bottom:18px;">
                <div>
                    <div style="font-size:16pt; font-weight:bold; color:${brandColor};">${comp}</div>
                    <div style="font-size:8.5pt; color:#475569;">${compAddr}</div>
                </div>
                <div>${logoHtml}</div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:16px; font-size:9.5pt;">
                <div><b>Ref No:</b> ${val('ol_ref')}</div>
                <div><b>Date:</b> ${val('ol_date')}</div>
            </div>
            <div style="margin-bottom:16px; line-height:1.5; font-size:9.5pt;">
                <b>To,</b><br><b>${val('ol_name')}</b><br>Passport No: <b>${val('ol_pp')}</b><br>Address: ${val('ol_addr')}
            </div>
            <div style="font-size:11pt; font-weight:bold; text-decoration:underline; margin-bottom:14px; color:${brandColor};">
                SUBJECT: FORMAL OFFER OF EMPLOYMENT (SUBCLASS 482 SPONSORSHIP)
            </div>
            <p style="line-height:1.6; margin-bottom:12px; font-size:9.5pt;">
                Dear <b>${val('ol_name')}</b>,<br><br>
                We are delighted to offer you full-time employment with <b>${comp}</b> under the Australian Temporary Skill Shortage (Subclass 482) visa program.
            </p>
            <table class="official-table">
                <tr><th>Position / Role</th><td><b>${val('ol_role')}</b></td></tr>
                <tr><th>Sponsoring Employer</th><td>${comp}</td></tr>
                <tr><th>Work Location</th><td>${val('ol_loc')}</td></tr>
                <tr><th>Remuneration / Salary</th><td><b>${val('ol_sal')}</b> + Superannuation (11.5%)</td></tr>
                <tr><th>Employment Type</th><td>Full-Time Permanent (38 hours per week)</td></tr>
            </table>
            <div style="display:flex; justify-content:space-between; margin-top:40px; font-size:9.5pt;">
                <div style="width:45%;">
                    <div class="sig-script" style="border-bottom:1px solid #000; padding-bottom:4px;">${val('ol_hr')}</div>
                    <div style="font-size:8.5pt; margin-top:4px;"><b>${val('ol_hr')}</b><br>Head of HR<br>${comp}</div>
                </div>
                <div style="width:45%;">
                    <div class="sig-script" style="border-bottom:1px solid #000; padding-bottom:4px;">${val('ol_name')}</div>
                    <div style="font-size:8.5pt; margin-top:4px;"><b>Candidate Acceptance:</b><br>${val('ol_name')}</div>
                </div>
            </div>
        </div>
        <div class="a4-footer"><span>${comp}</span><span>CONFIDENTIAL OFFER</span><span>Page 1 of 1</span></div>
    </div>`;
}
