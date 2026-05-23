import puppeteer from 'puppeteer';
import { IGeneratedPaper } from '../models/GeneratedPaper.js';

export const generatePDF = async (paper: IGeneratedPaper) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 40mm 20mm; 
            color: #1A1A1A; 
            line-height: 1.6;
          }
          .header { text-align: center; margin-bottom: 40px; }
          .school-name { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
          .subject-class { font-size: 16px; margin-bottom: 24px; }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px; 
            font-weight: 600; 
            font-size: 14px;
            border-bottom: 1px solid #EEE;
            padding-bottom: 10px;
          }
          .general-instruction { font-size: 13px; font-style: italic; margin-bottom: 30px; }
          .student-info { margin-bottom: 40px; font-size: 14px; }
          .student-info div { margin-bottom: 10px; }
          .section-title { text-align: center; margin: 40px 0 20px; font-weight: 700; font-size: 16px; text-transform: uppercase; }
          .question-type { font-weight: 700; margin-bottom: 5px; }
          .instruction { font-style: italic; color: #666; font-size: 13px; margin-bottom: 15px; }
          .question { margin-bottom: 20px; page-break-inside: avoid; }
          .options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; padding-left: 20px; }
          .answer-key { margin-top: 60px; page-break-before: always; border-top: 2px solid #1A1A1A; padding-top: 30px; }
          @page { size: A4; margin: 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${paper.schoolName}</div>
          <div class="subject-class">Subject: ${paper.subject} | Class: ${paper.grade}th</div>
        </div>

        <div class="info-row">
          <span>Time Allowed: ${paper.timeAllowed}</span>
          <span>Maximum Marks: ${paper.totalMarks}</span>
        </div>

        <div class="general-instruction">
          General Instruction: All questions are compulsory unless stated otherwise.
        </div>

        <div class="student-info">
          <div>Name: ________________________________________________</div>
          <div>Roll Number: _________________________________________</div>
          <div>Class: ${paper.grade}th Section: _________________________</div>
        </div>

        ${paper.sections.map(section => `
          <div class="section">
            <div class="section-title">${section.title}</div>
            <div class="question-type">${section.questionType}</div>
            <div class="instruction">${section.instruction}</div>
            ${section.questions.map(q => `
              <div class="question">
                <strong>${q.number}.</strong> [${q.difficulty}] ${q.text} [${q.marks} Marks]
                ${q.options && q.options.length > 0 ? `
                  <div class="options">
                    ${q.options.map((opt, i) => `<span>(${String.fromCharCode(97 + i)}) ${opt}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}

        <div class="answer-key">
          <h2 style="text-align: center; margin-bottom: 30px;">Answer Key</h2>
          ${paper.answerKey.map(ak => `
            <div style="margin-bottom: 15px;">
              <strong>${ak.number}.</strong> ${ak.answer}
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
    printBackground: true
  });

  await browser.close();
  return Buffer.from(pdfBuffer).toString('base64');
};
