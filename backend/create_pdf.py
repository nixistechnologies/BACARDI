from fpdf import FPDF
pdf = FPDF("P","in","A4")

pdf.add_page()
# pdf.set_margins(left:50,)
pdf.set_font('Arial', 'B', 16)