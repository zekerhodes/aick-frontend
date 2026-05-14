// Mock data for AIC Kapsowar Hospital Asset Management
// This will be replaced with real backend API calls in Phase 2

export const ORG = {
  name: 'AIC Kapsowar Hospital',
  shortName: 'AIC Kapsowar',
  location: 'Kapsowar, Elgeyo-Marakwet, Kenya',
  currency: 'KSh',
  currencyCode: 'KES',
  established: 1933,
  tagline: 'Healing Hands, Caring Hearts',
};

export const CATEGORIES = [
  { id: 'cat-1', name: 'Medical Equipment', code: 'MED', count: 142, color: '#D9501E' },
  { id: 'cat-2', name: 'IT & Computers', code: 'IT', count: 87, color: '#1E3A5F' },
  { id: 'cat-3', name: 'Furniture', code: 'FUR', count: 64, color: '#7C3AED' },
  { id: 'cat-4', name: 'Vehicles', code: 'VEH', count: 12, color: '#059669' },
  { id: 'cat-5', name: 'Laboratory', code: 'LAB', count: 56, color: '#DC2626' },
  { id: 'cat-6', name: 'Surgical Instruments', code: 'SUR', count: 198, color: '#0891B2' },
  { id: 'cat-7', name: 'Office Equipment', code: 'OFF', count: 41, color: '#A16207' },
  { id: 'cat-8', name: 'Generators & Power', code: 'PWR', count: 8, color: '#475569' },
];

export const LOCATIONS = [
  { id: 'loc-1', name: 'Main Hospital Building', code: 'MHB', site: 'Kapsowar Main' },
  { id: 'loc-2', name: 'Maternity Ward', code: 'MAT', site: 'Kapsowar Main' },
  { id: 'loc-3', name: "Children's Ward", code: 'CHW', site: 'Kapsowar Main' },
  { id: 'loc-4', name: 'Operating Theatre 1', code: 'OT1', site: 'Kapsowar Main' },
  { id: 'loc-5', name: 'Operating Theatre 2', code: 'OT2', site: 'Kapsowar Main' },
  { id: 'loc-6', name: 'Outpatient Clinic', code: 'OPD', site: 'Kapsowar Main' },
  { id: 'loc-7', name: 'Laboratory', code: 'LAB', site: 'Kapsowar Main' },
  { id: 'loc-8', name: 'Radiology / X-Ray', code: 'RAD', site: 'Kapsowar Main' },
  { id: 'loc-9', name: 'Pharmacy', code: 'PHA', site: 'Kapsowar Main' },
  { id: 'loc-10', name: 'Administration Block', code: 'ADM', site: 'Kapsowar Main' },
  { id: 'loc-11', name: 'Nursing School', code: 'NSC', site: 'Kapsowar Main' },
  { id: 'loc-12', name: 'Staff Housing', code: 'STH', site: 'Kapsowar Main' },
  { id: 'loc-13', name: 'Mortuary', code: 'MOR', site: 'Kapsowar Main' },
  { id: 'loc-14', name: 'Kitchen & Laundry', code: 'KIT', site: 'Kapsowar Main' },
  { id: 'loc-15', name: 'Workshop / Biomed', code: 'WKS', site: 'Kapsowar Main' },
];

export const DEPARTMENTS = [
  { id: 'dep-1', name: 'Administration', head: 'Dr. Joseph Kiptoo' },
  { id: 'dep-2', name: 'Internal Medicine', head: 'Dr. Mary Chebet' },
  { id: 'dep-3', name: 'Surgery', head: 'Dr. Daniel Kibet' },
  { id: 'dep-4', name: 'Obstetrics & Gynaecology', head: 'Dr. Grace Jepkemboi' },
  { id: 'dep-5', name: 'Paediatrics', head: 'Dr. Samuel Rotich' },
  { id: 'dep-6', name: 'Nursing Services', head: 'Sr. Esther Chemutai' },
  { id: 'dep-7', name: 'Pharmacy', head: 'Pharm. Wilson Kiprop' },
  { id: 'dep-8', name: 'Laboratory', head: 'Mr. Eric Cheruiyot' },
  { id: 'dep-9', name: 'Radiology', head: 'Mr. Peter Kipkurui' },
  { id: 'dep-10', name: 'Biomedical Engineering', head: 'Eng. Brian Kimutai' },
  { id: 'dep-11', name: 'Finance & Accounts', head: 'Mr. John Kipkemoi' },
  { id: 'dep-12', name: 'IT Department', head: 'Mr. Kevin Ruto' },
];

