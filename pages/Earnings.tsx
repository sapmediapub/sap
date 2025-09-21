import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { EarningSource } from '../types';
import Button from '../components/ui/Button';
import DateRangeModal from '../components/ui/DateRangeModal';

declare const window: any; // To access jsPDF from the window object

const MOCK_EARNINGS = [
    { id: 'e1', songTitle: 'Lagos Midnight', source: EarningSource.PERFORMANCE, date: '2024-05-15', amount: 150.25 },
    { id: 'e2', songTitle: 'Cosmic Drift', source: EarningSource.MECHANICAL, date: '2024-05-12', amount: 88.50 },
    { id: 'e3', songTitle: 'Lagos Midnight', source: EarningSource.NEIGHBOURING_RIGHTS, date: '2024-05-10', amount: 45.00 },
    { id: 'e4', songTitle: 'Quiet Reflection', source: EarningSource.PERFORMANCE, date: '2024-04-28', amount: 320.75 },
    { id: 'e5', songTitle: 'Highway Blues', source: EarningSource.MECHANICAL, date: '2024-04-25', amount: 112.00 },
];

const Earnings: React.FC = () => {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateStatement = ({ startDate, endDate }: { startDate: string, endDate: string }) => {
        setIsDateModalOpen(false);
        setIsGenerating(true);

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Add a day to the end date to make the range inclusive
            end.setDate(end.getDate() + 1);

            const statementData = MOCK_EARNINGS.filter(e => {
                const earningDate = new Date(e.date);
                return earningDate >= start && earningDate <= end;
            });
            
            if (statementData.length === 0) {
                alert('No earnings data found for the selected period.');
                return;
            }
            
            // The jsPDF library is loaded from a script tag and attaches itself to window.jspdf
            if (!window.jspdf || !window.jspdf.jsPDF) {
                throw new Error("jsPDF library not found.");
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text('Earnings Statement', 14, 22);
            doc.setFontSize(12);
            doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);
            
            doc.autoTable({
                startY: 40,
                head: [['Date', 'Song Title', 'Source', 'Amount']],
                body: statementData.map(e => [e.date, e.songTitle, e.source, `$${e.amount.toFixed(2)}`]),
                theme: 'striped',
                headStyles: { fillColor: '#374151' }, // gray-700
            });
        
            doc.save(`SapMedia-Earnings-Statement-${startDate}-to-${endDate}.pdf`);

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("An error occurred while generating the PDF statement.");
        } finally {
            setIsGenerating(false);
        }
    };

  return (
    <>
    <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSubmit={handleGenerateStatement}
    />
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Earnings History</h1>
            <Button onClick={() => setIsDateModalOpen(true)} isLoading={isGenerating}>
                Download Statement
            </Button>
        </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Song Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {MOCK_EARNINGS.map((earning) => (
                <tr key={earning.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{earning.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{earning.songTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{earning.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-400">${earning.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    </>
  );
};

export default Earnings;