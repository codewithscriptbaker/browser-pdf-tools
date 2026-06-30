import { PDFDocument } from "pdf-lib";

export interface AddFormFieldOptions {
  fieldName: string;
  defaultValue?: string;
  pageIndices?: number[];
}

export async function addFormFieldToPdf(
  file: File,
  options: AddFormFieldOptions,
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = pdf.getForm();
  const pages = pdf.getPages();
  const targets = options.pageIndices ?? pages.map((_, i) => i);

  for (const pageIndex of targets) {
    const page = pages[pageIndex];
    const { width, height } = page.getSize();
    const fieldName = `${options.fieldName}_p${pageIndex + 1}`;
    const textField = form.createTextField(fieldName);
    textField.setText(options.defaultValue ?? "");
    textField.addToPage(page, {
      x: 72,
      y: height - 120,
      width: Math.min(width - 144, 400),
      height: 28,
      borderWidth: 1,
    });
  }

  return pdf.save();
}