export const VENDORS = [
  { id: 'ven-1', name: 'Philips Healthcare East Africa', contact: 'sales@philips.co.ke', phone: '+254 20 555 0101' },
  { id: 'ven-2', name: 'GE Healthcare Kenya', contact: 'info@ge.co.ke', phone: '+254 20 555 0202' },
  { id: 'ven-3', name: 'Surgipharm Ltd', contact: 'orders@surgipharm.co.ke', phone: '+254 20 555 0303' },
  { id: 'ven-4', name: 'Crown Healthcare', contact: 'sales@crownhealth.co.ke', phone: '+254 20 555 0404' },
  { id: 'ven-5', name: 'Mediquip Kenya', contact: 'info@mediquip.co.ke', phone: '+254 20 555 0505' },
  { id: 'ven-6', name: 'Davis & Shirtliff', contact: 'sales@dayliff.com', phone: '+254 20 555 0606' },
];

export const FUNDING_SOURCES = [
  { id: 'fnd-1', name: 'Hospital Operations Budget', type: 'Internal' },
  { id: 'fnd-2', name: 'Samaritan\'s Purse Donation', type: 'Donor' },
  { id: 'fnd-3', name: 'AIC Mission USA Grant', type: 'Donor' },
  { id: 'fnd-4', name: 'World Medical Mission', type: 'Donor' },
  { id: 'fnd-5', name: 'Kenya Ministry of Health', type: 'Government' },
  { id: 'fnd-6', name: 'Private Donor — Anonymous', type: 'Donor' },
  { id: 'fnd-7', name: 'County Government Elgeyo-Marakwet', type: 'Government' },
];

export const PERSONS = [
  { id: 'p-1', name: 'Dr. Joseph Kiptoo', role: 'Medical Director', email: 'jkiptoo@kapsowar.org', department: 'Administration', phone: '+254 722 100 001' },
  { id: 'p-2', name: 'Dr. Mary Chebet', role: 'Physician', email: 'mchebet@kapsowar.org', department: 'Internal Medicine', phone: '+254 722 100 002' },
  { id: 'p-3', name: 'Dr. Daniel Kibet', role: 'Surgeon', email: 'dkibet@kapsowar.org', department: 'Surgery', phone: '+254 722 100 003' },
  { id: 'p-4', name: 'Sr. Esther Chemutai', role: 'Matron', email: 'echemutai@kapsowar.org', department: 'Nursing Services', phone: '+254 722 100 004' },
  { id: 'p-5', name: 'Eng. Brian Kimutai', role: 'Biomedical Engineer', email: 'bkimutai@kapsowar.org', department: 'Biomedical Engineering', phone: '+254 722 100 005' },
  { id: 'p-6', name: 'Pharm. Wilson Kiprop', role: 'Chief Pharmacist', email: 'wkiprop@kapsowar.org', department: 'Pharmacy', phone: '+254 722 100 006' },
  { id: 'p-7', name: 'Mr. Kevin Ruto', role: 'IT Manager', email: 'kruto@kapsowar.org', department: 'IT Department', phone: '+254 722 100 007' },
  { id: 'p-8', name: 'Dr. Grace Jepkemboi', role: 'OBGYN', email: 'gjepkemboi@kapsowar.org', department: 'Obstetrics & Gynaecology', phone: '+254 722 100 008' },
];

export const STATUSES = ['In Service', 'In Storage', 'Under Maintenance', 'Checked Out', 'Leased', 'Reserved', 'Disposed', 'Lost'];

