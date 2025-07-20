import React from 'react';
import {  pdf} from '@react-pdf/renderer';
import  MyMultilingualPDF  from './MyMultilingualPDF';


// export const generatePDF = (
//   content: string,
//   filename: string = 'document',
//   language: string
// ) => {
//   return (
//     <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
//       <h1>Multilingual PDF Generator</h1>
//       <PDFDownloadLink
//         document={<MyMultilingualPDF content={content} language={language} />}
//         fileName={`${filename}.pdf`}
//       >
//         {({ loading }) =>
//           loading ? 'Generating PDF...' : <button>Download PDF</button>
//         }
//       </PDFDownloadLink>
//     </div>
//   );
// };

export const generatePDF = async (
  content: string,
  filename: string = 'document.pdf',
  language: string
) => {
  const blob = await pdf(
    <MyMultilingualPDF content={content} language={language} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click(); // ✅ Automatically triggers download
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
