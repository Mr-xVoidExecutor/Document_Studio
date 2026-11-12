function getEMedicalTemplate(val, photoHtml, logoHtml) {
    return `
    <div class="a4-sheet">
        <div class="sheet-content">
            <div style="display:flex; justify-content:space-between; align-items:center; background:#0f172a; color:#fff; padding:12px 16px; margin-bottom:16px;">
                <div>
                    <div style="font-size:14pt; font-weight:bold;">eMedical - Immigration Health Examination</div>
                    <div style="font-size:8.5pt; color:#cbd5e1;">Australian Department of Home Affairs Assessment</div>
                </div>
                <div>${logoHtml}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border:1px solid #000; padding:10px; margin-bottom:16px;">
                <div>
                    <div style="font-size:9pt; color:#475569;">HEALTH CASE IDENTIFIER (HAP ID)</div>
                    <div style="font-size:18pt; font-weight:bold; letter-spacing:2px;">${val('em_hap')}</div>
                    <div style="font-size:8.5pt; margin-top:4px;"><b>Assessment Date:</b> ${val('em_date')}</div>
                </div>
                <div style="width:30mm; height:38mm; border:1px solid #000;">${photoHtml}</div>
            </div>
            <table class="official-table">
                <tr><th>Client Full Name</th><td><b>${val('em_name')}</b></td></tr>
                <tr><th>Passport Number</th><td><b>${val('em_pp')}</b></td></tr>
                <tr><th>Panel Clinic</th><td>${val('em_clinic')}</td></tr>
                <tr><th>Required Tests</th><td>501 Medical Examination, 502 Chest X-ray</td></tr>
                <tr><th>Health Clearance Status</th><td><b style="color:#15803d;">HEALTH REQUIREMENT MET - CLEARED</b></td></tr>
            </table>
            <p style="font-size:8.5pt; line-height:1.5; margin-top:14px;">
                This eMedical certificate confirms that the applicant has successfully completed all required health examinations through an approved panel physician.
            </p>
            <div style="margin-top:40px; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-family:monospace; font-size:13pt; letter-spacing:3px; border:1px solid #000; padding:6px 12px;">*HAP-${val('em_hap')}*</div>
                <div style="text-align:right;">
                    <div class="sig-script">Panel Physician</div>
                    <div style="font-size:8pt;"><b>Authorized Medical Officer</b></div>
                </div>
            </div>
        </div>
        <div class="a4-footer"><span>HAP ID: ${val('em_hap')}</span><span>eMedical System Generated</span><span>Page 1 of 1</span></div>
    </div>`;
}