export const ASSETS = [
  { id: 'A-00001', tag: 'AICK-MED-00001', name: 'Philips IntelliVue MX450 Patient Monitor', category: 'Medical Equipment', categoryId: 'cat-1', location: 'Operating Theatre 1', locationId: 'loc-4', department: 'Surgery', status: 'In Service', purchaseDate: '2023-03-12', purchaseCost: 485000, vendor: 'Philips Healthcare East Africa', serialNumber: 'PH-MX450-K2023-0012', warrantyExpiry: '2026-03-12', assignedTo: 'Dr. Daniel Kibet', condition: 'Excellent', fundingSource: 'Samaritan\'s Purse Donation' },
  { id: 'A-00002', tag: 'AICK-MED-00002', name: 'GE Logiq P9 Ultrasound', category: 'Medical Equipment', categoryId: 'cat-1', location: 'Maternity Ward', locationId: 'loc-2', department: 'Obstetrics & Gynaecology', status: 'In Service', purchaseDate: '2022-08-20', purchaseCost: 1250000, vendor: 'GE Healthcare Kenya', serialNumber: 'GE-LP9-2022-0445', warrantyExpiry: '2025-08-20', assignedTo: 'Dr. Grace Jepkemboi', condition: 'Good', fundingSource: 'World Medical Mission' },
  { id: 'A-00003', tag: 'AICK-MED-00003', name: 'Anaesthesia Machine — Mindray WATO EX-65', category: 'Medical Equipment', categoryId: 'cat-1', location: 'Operating Theatre 2', locationId: 'loc-5', department: 'Surgery', status: 'In Service', purchaseDate: '2024-01-15', purchaseCost: 920000, vendor: 'Mediquip Kenya', serialNumber: 'MR-WATO-2024-0089', warrantyExpiry: '2027-01-15', assignedTo: 'Dr. Daniel Kibet', condition: 'Excellent', fundingSource: 'AIC Mission USA Grant' },
  { id: 'A-00004', tag: 'AICK-IT-00001', name: 'Dell OptiPlex 7090 Desktop', category: 'IT & Computers', categoryId: 'cat-2', location: 'Administration Block', locationId: 'loc-10', department: 'Administration', status: 'In Service', purchaseDate: '2024-05-10', purchaseCost: 95000, vendor: 'Crown Healthcare', serialNumber: 'DL-OPX-7090-K0234', warrantyExpiry: '2027-05-10', assignedTo: 'Dr. Joseph Kiptoo', condition: 'Excellent', fundingSource: 'Hospital Operations Budget' },
  { id: 'A-00005', tag: 'AICK-VEH-00001', name: 'Toyota Land Cruiser Ambulance', category: 'Vehicles', categoryId: 'cat-4', location: 'Main Hospital Building', locationId: 'loc-1', department: 'Administration', status: 'In Service', purchaseDate: '2021-11-05', purchaseCost: 6800000, vendor: 'Crown Healthcare', serialNumber: 'KCA-123X', warrantyExpiry: '2024-11-05', assignedTo: 'Hospital Pool', condition: 'Good', fundingSource: 'Samaritan\'s Purse Donation' },
  { id: 'A-00006', tag: 'AICK-LAB-00001', name: 'Sysmex XN-550 Haematology Analyzer', category: 'Laboratory', categoryId: 'cat-5', location: 'Laboratory', locationId: 'loc-7', department: 'Laboratory', status: 'Under Maintenance', purchaseDate: '2023-06-18', purchaseCost: 1450000, vendor: 'Mediquip Kenya', serialNumber: 'SYS-XN550-2023-0078', warrantyExpiry: '2026-06-18', assignedTo: 'Mr. Eric Cheruiyot', condition: 'Fair', fundingSource: 'World Medical Mission' },
  { id: 'A-00007', tag: 'AICK-PWR-00001', name: 'Cummins 250kVA Diesel Generator', category: 'Generators & Power', categoryId: 'cat-8', location: 'Main Hospital Building', locationId: 'loc-1', department: 'Administration', status: 'In Service', purchaseDate: '2020-02-14', purchaseCost: 3200000, vendor: 'Davis & Shirtliff', serialNumber: 'CUM-250-2020-0011', warrantyExpiry: '2023-02-14', assignedTo: 'Eng. Brian Kimutai', condition: 'Good', fundingSource: 'AIC Mission USA Grant' },
  { id: 'A-00008', tag: 'AICK-MED-00004', name: 'Drager Babylog 8000 Ventilator', category: 'Medical Equipment', categoryId: 'cat-1', location: "Children's Ward", locationId: 'loc-3', department: 'Paediatrics', status: 'In Service', purchaseDate: '2022-12-01', purchaseCost: 780000, vendor: 'Philips Healthcare East Africa', serialNumber: 'DR-BL8K-2022-0034', warrantyExpiry: '2025-12-01', assignedTo: 'Dr. Samuel Rotich', condition: 'Excellent', fundingSource: 'World Medical Mission' },
  { id: 'A-00009', tag: 'AICK-SUR-00001', name: 'Surgical Operating Table — Mizuho OSI', category: 'Surgical Instruments', categoryId: 'cat-6', location: 'Operating Theatre 1', locationId: 'loc-4', department: 'Surgery', status: 'In Service', purchaseDate: '2021-04-22', purchaseCost: 1850000, vendor: 'Mediquip Kenya', serialNumber: 'MZ-OSI-2021-0009', warrantyExpiry: '2024-04-22', assignedTo: 'Dr. Daniel Kibet', condition: 'Good', fundingSource: 'AIC Mission USA Grant' },
  { id: 'A-00010', tag: 'AICK-IT-00002', name: 'HP LaserJet Pro M404dn Printer', category: 'IT & Computers', categoryId: 'cat-2', location: 'Outpatient Clinic', locationId: 'loc-6', department: 'Internal Medicine', status: 'Checked Out', purchaseDate: '2024-02-28', purchaseCost: 38000, vendor: 'Crown Healthcare', serialNumber: 'HP-M404-K0567', warrantyExpiry: '2026-02-28', assignedTo: 'Dr. Mary Chebet', condition: 'Excellent', fundingSource: 'Hospital Operations Budget' },
  { id: 'A-00011', tag: 'AICK-FUR-00001', name: 'Hospital Bed — Hill-Rom 900', category: 'Furniture', categoryId: 'cat-3', location: 'Maternity Ward', locationId: 'loc-2', department: 'Obstetrics & Gynaecology', status: 'In Service', purchaseDate: '2023-09-05', purchaseCost: 285000, vendor: 'Surgipharm Ltd', serialNumber: 'HR-900-2023-0156', warrantyExpiry: '2026-09-05', assignedTo: 'Sr. Esther Chemutai', condition: 'Good', fundingSource: 'Samaritan\'s Purse Donation' },
  { id: 'A-00012', tag: 'AICK-MED-00005', name: 'Defibrillator — Philips HeartStart XL+', category: 'Medical Equipment', categoryId: 'cat-1', location: 'Operating Theatre 1', locationId: 'loc-4', department: 'Surgery', status: 'Reserved', purchaseDate: '2024-07-12', purchaseCost: 425000, vendor: 'Philips Healthcare East Africa', serialNumber: 'PH-HSXL-2024-0023', warrantyExpiry: '2027-07-12', assignedTo: 'Dr. Daniel Kibet', condition: 'Excellent', fundingSource: 'World Medical Mission' },
];

