/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Directive, ElementRef, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[puiExportToPdf]',
  standalone: true,

  exportAs: 'puiExportToPdf',
})
export class PuiExportToPdfDirective {

  @Input()
  pdfName = 'file.pdf';

  constructor(private elRef: ElementRef) { }

  export() {
    const domElm: HTMLElement = this.elRef.nativeElement;

    const html2canvasOptions = {
      scale: 2, // Increase the scale for higher resolution
      useCORS: true, // Enable CORS for image loading
      allowTaint: true, // Allow tainting for external resources (e.g., images from different domains)
      scrollY: 0
    };

    html2canvas(domElm, html2canvasOptions).then((canvas) => {
      const image = { type: 'jpeg', quality: 0.98 };
      const margin = [0.5, 0.5];

      const imgWidth = 8.5;
      let pageHeight = 11;

      const innerPageWidth = imgWidth - margin[0] * 2;
      const innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
      const pxFullHeight = canvas.height;
      const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      const nPages = Math.ceil(pxFullHeight / pxPageHeight);

      // Define pageHeight separately so it can be trimmed on the final page.
      pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d')!;
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      const pdf = new jsPDF('p', 'in', [8.5, 11]);

      for (let page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        const w = pageCanvas.width;
        const h = pageCanvas.height;
        pageCtx.fillStyle = 'white';
        pageCtx.fillRect(0, 0, w, h);
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        // debugger;
        const imgData = pageCanvas.toDataURL('image/' + image.type, image.quality);
        pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
      }

      pdf.save();
    });
  }
}
