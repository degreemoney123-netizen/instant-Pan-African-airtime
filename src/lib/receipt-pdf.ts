export interface ReceiptPdfData {
  orderId: string;
  recipient: string;
  item: string;
  amount: string;
  country: string;
  date: string;
  reference?: string;
}

const esc = (s: string) => s.replace(/([\\()])/g, "\\$1").replace(/[^\x20-\x7E]/g, "");

/** Builds a minimal single-page PDF document (no external dependency). */
function buildPdf(lines: { text: string; size: number }[]): Blob {
  let y = 780;
  let content = "";
  for (const line of lines) {
    y -= line.size + 10;
    content += `BT /F1 ${line.size} Tf 56 ${y} Td (${esc(line.text)}) Tj ET\n`;
  }

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${off.toString().padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadReceiptPdf(data: ReceiptPdfData): void {
  const rows: { text: string; size: number }[] = [
    { text: "FastData Africa", size: 22 },
    { text: "Digital Order Receipt", size: 14 },
    { text: "", size: 6 },
    { text: `Order ID:   ${data.orderId}`, size: 12 },
    { text: `Recipient:  ${data.recipient}`, size: 12 },
    { text: `Package:    ${data.item}`, size: 12 },
    { text: `Amount:     ${data.amount}`, size: 12 },
    { text: `Country:    ${data.country}`, size: 12 },
    { text: `Date:       ${data.date}`, size: 12 },
  ];
  if (data.reference) rows.push({ text: `Reference:  ${data.reference}`, size: 12 });
  rows.push({ text: "", size: 6 });
  rows.push({ text: "Support: +233 503660497 | support@fastdataafrica.com", size: 10 });
  rows.push({ text: "Thank you for choosing FastData Africa.", size: 10 });

  const url = URL.createObjectURL(buildPdf(rows));
  const a = document.createElement("a");
  a.href = url;
  a.download = `FastData-Receipt-${data.orderId || "order"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