export const MAINTENANCE_RECORDS = [
  { id: 'm-1', assetId: 'A-00006', assetName: 'Sysmex XN-550 Haematology Analyzer', type: 'Corrective', date: '2025-06-15', technician: 'Eng. Brian Kimutai', cost: 28000, status: 'In Progress', notes: 'Replacement of reagent probe; awaiting parts from Nairobi' },
  { id: 'm-2', assetId: 'A-00007', assetName: 'Cummins 250kVA Diesel Generator', type: 'Preventive', date: '2025-07-01', technician: 'Davis & Shirtliff Tech', cost: 45000, status: 'Scheduled', notes: 'Quarterly service: oil change, filter replacement' },
  { id: 'm-3', assetId: 'A-00002', assetName: 'GE Logiq P9 Ultrasound', type: 'Preventive', date: '2025-05-20', technician: 'GE Service Engineer', cost: 35000, status: 'Completed', notes: 'Annual calibration and probe check — all parameters within spec' },
  { id: 'm-4', assetId: 'A-00003', assetName: 'Anaesthesia Machine — Mindray WATO EX-65', type: 'Preventive', date: '2025-08-10', technician: 'Mediquip Tech', cost: 22000, status: 'Scheduled', notes: 'Bi-annual service and gas calibration' },
  { id: 'm-5', assetId: 'A-00005', assetName: 'Toyota Land Cruiser Ambulance', type: 'Corrective', date: '2025-06-28', technician: 'Hospital Mechanic', cost: 18500, status: 'Completed', notes: 'Brake pad replacement, oil service' },
];

