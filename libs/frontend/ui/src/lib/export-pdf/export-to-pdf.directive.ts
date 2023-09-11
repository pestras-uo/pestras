import { Directive, ElementRef, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appExportToPdf]',
    standalone: true,

  exportAs: 'appExportToPdf',
})
export class ExportToPdfDirective {
  @Input()
  pdfName = 'file.pdf';

  constructor(private elRef: ElementRef) {}


 export() {
    const domElm: HTMLElement = this.elRef.nativeElement;

    // Set html2canvas options for better quality and avoiding potential issues
    const html2canvasOptions = {
      scale: 2, // Increase the scale for higher resolution
      useCORS: true, // Enable CORS for image loading
      allowTaint: true, // Allow tainting for external resources (e.g., images from different domains)
    };

    html2canvas(domElm, html2canvasOptions).then(async (canvas: any) => {
      const contentDataURL = canvas.toDataURL('image/jpeg'); // Use JPEG for better quality

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

      // Calculate the aspect ratio to maintain the correct page dimensions
      const aspectRatio = canvas.width / canvas.height;
      const pdfWidth = 190; // Adjust this value to control the width of the PDF page
      const pdfHeight = pdfWidth / aspectRatio;

      // Add image to the PDF
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);


      // Save the PDF
      pdf.save(this.pdfName); // Generated PDF
    });
  }
}
