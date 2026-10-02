import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const INITIAL_CURRICULA = {
  PROG001: {
    cutoff_score: 75,
    modules: [
      { 
        id: 1, 
        title: 'Introduction to Cooperatives & 7 ICA Principles', 
        duration: '45 min', 
        status: 'completed', 
        description: 'Foundational framework of cooperative societies in India and international cooperative principles.',
        videos: [
          { id: 'v101', title: 'ICA Principles & Rochdale Pioneers Documentary', duration: '18 min', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', language: 'en' },
          { id: 'v102', title: 'Evolution of Indian Cooperative Movement (PACS to State Apex)', duration: '22 min', url: '', language: 'hi' }
        ],
        materials: [
          { id: 'm101', title: '7 ICA Cooperative Principles Reference Booklet', type: 'PDF', size: '2.4 MB', description: 'Official NCCT study handbook covering democratic member control and autonomy.' },
          { id: 'm102', title: 'Ministry of Cooperation Guidelines 2024 Summary', type: 'PDF', size: '1.1 MB', description: 'Highlights of national policy reforms for grassroots societies.' }
        ],
        multilingual: {
          hi: {
            title: 'सहकारिता का परिचय एवं 7 आईसीए सिद्धांत',
            description: 'भारत में सहकारी समितियों का बुनियादी ढांचा और अंतर्राष्ट्रीय सहकारी सिद्धांत।'
          },
          mr: {
            title: 'सहकाराचा परिचय आणि ७ आयसीए तत्त्वे',
            description: 'भारतातील सहकारी संस्थांची मूलभूत रचना आणि आंतरराष्ट्रीय सहकार तत्त्वे.'
          },
          gu: {
            title: 'સહકારીતાનો પરિચય અને 7 આઈસીએ સિદ્ધાંતો',
            description: 'ભારતમાં સહકારી મંડળીઓનું મૂળભૂત માળખું અને આંતરરાષ્ટ્રીય સહકારી સિદ્ધાંતો.'
          }
        },
        quiz: [
          {
            id: 'q1_1',
            prompt: 'How many International Cooperative Alliance (ICA) principles govern cooperative societies?',
            options: [
              { value: '5', label: '5 Principles' },
              { value: '7', label: '7 Principles (Voluntary, Democratic, Education, etc.)', correct: true },
              { value: '10', label: '10 Principles' }
            ]
          },
          {
            id: 'q1_2',
            prompt: 'What is the democratic voting rule in a Primary Agricultural Credit Society (PACS)?',
            options: [
              { value: 'shares', label: 'One Share, One Vote (Corporate model)' },
              { value: 'member', label: 'One Member, One Vote (Cooperative principle)', correct: true },
              { value: 'deposit', label: 'Proportional to Fixed Deposit size' }
            ]
          }
        ]
      },
      { 
        id: 2, 
        title: 'Cooperative Governance & Multi-State Cooperative Societies Act', 
        duration: '60 min', 
        status: 'completed', 
        description: 'Legal obligations, board of directors responsibilities, and bye-law amendments.',
        videos: [
          { id: 'v201', title: 'Board Governance & Statutory Responsibilities in PACS', duration: '25 min', url: '', language: 'en' }
        ],
        materials: [
          { id: 'm201', title: 'Multi-State Cooperative Societies Act 2002 Handbook', type: 'PDF', size: '3.8 MB', description: 'Statutory legal framework, bye-law drafting templates, and compliance forms.' }
        ],
        multilingual: {
          hi: {
            title: 'सहकारी सुशासन एवं बहु-राज्य सहकारी सोसायटी अधिनियम',
            description: 'कानूनी दायित्व, निदेशक मंडल की जिम्मेदारियां और उपनियम संशोधन।'
          }
        },
        quiz: [
          {
            id: 'q2_1',
            prompt: 'Under MSCS Act 2002, what is the statutory quorum for holding an Annual General Meeting?',
            options: [
              { value: '10', label: '10% of members' },
              { value: '20', label: '20% or 1/5th of total eligible voting members', correct: true },
              { value: '50', label: '50% mandatory attendance' }
            ]
          }
        ]
      },
      { 
        id: 3, 
        title: 'Financial Management & PACS Accounting Standards', 
        duration: '90 min', 
        status: 'completed', 
        description: 'Double-entry bookkeeping, ledger reconciliation, balance sheet analysis for rural societies.',
        videos: [
          { id: 'v301', title: 'Double-Entry Bookkeeping for PACS Accountants', duration: '35 min', url: '', language: 'en' },
          { id: 'v302', title: 'Trial Balance & Day-End Balancing Practical Walkthrough', duration: '40 min', url: '', language: 'hi' }
        ],
        materials: [
          { id: 'm301', title: 'PACS Standardized Chart of Accounts (NABARD Standard)', type: 'Excel/PDF', size: '1.9 MB', description: 'Complete ledger head codes conforming to national computerization guidelines.' }
        ],
        multilingual: {
          hi: {
            title: 'वित्तीय प्रबंधन एवं पैक्स लेखा मानक',
            description: 'ग्रामीण समितियों के लिए दोहरा-प्रविष्टि बहीखाता, खाता समाधान और बैलेंस शीट विश्लेषण।'
          }
        },
        quiz: [
          {
            id: 'q3_1',
            prompt: 'In cooperative bookkeeping, what reconciliation must be verified at the close of every working day?',
            options: [
              { value: 'cashbook', label: 'Cash Book balance matching physical cash-in-safe and Day Book', correct: true },
              { value: 'yearly', label: 'Annual bank audit once a year only' },
              { value: 'estimate', label: 'Estimated balance based on weekly average' }
            ]
          }
        ]
      },
      { 
        id: 4, 
        title: 'Digital Record Keeping & ERP Implementation', 
        duration: '40 min', 
        status: 'in-progress', 
        description: 'Hands-on training for computerized day-to-day transaction records in PACS.',
        videos: [
          { id: 'v401', title: 'Hands-on PACS ERP Portal: Member Registration to Loan Disbursal', duration: '30 min', url: '', language: 'en' }
        ],
        materials: [
          { id: 'm401', title: 'PACS ERP User Manual & Data Migration Checklist', type: 'PDF', size: '4.5 MB', description: 'Step-by-step guide for digitizing physical member ledgers into cloud/edge ERP.' }
        ],
        multilingual: {
          hi: {
            title: 'डिजिटल रिकॉर्ड कीपिंग एवं ईआरपी कार्यान्वयन',
            description: 'पैक्स में कम्प्यूटरीकृत दैनिक लेन-देन रिकॉर्ड के लिए व्यावहारिक प्रशिक्षण।'
          }
        },
        quiz: [
          {
            id: 'q4_1',
            prompt: 'How does the Sahakar Edge Box ensure educational and transaction continuity during internet outages?',
            options: [
              { value: 'edge', label: 'Local Raspberry Pi server runs local LMS, queues offline attendance & quizzes, and auto-syncs when online', correct: true },
              { value: 'stop', label: 'Shuts down all system access until internet restores' },
              { value: 'paper', label: 'Reverts permanently to paper ledgers' }
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: 'q1',
        prompt: '1. Under the Ministry of Cooperation model bye-laws, what is mandatory for PACS financial operations?',
        options: [
          { value: 'manual', label: 'Maintenance of physical manual registers without computerized backup' },
          { value: 'nabard', label: 'Standardized ERP computerization and direct integration with NABARD/DCCBs', correct: true },
          { value: 'closure', label: 'Exclusive reliance on unregulated third-party private accounting software' }
        ]
      },
      {
        id: 'q2',
        prompt: '2. In cooperative double-entry bookkeeping, what daily reconciliation must be performed by the PACS accountant?',
        options: [
          { value: 'cashbook', label: 'Cash Book balance matching with General Day Book and physical cash in safe', correct: true },
          { value: 'yearly', label: 'Annual balance sheet review once every financial year only' },
          { value: 'stock', label: 'Quarterly review of foreign stock market fluctuations' }
        ]
      },
      {
        id: 'q3',
        prompt: '3. How does the Sahakar Edge Box ensure educational and assessment continuity in remote PACS with no internet?',
        options: [
          { value: 'edge', label: 'Local Raspberry Pi server runs local LMS, queues offline attendance & quizzes, and auto-syncs when online', correct: true },
          { value: 'stop', label: 'Suspends all learning until commercial satellite connection is restored' },
          { value: 'paper', label: 'Reverts permanently to paper-only physical log sheets' }
        ]
      },
      {
        id: 'q4',
        prompt: '4. What is the statutory quorum requirement for holding an Annual General Meeting in a cooperative society?',
        options: [
          { value: 'five', label: '5% of total members' },
          { value: 'quorum', label: '20% or 1/5th of total eligible voting members', correct: true },
          { value: 'half', label: '50% mandatory attendance' }
        ]
      }
    ]
  },
  PROG002: {
    cutoff_score: 70,
    modules: [
      { 
        id: 1, 
        title: 'Fundamentals of Primary Society Cash Book & Day Book Entries', 
        duration: '50 min', 
        status: 'completed', 
        description: 'Core principles of primary society cash handling, voucher management, and day book entries.',
        videos: [
          { id: 'v2_101', title: 'Cash Book Maintenance & Voucher Verification', duration: '24 min', url: '', language: 'en' }
        ],
        materials: [
          { id: 'm2_101', title: 'Cash Book Sample Formats & Practice Worksheets', type: 'PDF', size: '2.1 MB', description: 'Standardized forms for debit/credit vouchers in primary credit societies.' }
        ],
        multilingual: {
          hi: {
            title: 'प्राथमिक सोसायटी रोकड़ बही एवं दैनिकी प्रविष्टियों के मूल सिद्धांत',
            description: 'प्राथमिक समिति नकद प्रबंधन, वाउचर प्रबंधन और दैनिकी प्रविष्टियों के मुख्य सिद्धांत।'
          }
        },
        quiz: [
          {
            id: 'q2_1_1',
            prompt: 'What is the fundamental golden rule for recording asset transactions in double-entry bookkeeping?',
            options: [
              { value: 'rule1', label: 'Debit what comes in, Credit what goes out', correct: true },
              { value: 'rule2', label: 'Debit all incomes, Credit all expenses' },
              { value: 'rule3', label: 'Credit all assets, Debit all liabilities' }
            ]
          }
        ]
      },
      { 
        id: 2, 
        title: 'Member Ledger Balancing & Kisan Credit Card (KCC) Passbooks', 
        duration: '60 min', 
        status: 'completed', 
        description: 'Accounting for short-term agricultural credit, interest subvention calculation, and member ledger audit.',
        videos: [
          { id: 'v2_201', title: 'KCC Loan Disbursement & Interest Subvention Accounting', duration: '28 min', url: '', language: 'en' }
        ],
        materials: [
          { id: 'm2_201', title: 'KCC Operational Norms & NABARD Refinance Rules', type: 'PDF', size: '1.7 MB', description: 'Interest rate calculation, prompt repayment incentive (PRI) accounting.' }
        ],
        multilingual: {},
        quiz: []
      },
      { 
        id: 3, 
        title: 'Preparation of Trial Balance & Annual Trading Accounts', 
        duration: '75 min', 
        status: 'in-progress', 
        description: 'Balancing debit and credit columns, adjusting closing stocks, and final account preparation.',
        videos: [],
        materials: [
          { id: 'm2_301', title: 'Trial Balance Preparation Guide & Common Adjustment Entries', type: 'PDF', size: '3.0 MB', description: 'Depreciation, bad debt provisioning, and accrued interest handling.' }
        ],
        multilingual: {},
        quiz: []
      },
      { 
        id: 4, 
        title: 'Statutory Audit Guidelines & Cooperative Banking Portal', 
        duration: '45 min', 
        status: 'locked', 
        description: 'Auditor checklist, classification of NPAs, and compliance filing with Registrar of Cooperative Societies.',
        videos: [],
        materials: [],
        multilingual: {},
        quiz: []
      }
    ],
    examQuestions: [
      {
        id: 'q1',
        prompt: '1. What is the fundamental golden rule for recording asset transactions in PACS double-entry bookkeeping?',
        options: [
          { value: 'rule1', label: 'Debit what comes in, Credit what goes out', correct: true },
          { value: 'rule2', label: 'Debit all incomes, Credit all expenses' },
          { value: 'rule3', label: 'Record transactions only at the end of each fiscal month' }
        ]
      },
      {
        id: 'q2',
        prompt: '2. How must the closing cash-in-safe balance be verified at the end of every business day?',
        options: [
          { value: 'audit', label: 'Joint physical count verified by Secretary and Cashier and cross-signed on Day Book', correct: true },
          { value: 'estimate', label: 'Rough estimate based on weekly withdrawal averages' },
          { value: 'none', label: 'Verification is only required during annual statutory audit' }
        ]
      },
      {
        id: 'q3',
        prompt: '3. Under cooperative auditing standards, how are overdue agricultural loans classified?',
        options: [
          { value: 'npa', label: 'Non-Performing Assets (NPA) requiring statutory provisioning per RBI/NABARD norms', correct: true },
          { value: 'asset', label: 'Standard assets without any provision requirement' },
          { value: 'equity', label: 'Member share capital addition' }
        ]
      },
      {
        id: 'q4',
        prompt: '4. How often must the PACS borrowing ledger be reconciled with the District Central Cooperative Bank (DCCB)?',
        options: [
          { value: 'weekly', label: 'Every 5 years during election cycles' },
          { value: 'monthly', label: 'Monthly reconciliation with official bank statement reconciliation certificates', correct: true },
          { value: 'random', label: 'Only when discrepancies exceed ₹10 Lakhs' }
        ]
      }
    ]
  }
};

export const useLmsStore = create(
  persist(
    (set, get) => ({
      curricula: INITIAL_CURRICULA,

      // 1. Upload Video to Module
      uploadVideo: (programmeId, moduleId, videoData) => {
        set((state) => {
          const course = state.curricula[programmeId] || state.curricula['PROG001'];
          const updatedModules = course.modules.map((m) => {
            if (m.id === parseInt(moduleId, 10)) {
              const currentVideos = m.videos || [];
              return {
                ...m,
                videos: [
                  ...currentVideos,
                  {
                    id: `v_${Date.now()}`,
                    title: videoData.title,
                    duration: videoData.duration || '20 min',
                    url: videoData.url || '',
                    language: videoData.language || 'en',
                    uploadedAt: new Date().toISOString()
                  }
                ]
              };
            }
            return m;
          });

          return {
            curricula: {
              ...state.curricula,
              [programmeId]: {
                ...course,
                modules: updatedModules
              }
            }
          };
        });
      },

      // 2. Upload Study Material / PDF / Handout
      uploadMaterial: (programmeId, moduleId, materialData) => {
        set((state) => {
          const course = state.curricula[programmeId] || state.curricula['PROG001'];
          const updatedModules = course.modules.map((m) => {
            if (m.id === parseInt(moduleId, 10)) {
              const currentMaterials = m.materials || [];
              return {
                ...m,
                materials: [
                  ...currentMaterials,
                  {
                    id: `mat_${Date.now()}`,
                    title: materialData.title,
                    type: materialData.type || 'PDF',
                    size: materialData.size || '2.5 MB',
                    description: materialData.description || 'Study guide uploaded by faculty',
                    uploadedAt: new Date().toISOString()
                  }
                ]
              };
            }
            return m;
          });

          return {
            curricula: {
              ...state.curricula,
              [programmeId]: {
                ...course,
                modules: updatedModules
              }
            }
          };
        });
      },

      // 3. Add Multilingual Learning Content (Bhashini AI)
      addMultilingualContent: (programmeId, moduleId, languageCode, translatedData) => {
        set((state) => {
          const course = state.curricula[programmeId] || state.curricula['PROG001'];
          const updatedModules = course.modules.map((m) => {
            if (m.id === parseInt(moduleId, 10)) {
              return {
                ...m,
                multilingual: {
                  ...(m.multilingual || {}),
                  [languageCode]: {
                    title: translatedData.title,
                    description: translatedData.description
                  }
                }
              };
            }
            return m;
          });

          return {
            curricula: {
              ...state.curricula,
              [programmeId]: {
                ...course,
                modules: updatedModules
              }
            }
          };
        });
      },

      // 4. Create Quiz / Assessment Question
      createQuizQuestion: (programmeId, moduleId, questionData) => {
        set((state) => {
          const course = state.curricula[programmeId] || state.curricula['PROG001'];
          const updatedModules = course.modules.map((m) => {
            if (m.id === parseInt(moduleId, 10)) {
              const currentQuiz = m.quiz || [];
              return {
                ...m,
                quiz: [
                  ...currentQuiz,
                  {
                    id: `q_${Date.now()}`,
                    prompt: questionData.prompt,
                    options: questionData.options
                  }
                ]
              };
            }
            return m;
          });

          return {
            curricula: {
              ...state.curricula,
              [programmeId]: {
                ...course,
                modules: updatedModules
              }
            }
          };
        });
      },

      // 5. Create Final Exam Question for Certification
      createExamQuestion: (programmeId, questionData) => {
        set((state) => {
          const course = state.curricula[programmeId] || state.curricula['PROG001'];
          return {
            curricula: {
              ...state.curricula,
              [programmeId]: {
                ...course,
                examQuestions: [
                  ...(course.examQuestions || []),
                  {
                    id: `eq_${Date.now()}`,
                    prompt: questionData.prompt,
                    options: questionData.options
                  }
                ]
              }
            }
          };
        });
      },

      // 6. Update Cutoff Passing Benchmark
      updateCutoffScore: (programmeId, cutoff) => {
        set((state) => {
          const course = state.curricula[programmeId] || state.curricula['PROG001'];
          return {
            curricula: {
              ...state.curricula,
              [programmeId]: {
                ...course,
                cutoff_score: parseInt(cutoff, 10)
              }
            }
          };
        });
      }
    }),
    {
      name: 'sahakarsetu-lms-store'
    }
  )
);