export const WARRANTIES = ASSETS.filter((a) => a.warrantyExpiry).map((a) => ({
  id: `w-${a.id}`,
  assetId: a.id,
  assetName: a.name,
  vendor: a.vendor,
  startDate: a.purchaseDate,
  endDate: a.warrantyExpiry,
  status: new Date(a.warrantyExpiry) > new Date() ? 'Active' : 'Expired',
}));

export const TRANSACTIONS = [
  { id: 't-1', type: 'Check Out', assetId: 'A-00010', assetName: 'HP LaserJet Pro M404dn Printer', person: 'Dr. Mary Chebet', date: '2025-07-02', notes: 'Temporary use in Outpatient' },
  { id: 't-2', type: 'Maintenance', assetId: 'A-00006', assetName: 'Sysmex XN-550 Haematology Analyzer', person: 'Eng. Brian Kimutai', date: '2025-06-15', notes: 'Probe replacement' },
  { id: 't-3', type: 'Reserve', assetId: 'A-00012', assetName: 'Defibrillator HeartStart XL+', person: 'Dr. Daniel Kibet', date: '2025-07-08', notes: 'Reserved for surgery on 2025-07-15' },
  { id: 't-4', type: 'Move', assetId: 'A-00011', assetName: 'Hospital Bed Hill-Rom 900', person: 'Sr. Esther Chemutai', date: '2025-06-30', notes: 'Moved from Storage to Maternity Ward' },
  { id: 't-5', type: 'Add', assetId: 'A-00012', assetName: 'Defibrillator HeartStart XL+', person: 'Dr. Joseph Kiptoo', date: '2024-07-12', notes: 'New asset registered' },
];

export const DASHBOARD_STATS = {
  totalAssets: ASSETS.length,
  totalValue: ASSETS.reduce((sum, a) => sum + a.purchaseCost, 0),
  inService: ASSETS.filter((a) => a.status === 'In Service').length,
  underMaintenance: ASSETS.filter((a) => a.status === 'Under Maintenance').length,
  checkedOut: ASSETS.filter((a) => a.status === 'Checked Out').length,
  warrantyExpiringSoon: WARRANTIES.filter((w) => {
    const days = (new Date(w.endDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days > 0 && days < 90;
  }).length,
};

export const SECURITY_GROUPS = [
  { id: 'sg-1', name: 'Super Admin', members: 2, permissions: 'Full access to all modules and settings' },
  { id: 'sg-2', name: 'Asset Manager', members: 3, permissions: 'Add/edit/delete assets, run reports' },
  { id: 'sg-3', name: 'Department Head', members: 12, permissions: 'View department assets, request maintenance' },
  { id: 'sg-4', name: 'Biomedical Engineer', members: 2, permissions: 'Maintenance, audits, full equipment access' },
  { id: 'sg-5', name: 'Read-Only Auditor', members: 4, permissions: 'View-only access for external audits' },
];

export const formatKSh = (amount) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);
