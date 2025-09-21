declare const window: any; // To access jsPDF from the window object

export const generateContractPdf = (songTitle: string, contractText: string) => {
    // The jsPDF library is loaded from a script tag and attaches itself to window.jspdf
    if (!window.jspdf || !window.jspdf.jsPDF) {
        console.error("jsPDF library not found.");
        alert("Could not generate PDF. The required library is missing.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Exclusive Music Publishing Agreement', 14, 22);
    doc.setFontSize(10);

    // splitTextToSize is crucial for handling wrapping of long text
    const splitText = doc.splitTextToSize(contractText.trim(), 180); // 180 is max width in mm for A4 page
    doc.text(splitText, 14, 35);

    doc.save(`Publishing-Agreement-${songTitle.replace(/\s+/g, '_')}.pdf`);
};