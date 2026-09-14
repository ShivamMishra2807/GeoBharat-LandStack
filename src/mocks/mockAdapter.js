/**
 * Mock Adapter for GeoBharat API calls
 * Toggles seamlessly between local mock JSON datasets and real Django REST API endpoints.
 */

// Helper to retrieve and persist users across demo sessions
const DEFAULT_USERS = [
  {
    id: 'CIT-001',
    name: 'Ramesh Dnyandev Patil',
    email: 'ramesh.patil@example.in',
    password: 'citizen123',
    role: 'citizen',
    phone: '+91 98220 44102',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    ulpin_associated: '27250010045001',
  },
  {
    id: 'CIT-002',
    name: 'Sunita Suresh Gaikwad',
    email: 'sunita.gaikwad@example.in',
    password: 'citizen123',
    role: 'citizen',
    phone: '+91 98231 55900',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    ulpin_associated: '27250010045002',
  },
  {
    id: 'ADMIN-001',
    name: 'Dr. Vikramaditya Shinde, IAS',
    username: 'admin',
    email: 'admin@geobharat.gov.in',
    password: 'admin123',
    role: 'admin',
    designation: 'Sub-Divisional Officer (SDO) / Prant Officer',
    department: 'Department of Revenue & Land Records',
    jurisdiction: 'Haveli & Pune Metropolitan Region',
  },
];

