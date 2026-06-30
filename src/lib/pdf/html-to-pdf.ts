import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function htmlToPdf(html: string): Promise<Blob> {
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-10000px;top:0;width:794px;padding:48px;background:#ffffff;color:#111827;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.6;";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
    const pdf = new jsPDF({
      orientation,
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    return pdf.output("blob");
  } finally {
    document.body.removeChild(container);
  }
}
