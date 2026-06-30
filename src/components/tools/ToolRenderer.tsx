import type { ToolSlug } from "@/lib/tools";
import { getTool } from "@/lib/tools";
import { ToolTracker } from "@/components/analytics/ToolTracker";
import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { CompressPdfTool } from "@/components/tools/compress/CompressPdfTool";
import { ExcelToPdfTool } from "@/components/tools/convert/ExcelToPdfTool";
import { HtmlToPdfTool } from "@/components/tools/convert/HtmlToPdfTool";
import { JpgToPdfTool } from "@/components/tools/convert/JpgToPdfTool";
import { PdfToExcelTool } from "@/components/tools/convert/PdfToExcelTool";
import { PdfToJpgTool } from "@/components/tools/convert/PdfToJpgTool";
import { PdfToPdfaTool } from "@/components/tools/convert/PdfToPdfaTool";
import { PdfToPowerpointTool } from "@/components/tools/convert/PdfToPowerpointTool";
import { PdfToWordTool } from "@/components/tools/convert/PdfToWordTool";
import { PowerpointToPdfTool } from "@/components/tools/convert/PowerpointToPdfTool";
import { WordToPdfTool } from "@/components/tools/convert/WordToPdfTool";
import { CropPdfTool } from "@/components/tools/edit/CropPdfTool";
import { EditPdfTool } from "@/components/tools/edit/EditPdfTool";
import { PageNumbersTool } from "@/components/tools/edit/PageNumbersTool";
import { PdfFormsTool } from "@/components/tools/edit/PdfFormsTool";
import { RedactPdfTool } from "@/components/tools/edit/RedactPdfTool";
import { SignPdfTool } from "@/components/tools/edit/SignPdfTool";
import { WatermarkPdfTool } from "@/components/tools/edit/WatermarkPdfTool";
import { AiSummarizerTool } from "@/components/tools/intelligence/AiSummarizerTool";
import { ComparePdfTool } from "@/components/tools/intelligence/ComparePdfTool";
import { OcrPdfTool } from "@/components/tools/intelligence/OcrPdfTool";
import { ScanToPdfTool } from "@/components/tools/intelligence/ScanToPdfTool";
import { TranslatePdfTool } from "@/components/tools/intelligence/TranslatePdfTool";
import { MergePdfTool } from "@/components/tools/merge/MergePdfTool";
import { OrganizePdfTool } from "@/components/tools/organize/OrganizePdfTool";
import { RepairPdfTool } from "@/components/tools/optimize/RepairPdfTool";
import { RotatePdfTool } from "@/components/tools/rotate/RotatePdfTool";
import { ProtectPdfTool } from "@/components/tools/security/ProtectPdfTool";
import { UnlockPdfTool } from "@/components/tools/security/UnlockPdfTool";
import { SplitPdfTool } from "@/components/tools/split/SplitPdfTool";

const LIVE_COMPONENTS: Record<ToolSlug, React.ComponentType> = {
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  "compress-pdf": CompressPdfTool,
  "pdf-to-word": PdfToWordTool,
  "pdf-to-powerpoint": PdfToPowerpointTool,
  "pdf-to-excel": PdfToExcelTool,
  "word-to-pdf": WordToPdfTool,
  "powerpoint-to-pdf": PowerpointToPdfTool,
  "excel-to-pdf": ExcelToPdfTool,
  "edit-pdf": EditPdfTool,
  "pdf-to-jpg": PdfToJpgTool,
  "jpg-to-pdf": JpgToPdfTool,
  "sign-pdf": SignPdfTool,
  "watermark-pdf": WatermarkPdfTool,
  "rotate-pdf": RotatePdfTool,
  "html-to-pdf": HtmlToPdfTool,
  "unlock-pdf": UnlockPdfTool,
  "protect-pdf": ProtectPdfTool,
  "organize-pdf": OrganizePdfTool,
  "pdf-to-pdfa": PdfToPdfaTool,
  "repair-pdf": RepairPdfTool,
  "page-numbers": PageNumbersTool,
  "scan-to-pdf": ScanToPdfTool,
  "ocr-pdf": OcrPdfTool,
  "compare-pdf": ComparePdfTool,
  "redact-pdf": RedactPdfTool,
  "crop-pdf": CropPdfTool,
  "pdf-forms": PdfFormsTool,
  "ai-summarizer": AiSummarizerTool,
  "translate-pdf": TranslatePdfTool,
};

interface ToolRendererProps {
  slug: ToolSlug;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  const tool = getTool(slug);
  if (!tool) return null;

  const Component = LIVE_COMPONENTS[slug];
  if (!Component) {
    return <ComingSoonTool slug={slug} />;
  }

  return (
    <ToolTracker slug={slug}>
      <Component />
    </ToolTracker>
  );
}
