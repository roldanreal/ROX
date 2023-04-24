package edu.up.cas.sp.util;

import java.awt.Desktop;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.itextpdf.text.Anchor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import edu.up.cas.sp.model.Payment;
import edu.up.cas.sp.model.PaymentType;
import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.Transaction;

public class PDFUtil {
	public static void createPDF(HttpServletRequest request, String storeDetails,
			Receipt receipt, String username, String totalItems, String vatableSale, String vat,
			List<PaymentType> paymentTypeList) throws IOException {
    	Document document = new Document(PageSize.A4, 50, 50, 50, 50);
    	
    	try {
    		List<Transaction> transactionList = receipt.getTransactions();
    		List<Payment> paymentList = receipt.getPayments();
    		
    		Paragraph receiptAndDate = new Paragraph();
    		
    		//Set default Timezone to Philippines
    		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Manila"));
    		 
    		//Receipt and date and time
    		PdfPTable receiptAndTimeTable = new PdfPTable(2);
    		receiptAndTimeTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
    		
    		PdfPCell cell = new PdfPCell(new Phrase("Official Receipt Number:"));
    		cell.setHorizontalAlignment(Element.ALIGN_LEFT);
    		cell.setBorder(Rectangle.NO_BORDER);
    		receiptAndTimeTable.addCell(cell);
    		
    		cell = new PdfPCell(new Phrase(String.valueOf(receipt.getReceiptId())));
    		cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
    		cell.setBorder(Rectangle.NO_BORDER);
    		receiptAndTimeTable.addCell(cell);
    		
    		cell = new PdfPCell(new Phrase("Date and time:"));
    		cell.setHorizontalAlignment(Element.ALIGN_LEFT);
    		cell.setBorder(Rectangle.NO_BORDER);
    		receiptAndTimeTable.addCell(cell);
    		
    		cell = new PdfPCell(new Phrase(String.valueOf(new Date())));
    		cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
    		cell.setBorder(Rectangle.NO_BORDER);
    		receiptAndTimeTable.addCell(cell);
    		
    		receiptAndDate.add(receiptAndTimeTable);
    		
    		Paragraph tableContainer = new Paragraph();
    		
    		//Transaction details
    		PdfPTable table = new PdfPTable(4);
    		table.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
    		table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
    		Font tfont = new Font(Font.FontFamily.UNDEFINED, 12, Font.BOLD);

            PdfPCell c1 = new PdfPCell(new Phrase("Quantity x Price", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_CENTER);
            c1.setBorder(Rectangle.NO_BORDER);
            table.addCell(c1);

            c1 = new PdfPCell(new Phrase("Item", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_CENTER);
            c1.setBorder(Rectangle.NO_BORDER);
            table.addCell(c1);

            c1 = new PdfPCell(new Phrase("Discount", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_CENTER);
            c1.setBorder(Rectangle.NO_BORDER);
            table.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("Total", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_CENTER);
            c1.setBorder(Rectangle.NO_BORDER);
            table.addCell(c1);
            
            table.setHeaderRows(1);

            for(Transaction transaction: transactionList) {
            	table.addCell(transaction.getQuantity() + " x " + transaction.getPrice());
            	table.addCell(transaction.getInventory().getItem().getItemdesc());
            	table.addCell(transaction.getDiscount() + "%");
            	table.addCell(""+(transaction.getPrice() * (1-((double)transaction.getDiscount()/100)) * transaction.getQuantity()));
            }

            tableContainer.add(table);
            
            
            Paragraph dataContainer = new Paragraph();
            PdfPTable dataContainerTable = new PdfPTable(2);
            dataContainerTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
            
            //insert the data
            c1 = new PdfPCell(new Phrase("Net amount due:", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(String.valueOf(receipt.getAmountDue())));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("Amount paid:", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(String.valueOf(receipt.getAmountPaid())));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("Amount change:", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(String.valueOf(receipt.getAmountChange())));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("Cashier:", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(username));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("Total items:", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(totalItems));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("Vatable Sale:", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(vatableSale));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase("VAT (12%):", tfont));
            c1.setHorizontalAlignment(Element.ALIGN_LEFT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            c1 = new PdfPCell(new Phrase(vat));
            c1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c1.setBorder(Rectangle.NO_BORDER);
            dataContainerTable.addCell(c1);
            
            dataContainer.add(dataContainerTable);
            
            //Payment details
            Paragraph payments = new Paragraph();
            
            PdfPTable paymentTable = new PdfPTable(3);
            paymentTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
            paymentTable.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
    		
    		PdfPCell ptc = new PdfPCell(new Phrase("Payment type", tfont));
    		ptc.setHorizontalAlignment(Element.ALIGN_CENTER);
    		ptc.setBorder(Rectangle.NO_BORDER);
    		paymentTable.addCell(ptc);

            ptc = new PdfPCell(new Phrase("Reference number", tfont));
            ptc.setHorizontalAlignment(Element.ALIGN_CENTER);
            ptc.setBorder(Rectangle.NO_BORDER);
            paymentTable.addCell(ptc);

            ptc = new PdfPCell(new Phrase("Amount", tfont));
            ptc.setHorizontalAlignment(Element.ALIGN_CENTER);
            ptc.setBorder(Rectangle.NO_BORDER);
            paymentTable.addCell(ptc);
            
            //PaymentList
            for(Payment payment: paymentList) {
            	paymentTable.addCell(getPaymentType(paymentTypeList, payment.getPaymentType().getPaymentTypeId()));
            	paymentTable.addCell(payment.getPaymentReferenceId());
            	paymentTable.addCell("PhP"+payment.getAmount());
            }
            payments.add(paymentTable);
            
            Paragraph footer = new Paragraph("This serves as an official receipt.\nThank you for visiting us.\nPlease see us again soon.");
            footer.setAlignment(Paragraph.ALIGN_CENTER);
            
			String pdfName = "C:\\PDF\\receipt" +Math.random()*1000+ ".pdf";
			@SuppressWarnings("unused")
			PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfName));
			document.open();
			
			HttpSession session = request.getSession();
	        ServletContext sc = session.getServletContext();
	        String x = sc.getRealPath("/");
	        String logoLocation = x + "/resources/img/ROX_png2.png";
	        
			Anchor anchorTarget = new Anchor();
			
	        Paragraph receiptHeader = new Paragraph(storeDetails);
	        receiptHeader.setAlignment(Paragraph.ALIGN_CENTER);
		    
		    Image img = null;
		    
		    try {
				img = Image.getInstance(logoLocation);
			} catch (MalformedURLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		    
		    Paragraph imageContainer = new Paragraph();
		    imageContainer.setSpacingBefore(50);
		    receiptAndDate.setSpacingBefore(25);
		    tableContainer.setSpacingBefore(25);
		    payments.setSpacingBefore(25);
		    dataContainer.setSpacingBefore(25);
		    footer.setSpacingBefore(25);
		    
		    imageContainer.setAlignment(Element.ALIGN_MIDDLE);
		    //set alignment
		    img.setAlignment(Image.MIDDLE);
		    imageContainer.add(img);
		    imageContainer.add(anchorTarget);
		    
		    //Add the elements
		    document.add(imageContainer);
		    document.add(receiptHeader);
		    document.add(receiptAndDate);
		    document.add(tableContainer);
		    document.add(payments);
		    document.add(dataContainer);
		    document.add(footer);
		    
		    //close document
		    document.close();
		    
		    //open the PDF
		    Desktop.getDesktop().open(new File(pdfName));

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    }
	
	public static String getPaymentType(List<PaymentType> paymentTypeList, Integer paymentTypeId) {
		for(PaymentType paymentType: paymentTypeList) {
			if(paymentType.getPaymentTypeId().equals(paymentTypeId)) {
				return paymentType.getPaymentType();
			}
		}
		return "0";
	}
}