const getUsers = () => {
  try {
    const raw = localStorage.getItem('geobharat_users');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  try {
    localStorage.setItem('geobharat_users', JSON.stringify(DEFAULT_USERS));
  } catch (e) {}
  return DEFAULT_USERS;
};

const saveUser = (newUser) => {
  const users = getUsers();
  users.push(newUser);
  try {
    localStorage.setItem('geobharat_users', JSON.stringify(users));
  } catch (e) {}
  return users;
};

// Initial in-memory state templates for citizen service requests
const DEFAULT_CITIZEN_REQUESTS = [
  {
    id: 'REQ-2024-0891',
    ulpin: '27250010045001',
    applicant_id: 'CIT-001',
    service_type: 'Mutation Application (Varas/Succession)',
    applicant_name: 'Ramesh Dnyandev Patil',
    applicant_phone: '+91 98220 44102',
    submission_date: '2024-08-20',
    status: 'In Field Inspection',
    assigned_official: 'Talathi Wagholi (M. Deshmukh)',
    current_stage: 2,
    stages: [
      { name: 'Application Submitted', completed: true, date: '2024-08-20' },
      { name: 'Document Verification', completed: true, date: '2024-08-22' },
      { name: 'Field Inspection (Mawajani)', completed: false, current: true, date: 'In Progress' },
      { name: 'Public Notice / 15-day Objection', completed: false, date: 'Pending' },
      { name: 'Final Certification by Tehsildar', completed: false, date: 'Pending' },
    ],
    remarks: 'Heirship affidavit and death certificate verified by circle clerk.',
  },
  {
    id: 'REQ-2024-0742',
    ulpin: '27250010045001',
    applicant_id: 'CIT-001',
    service_type: 'Digitally Signed 7/12 & 8A Extract',
    applicant_name: 'Ramesh Dnyandev Patil',
    applicant_phone: '+91 98220 44102',
    submission_date: '2024-07-15',
    status: 'Completed / Issued',
    assigned_official: 'Automated Mahabhulekh Service',
    current_stage: 4,
    stages: [
      { name: 'Request Received', completed: true, date: '2024-07-15' },
      { name: 'Fee Deducted (₹ 15)', completed: true, date: '2024-07-15' },
      { name: 'Digital DSC Signature Appended', completed: true, date: '2024-07-15' },
      { name: 'Download Ready', completed: true, date: '2024-07-15' },
    ],
    remarks: 'Extract downloaded with QR verification code #MH-712-9921.',
  },
  {
    id: 'REQ-2024-0988',
    ulpin: '27250010045002',
    applicant_id: 'CIT-002',
    service_type: 'Building Permission NOC (Commercial)',
    applicant_name: 'Sunita Suresh Gaikwad',
    applicant_phone: '+91 98231 55900',
    submission_date: '2024-08-28',
    status: 'Pending Town Planner Scrutiny',
    assigned_official: 'PMRDA Town Planning Wing',
    current_stage: 1,
    stages: [
      { name: 'Application Submitted', completed: true, date: '2024-08-28' },
      { name: 'Auto-DCR Scrutiny', completed: false, current: true, date: 'In Progress' },
      { name: 'Fire & Water NOC', completed: false, date: 'Pending' },
      { name: 'Final Sanction Order', completed: false, date: 'Pending' },
    ],
    remarks: 'Architectural drawings uploaded in DWG format under Auto-DCR #2024-COMM-014.',
  }
];

// Initial in-memory state templates for official queue
const DEFAULT_OFFICIAL_QUEUE = [
  {
    id: 'MUT-PUN-2024-1029',
    ulpin: '27250010045002',
    survey_no: '45/1B',
    village: 'Wagholi, Haveli, Pune',
    service_type: 'Sale Deed Mutation Entry',
    applicant_name: 'Sunita Suresh Gaikwad',
    deed_number: 'PUN-HAV4-2024-03418',
    submitted_date: '2024-02-10',
    priority: 'High',
    status: 'Pending Approval',
    department: 'Revenue / Talathi Office',
    fee_paid_inr: 150,
    documents: ['Registered Sale Deed', 'e-Challan Stamp Duty', 'Identity Proof (Aadhaar)', 'Previous 7/12 Extract'],
    notes: 'No third-party objections received during 15-day notice period ending 28-Feb-2024.',
  },
  {
    id: 'BP-PMRDA-2024-014',
    ulpin: '27250010045002',
    survey_no: '45/1B',
    village: 'Wagholi, Haveli, Pune',
    service_type: 'Commercial Building Permission',
    applicant_name: 'Sunita Suresh Gaikwad',
    deed_number: 'PUN-HAV4-2024-03418',
    submitted_date: '2024-03-01',
    priority: 'Medium',
    status: 'Pending Approval',
    department: 'Town Planning / PMRDA',
    fee_paid_inr: 45000,
    documents: ['Site Plan', 'Auto-DCR Validation Report', 'Structural Stability Certificate', 'Environmental Clearance Exemption'],
    notes: 'Auto-DCR passed with FSI 2.20 and 24m road width clearance verified.',
  },
  {
    id: 'DISP-LKO-2023-019',
    ulpin: '09030020114004',
    survey_no: 'Khasra 115',
    village: 'Mohanlalganj, Lucknow',
    service_type: 'Boundary Demarcation & Dispute Hearing',
    applicant_name: 'Brijeshwar Awadh Sharma',
    deed_number: 'UP-LKO-SRO3-2020-5501',
    submitted_date: '2024-06-15',
    priority: 'Urgent / Legal',
    status: 'Hearing Scheduled',
    department: 'Sub-Divisional Magistrate (SDM)',
    fee_paid_inr: 500,
    documents: ['Civil Court Notice', 'Khasra Map Sheet', 'Revenue Inspector Spot Inspection Memo'],
    notes: 'Joint spot demarcation ordered for Khasra 115 and contiguous Khasra 116.',
  },
  {
    id: 'PATTA-KANCHI-2024-091',
    ulpin: '33010050082006',
    survey_no: '83/1',
    village: 'Sriperumbudur, Kanchipuram',
    service_type: 'Patta Sub-Division Regularization',
    applicant_name: 'K. V. Soundararajan',
    deed_number: 'TN-KANCHI-SRO1-2019-4402',
    submitted_date: '2024-07-29',
    priority: 'Medium',
    status: 'Pending Approval',
    department: 'Survey & Land Records (Kanchipuram)',
    fee_paid_inr: 300,
    documents: ['FMB Sketch (Field Measurement Book)', 'Chitta Copy', 'Bank NOC'],
    notes: 'Field surveyor GPS coordinates matched with Cadastral TNeGA grid.',
  }
];

const getStoredCitizenRequests = () => {
  try {
    const raw = localStorage.getItem('geobharat_citizen_requests');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  try {
    localStorage.setItem('geobharat_citizen_requests', JSON.stringify(DEFAULT_CITIZEN_REQUESTS));
  } catch (e) {}
  return [...DEFAULT_CITIZEN_REQUESTS];
};

const saveCitizenRequests = (items) => {
  citizenRequestsStore = items;
  try {
    localStorage.setItem('geobharat_citizen_requests', JSON.stringify(items));
  } catch (e) {}
};

const getStoredOfficialQueue = () => {
  try {
    const raw = localStorage.getItem('geobharat_official_queue');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  try {
    localStorage.setItem('geobharat_official_queue', JSON.stringify(DEFAULT_OFFICIAL_QUEUE));
  } catch (e) {}
  return [...DEFAULT_OFFICIAL_QUEUE];
};

const saveOfficialQueue = (items) => {
  officialQueueStore = items;
  try {
    localStorage.setItem('geobharat_official_queue', JSON.stringify(items));
  } catch (e) {}
};

let citizenRequestsStore = getStoredCitizenRequests();
let officialQueueStore = getStoredOfficialQueue();

// Cache for loaded mock files
let mockDataCache = {
  parcels: null,
  ror: null,
  registration: null,
  planning: null,
  taxation: null,
  utilities: null,
};

// Loader helper
const loadMockData = async () => {
  if (!mockDataCache.parcels) {
    const [pRes, rRes, regRes, planRes, taxRes, utilRes] = await Promise.all([
      fetch('/mock-data/parcels.geojson').then((r) => r.json()),
      fetch('/mock-data/record-of-rights.json').then((r) => r.json()),
      fetch('/mock-data/registration.json').then((r) => r.json()),
      fetch('/mock-data/planning.json').then((r) => r.json()),
      fetch('/mock-data/taxation.json').then((r) => r.json()),
      fetch('/mock-data/utilities.geojson').then((r) => r.json()),
    ]);
    mockDataCache = {
      parcels: pRes,
      ror: rRes,
      registration: regRes,
      planning: planRes,
      taxation: taxRes,
      utilities: utilRes,
    };
  }
  return mockDataCache;
};

/**
 * Handle simulated requests
 */
export const mockAdapterHandler = async (config) => {
  const dataCache = await loadMockData();
  const url = config.url.replace(/^(\/api\/v1|\/api)/, '');
  const method = (config.method || 'GET').toUpperCase();

  // Small latency simulation for realistic UI loading states
  await new Promise((r) => setTimeout(r, 120));

  // --- GET /parcels ---
  if (url === '/parcels' && method === 'GET') {
    return {
      status: 200,
      data: dataCache.parcels,
      headers: { 'content-type': 'application/geo+json' },
      config,
    };
  }

  // --- GET /parcels/:ulpin/ror ---
  const rorMatch = url.match(/^\/parcels\/([^/]+)\/ror$/);
  if (rorMatch && method === 'GET') {
    const ulpin = rorMatch[1];
    const match = dataCache.ror.find((item) => String(item.ulpin) === String(ulpin));
    if (match) {
      return { status: 200, data: match, headers: {}, config };
    }
    return {
      status: 404,
      data: { error: 'Record of Rights not found for ULPIN ' + ulpin },
      headers: {},
      config,
    };
  }

  // --- GET /parcels/:ulpin/registration ---
  const regMatch = url.match(/^\/parcels\/([^/]+)\/registration$/);
  if (regMatch && method === 'GET') {
    const ulpin = regMatch[1];
    const match = dataCache.registration.find((item) => String(item.ulpin) === String(ulpin));
    if (match) {
      return { status: 200, data: match, headers: {}, config };
    }
    return {
      status: 404,
      data: { error: 'Registration deed not found for ULPIN ' + ulpin },
      headers: {},
      config,
    };
  }

  // --- GET /parcels/:ulpin/planning ---
  const planMatch = url.match(/^\/parcels\/([^/]+)\/planning$/);
  if (planMatch && method === 'GET') {
    const ulpin = planMatch[1];
    const match = dataCache.planning.find((item) => String(item.ulpin) === String(ulpin));
    if (match) {
      return { status: 200, data: match, headers: {}, config };
    }
    return {
      status: 404,
      data: { error: 'Master planning record not found for ULPIN ' + ulpin },
      headers: {},
      config,
    };
  }

  // --- GET /parcels/:ulpin/taxation ---
  const taxMatch = url.match(/^\/parcels\/([^/]+)\/taxation$/);
  if (taxMatch && method === 'GET') {
    const ulpin = taxMatch[1];
    const match = dataCache.taxation.find((item) => String(item.ulpin) === String(ulpin));
    if (match) {
      return { status: 200, data: match, headers: {}, config };
    }
    return {
      status: 404,
      data: { error: 'Taxation record not found for ULPIN ' + ulpin },
      headers: {},
      config,
    };
  }

  // --- POST /parcels/:ulpin/taxation/pay ---
  const taxPayMatch = url.match(/^\/parcels\/([^/]+)\/taxation\/pay$/);
  if (taxPayMatch && method === 'POST') {
    const ulpin = taxPayMatch[1];
    const match = dataCache.taxation.find((item) => String(item.ulpin) === String(ulpin));
    if (match) {
      match.tax_due_inr = 0;
      match.payment_status = 'Fully Paid (Instant Receipt)';
      match.last_paid_date = new Date().toISOString().split('T')[0];
      match.payment_history.unshift({
        financial_year: '2024-2025',
        demand_inr: match.annual_demand_inr,
        paid_inr: match.annual_demand_inr,
        paid_date: new Date().toISOString().split('T')[0],
        receipt_no: `ONLINE-PAY-${Date.now()}`,
        mode: 'UPI / Bharat BillPay',
      });
      return { status: 200, data: match, headers: {}, config };
    }
  }

  // --- GET /utilities ---
  if (url === '/utilities' && method === 'GET') {
    return {
      status: 200,
      data: dataCache.utilities,
      headers: { 'content-type': 'application/geo+json' },
      config,
    };
  }

  // --- POST /workflows/sync-sale-deed (Cross-Departmental Interoperability Event Bus) ---
  if (url === '/workflows/sync-sale-deed' && method === 'POST') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const { ulpin, new_owner, deed_number, consideration_inr } = payload;

    // 1. Update Registration Deed
    const regItem = dataCache.registration?.find((item) => String(item.ulpin) === String(ulpin));
    if (regItem) {
      regItem.deed_number = deed_number || `PUN-HAV4-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      regItem.document_type = 'Absolute Conveyance Sale Deed (Kharidi-Khat)';
      regItem.consideration_amount_inr = consideration_inr || regItem.market_value_inr;
      regItem.registration_date = new Date().toISOString().split('T')[0];
    }

    // 2. Mutate Record of Rights (RoR)
    const rorItem = dataCache.ror?.find((item) => String(item.ulpin) === String(ulpin));
    if (rorItem && new_owner) {
      const prevOwner = rorItem.owner_name;
      rorItem.owner_name = new_owner;
      rorItem.mutation_history.unshift({
        mutation_id: `AUTO-MUT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Instant SRO Webhook Mutation (Sale Deed)',
        status: 'Certified & Mutated (Auto-Amal)',
        officer: 'Automated Interoperable Revenue API Gateway',
        remarks: `Ownership transferred from ${prevOwner} to ${new_owner} triggered by SRO Deed registration #${deed_number || 'N/A'}.`
      });
    }

    // 3. Update Cadastral Parcel properties
    const parcelItem = dataCache.parcels?.features?.find((f) => String(f.properties?.ulpin) === String(ulpin));
    if (parcelItem && new_owner) {
      parcelItem.properties.owner_name = new_owner;
      parcelItem.properties.status = 'Clear Title';
    }

    // 4. Update Municipal Property Tax Assessment Record
    const taxItem = dataCache.taxation?.find((item) => String(item.ulpin) === String(ulpin));
    if (taxItem) {
      taxItem.payment_status = 'Notice Issued: Assessment Revised';
      taxItem.annual_demand_inr = Math.round(taxItem.annual_demand_inr * 1.05); // Standard revision
    }

    return {
      status: 200,
      data: {
        success: true,
        timestamp: new Date().toISOString(),
        transaction_id: `TXN-SYNC-${Date.now()}`,
        ulpin,
        steps: [
          { system: 'Sub-Registrar Office (SRO)', status: 'Success', message: `Sale Deed #${deed_number} registered and sealed.` },
          { system: 'Revenue Land Records (Bhoomi / Mahabhulekh)', status: 'Success', message: `RoR mutates instantaneously to ${new_owner}. Ferfar entry approved.` },
          { system: 'Municipal Property Tax Gateway (ULB)', status: 'Success', message: 'Assessee details mutated; revised annual demand scheduled.' },
          { system: 'National DigiLocker & Citizen SMS', status: 'Dispatched', message: 'Digitally signed 7/12 extract pushed to citizen Aadhaar vault.' }
        ]
      },
      headers: {},
      config,
    };
  }

  // --- GET /parcels/:ulpin (single parcel metadata) ---
  const singleParcelMatch = url.match(/^\/parcels\/([^/]+)$/);
  if (singleParcelMatch && method === 'GET') {
    const ulpin = singleParcelMatch[1];
    const match = dataCache.parcels?.features?.find((f) => String(f.properties?.ulpin) === String(ulpin));
    if (match) {
      return { status: 200, data: match, headers: {}, config };
    }
    return { status: 404, data: { error: 'Parcel not found' }, headers: {}, config };
  }

  // --- CITIZEN SERVICES API ---
  if (url === '/citizen/requests' && method === 'GET') {
    citizenRequestsStore = getStoredCitizenRequests();
    let currentUser = null;
    try {
      const stored = localStorage.getItem('geobharat_current_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch (e) {}

    let filtered = citizenRequestsStore;
    if (currentUser?.role === 'citizen') {
      // Strict privacy isolation: Citizen only sees their own service requests
      filtered = citizenRequestsStore.filter(
        (r) =>
          r.applicant_id === currentUser.id ||
          (r.applicant_name && r.applicant_name.toLowerCase() === currentUser.name?.toLowerCase()) ||
          (currentUser.ulpin_associated && r.ulpin === currentUser.ulpin_associated)
      );
    }
    return { status: 200, data: filtered, headers: {}, config };
  }

  if (url === '/citizen/requests' && method === 'POST') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    let currentUser = null;
    try {
      const stored = localStorage.getItem('geobharat_current_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch (e) {}

    const newReq = {
      id: `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ulpin: payload.ulpin,
      applicant_id: currentUser?.id || payload.applicant_id || 'CIT-001',
      service_type: payload.service_type || 'Service Request',
      applicant_name: payload.applicant_name || currentUser?.name || 'Citizen User',
      applicant_phone: payload.applicant_phone || currentUser?.phone || '+91 98000 00000',
      submission_date: new Date().toISOString().split('T')[0],
      status: 'Submitted & In Queue',
      assigned_official: 'Sub-Divisional Revenue Desk',
      current_stage: 1,
      stages: [
        { name: 'Application Submitted', completed: true, date: new Date().toISOString().split('T')[0] },
        { name: 'Document Scrutiny', completed: false, current: true, date: 'Pending' },
        { name: 'Field Inspection', completed: false, date: 'Pending' },
        { name: 'Order Issuance', completed: false, date: 'Pending' },
      ],
      remarks: payload.remarks || 'Application received online via GeoBharat Land Stack.',
    };

    citizenRequestsStore = getStoredCitizenRequests();
    citizenRequestsStore.unshift(newReq);
    saveCitizenRequests(citizenRequestsStore);

    // Look up parcel details for survey number and village
    const parcelMatch = dataCache.parcels?.features?.find((f) => String(f.properties?.ulpin) === String(newReq.ulpin));
    const pProps = parcelMatch?.properties || {};
    const survey_no = pProps.survey_no || pProps.surveyNumber || '45/1A';
    const village = pProps.village ? `${pProps.village}, ${pProps.district || 'Pune'}` : 'Wagholi, Haveli, Pune';
    const isMutation = newReq.service_type.toLowerCase().includes('mutation') || newReq.service_type.toLowerCase().includes('varas');

    const queueItem = {
      id: newReq.id,
      ulpin: newReq.ulpin,
      survey_no: survey_no,
      village: village,
      service_type: newReq.service_type,
      applicant_name: newReq.applicant_name,
      deed_number: `APP-${new Date().getFullYear()}-${newReq.id.slice(-4)}`,
      submitted_date: newReq.submission_date,
      priority: isMutation ? 'High' : 'Normal',
      status: 'Pending Scrutiny',
      department: 'Revenue / Land Records',
      fee_paid_inr: 150,
      documents: [
        'Citizen Application Form',
        'Aadhaar e-KYC Verification',
        'Land Title / 7/12 Extract Record',
        'Cadastral Boundary Map Sheet',
      ],
      notes: newReq.remarks || 'Application submitted online via GeoBharat Citizen Portal. Awaiting revenue officer scrutiny.',
    };

    officialQueueStore = getStoredOfficialQueue();
    officialQueueStore.unshift(queueItem);
    saveOfficialQueue(officialQueueStore);

    return { status: 201, data: newReq, headers: {}, config };
  }

  // --- OFFICIAL DASHBOARD API ---
  if (url === '/official/queue' && method === 'GET') {
    officialQueueStore = getStoredOfficialQueue();
    citizenRequestsStore = getStoredCitizenRequests();

    // Auto-sync any citizen requests not yet in official queue
    let changed = false;
    for (const req of citizenRequestsStore) {
      if (!officialQueueStore.some((q) => q.id === req.id)) {
        const parcelMatch = dataCache.parcels?.features?.find((f) => String(f.properties?.ulpin) === String(req.ulpin));
        const pProps = parcelMatch?.properties || {};
        const survey_no = pProps.survey_no || pProps.surveyNumber || '45/1A';
        const village = pProps.village ? `${pProps.village}, ${pProps.district || 'Pune'}` : 'Wagholi, Haveli, Pune';
        const isMutation = req.service_type.toLowerCase().includes('mutation') || req.service_type.toLowerCase().includes('varas');
        officialQueueStore.unshift({
          id: req.id,
          ulpin: req.ulpin,
          survey_no: survey_no,
          village: village,
          service_type: req.service_type,
          applicant_name: req.applicant_name,
          deed_number: `APP-${new Date().getFullYear()}-${req.id.slice(-4)}`,
          submitted_date: req.submission_date,
          priority: isMutation ? 'High' : 'Normal',
          status: 'Pending Scrutiny',
          department: 'Revenue / Land Records',
          fee_paid_inr: 150,
          documents: [
            'Citizen Application Form',
            'Aadhaar e-KYC Verification',
            'Land Title / 7/12 Extract Record',
            'Cadastral Boundary Map Sheet',
          ],
          notes: req.remarks || 'Application submitted online via GeoBharat Citizen Portal.',
        });
        changed = true;
      }
    }
    if (changed) {
      saveOfficialQueue(officialQueueStore);
    }

    return { status: 200, data: officialQueueStore, headers: {}, config };
  }

  const actionMatch = url.match(/^\/official\/queue\/([^/]+)\/action$/);
  if (actionMatch && method === 'POST') {
    const itemId = actionMatch[1];
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    officialQueueStore = getStoredOfficialQueue();
    citizenRequestsStore = getStoredCitizenRequests();

    const target = officialQueueStore.find((q) => q.id === itemId);
    if (target) {
      const isApproved = payload.action === 'approve';
      target.status = isApproved ? 'Approved & Certified' : 'Rejected / Query Raised';
      target.action_date = new Date().toISOString().split('T')[0];
      target.officer_remarks = payload.remarks || (isApproved ? 'Documents found in order. Digital sanction sealed.' : 'Deficiency observed in title clearance.');
      saveOfficialQueue(officialQueueStore);

      // Two-way sync with citizenRequestsStore
      const matchingCitizenReq = citizenRequestsStore.find((r) => r.id === itemId);
      if (matchingCitizenReq) {
        matchingCitizenReq.status = target.status;
        matchingCitizenReq.remarks = target.officer_remarks;
        if (isApproved) {
          matchingCitizenReq.current_stage = 4;
          matchingCitizenReq.stages = matchingCitizenReq.stages.map((stg) => ({
            ...stg,
            completed: true,
            current: false,
            date: stg.date === 'Pending' ? target.action_date : stg.date,
          }));
        } else {
          matchingCitizenReq.stages = matchingCitizenReq.stages.map((stg) => {
            if (stg.name === 'Document Scrutiny') {
              return { ...stg, completed: false, current: false, date: 'Rejected / Query Raised' };
            }
            return stg;
          });
        }
        saveCitizenRequests(citizenRequestsStore);
      }

      return { status: 200, data: target, headers: {}, config };
    }
  }

  // --- OFFICIAL ANALYTICS API ---
  if (url === '/official/analytics' && method === 'GET') {
    return {
      status: 200,
      data: {
        summary: {
          total_parcels: 10,
          total_area_sqm: 44417,
          total_area_acres: 10.97,
          mutation_success_rate: '94.2%',
          active_disputes: 2,
          tax_collection_rate: '81.4%',
          revenue_collected_inr: 885780,
          revenue_due_inr: 144000,
        },
        mutations_monthly: [
          { month: 'Jan', applied: 42, approved: 39, rejected: 3 },
          { month: 'Feb', applied: 58, approved: 54, rejected: 4 },
          { month: 'Mar', applied: 75, approved: 71, rejected: 4 },
          { month: 'Apr', applied: 61, approved: 58, rejected: 3 },
          { month: 'May', applied: 80, approved: 76, rejected: 4 },
          { month: 'Jun', applied: 95, approved: 89, rejected: 6 },
          { month: 'Jul', applied: 84, approved: 80, rejected: 4 },
          { month: 'Aug', applied: 90, approved: 86, rejected: 4 },
        ],
        zoning_distribution: [
          { name: 'Residential', count: 4, area_sqm: 17275, color: '#3B82F6' },
          { name: 'Commercial', count: 3, area_sqm: 11216, color: '#EF4444' },
          { name: 'Agricultural', count: 1, area_sqm: 9105, color: '#16A34A' },
          { name: 'Industrial', count: 1, area_sqm: 3561, color: '#9333EA' },
          { name: 'Eco-sensitive', count: 1, area_sqm: 2428, color: '#0D9488' },
        ],
        dispute_status_split: [
          { name: 'Clear Title', count: 7, color: '#10B981' },
          { name: 'Under Mutation', count: 1, color: '#F59E0B' },
          { name: 'Court / Legal Stay', count: 1, color: '#EF4444' },
          { name: 'Statutory Buffer', count: 1, color: '#0D9488' },
        ]
      },
      headers: {},
      config,
    };
  }

  // --- AUTH API: SIGNUP ---
  if (url === '/auth/signup' && method === 'POST') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const { name, email, password, state, district } = payload;
    if (!name || !email || !password) {
      return {
        status: 400,
        data: { error: 'Name, email, and password are required fields.' },
        headers: {},
        config,
      };
    }
    const users = getUsers();
    const existing = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return {
        status: 400,
        data: { error: 'An account with this email address already exists. Please log in.' },
        headers: {},
        config,
      };
    }

    const newUser = {
      id: `CIT-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'citizen',
      phone: payload.phone || '+91 98000 00000',
      state: state || 'Maharashtra',
      district: district || 'Pune',
      village: payload.village || 'Wagholi',
      ulpin_associated: null,
    };

    saveUser(newUser);

    return {
      status: 201,
      data: {
        token: `mock-jwt-citizen-${Date.now()}`,
        role: 'citizen',
        user: newUser,
      },
      headers: {},
      config,
    };
  }

  // --- AUTH API: LOGIN ---
  if (url === '/auth/login' && method === 'POST') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const { role, email, username, password } = payload;
    const identifier = (email || username || '').trim().toLowerCase();
    const users = getUsers();

    // 1. Admin login pathway
    if (role === 'admin' || role === 'official') {
      const admin = users.find(
        (u) =>
          (u.role === 'admin' || u.role === 'official') &&
          ((u.username && u.username.toLowerCase() === identifier) ||
           (u.email && u.email.toLowerCase() === identifier))
      );

      if (admin && admin.password === password) {
        return {
          status: 200,
          data: {
            token: `mock-jwt-admin-${Date.now()}`,
            role: 'admin',
            user: admin,
          },
          headers: {},
          config,
        };
      }
      return {
        status: 401,
        data: { error: 'Invalid admin username or password. (Hint: admin / admin123)' },
        headers: {},
        config,
      };
    }

    // 2. Citizen login pathway
    const citizen = users.find(
      (u) =>
        u.role === 'citizen' &&
        u.email &&
        u.email.toLowerCase() === identifier
    );

    if (citizen && citizen.password === password) {
      return {
        status: 200,
        data: {
          token: `mock-jwt-citizen-${Date.now()}`,
          role: 'citizen',
          user: citizen,
        },
        headers: {},
        config,
      };
    }

    return {
      status: 401,
      data: { error: 'Invalid citizen email or password. Please verify credentials.' },
      headers: {},
      config,
    };
  }

  return {
    status: 404,
    data: { error: `Endpoint ${method} ${url} not found in mock adapter` },
    headers: {},
    config,
  };
};

export default mockAdapterHandler;
