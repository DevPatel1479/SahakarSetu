import os
import win32com.client

def convert_docx_to_pdf(docx_path, pdf_path):
    abs_docx = os.path.abspath(docx_path)
    abs_pdf = os.path.abspath(pdf_path)
    
    print(f"Converting:\n  Source: {abs_docx}\n  Target: {abs_pdf}")
    
    word = win32com.client.DispatchEx("Word.Application")
    word.Visible = False
    word.DisplayAlerts = False
    
    doc = None
    try:
        doc = word.Documents.Open(abs_docx)
        # 17 = wdFormatPDF
        doc.ExportAsFixedFormat(
            OutputFileName=abs_pdf,
            ExportFormat=17,
            OpenAfterExport=False,
            OptimizeFor=0, # 0 = wdExportOptimizeForPrint
            CreateBookmarks=1 # 1 = wdExportCreateHeadingBookmarks
        )
        print("Successfully exported PDF!")
    finally:
        if doc:
            doc.Close(False)
        word.Quit()

if __name__ == "__main__":
    convert_docx_to_pdf(
        "D:/SahakarSetu/report/SahakarSetu_Technical_Architecture_Report.docx",
        "D:/SahakarSetu/report/SahakarSetu_Technical_Architecture_Report.pdf"
    )
