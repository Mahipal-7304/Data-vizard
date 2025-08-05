import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export chart as an image (PNG)
 * @param {string} chartId - The ID of the chart canvas element
 * @param {string} fileName - The name of the file to save (without extension)
 */
export const exportChartAsImage = async (chartId, fileName = 'chart') => {
  try {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
      console.error('Chart canvas not found');
      return;
    }
    
    // Convert canvas to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting chart as image:', error);
    throw error;
  }
};

/**
 * Export chart as PDF
 * @param {string} chartId - The ID of the chart canvas element
 * @param {string} fileName - The name of the file to save (without extension)
 * @param {string} title - Optional title for the PDF
 */
export const exportChartAsPdf = async (chartId, fileName = 'chart', title = '') => {
  try {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
      console.error('Chart canvas not found');
      return;
    }
    
    // Create a temporary container to render the chart with better quality
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px'; // Fixed width for PDF
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    
    // Clone the canvas
    const clonedCanvas = canvas.cloneNode(true);
    clonedCanvas.style.width = '100%';
    clonedCanvas.style.height = 'auto';
    
    // Add title if provided
    if (title) {
      const titleElement = document.createElement('h2');
      titleElement.textContent = title;
      titleElement.style.textAlign = 'center';
      titleElement.style.marginBottom = '20px';
      titleElement.style.fontFamily = 'Helvetica, Arial, sans-serif';
      container.appendChild(titleElement);
    }
    
    container.appendChild(clonedCanvas);
    document.body.appendChild(container);
    
    // Use html2canvas to render the container
    const canvasElement = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });
    
    // Clean up
    document.body.removeChild(container);
    
    // Create PDF
    const imgData = canvasElement.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvasElement.width > canvasElement.height ? 'landscape' : 'portrait',
      unit: 'mm',
    });
    
    // Calculate dimensions to fit the PDF
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(
      (pageWidth - 20) / canvasElement.width,
      (pageHeight - 40) / canvasElement.height
    );
    
    const imgWidth = canvasElement.width * ratio;
    const imgHeight = canvasElement.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    let y = 20; // Start 20mm from top
    
    // Add title to PDF if provided
    if (title) {
      pdf.setFontSize(18);
      pdf.text(title, pageWidth / 2, 15, { align: 'center' });
      y = 25; // Adjust Y position after title
    }
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    
    // Save the PDF
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error exporting chart as PDF:', error);
    throw error;
  }
};

/**
 * Export chart data as CSV
 * @param {Array} data - The chart data points
 * @param {string} fileName - The name of the file to save (without extension)
 */
export const exportChartDataAsCsv = (data, fileName = 'chart-data') => {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No data to export');
      return;
    }
    
    // Get headers from the first data point
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Escape quotes and wrap in quotes if contains comma or quote
        const value = String(item[header] || '');
        return `"${value.replace(/"/g, '""')}"`;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error exporting chart data as CSV:', error);
    throw error;
  }
};
