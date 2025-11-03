import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Stage = 'NOT_STARTED' | 'FABRICATION' | 'POWDER_COAT' | 'ASSEMBLY' | 'TESTING' | 'SHIPPING';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Pump {
  id: string;
  serialNumber: string;
  poId: string;
  model: string;
  customer: string;
  stage: Stage;
  priority: Priority;
  powderColor: string;
  value: number;
  promiseDate: string;
  lastUpdate: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  customer: string;
  dateReceived: string;
  promiseDate: string;
  totalValue: number;
  lineItems: LineItem[];
}

export interface LineItem {
  id: string;
  model: string;
  quantity: number;
  powderColor: string;
  priority: Priority;
  value: number;
  promiseDate?: string;
}

export interface Filters {
  search: string;
  po: string;
  customer: string;
  model: string;
  stage: Stage | '';
  priority: Priority | '';
}

interface StoreState {
  pumps: Pump[];
  purchaseOrders: PurchaseOrder[];
  filters: Filters;
  collapsedCards: boolean;
  
  setPumps: (pumps: Pump[]) => void;
  addPump: (pump: Pump) => void;
  updatePump: (id: string, updates: Partial<Pump>) => void;
  
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  
  toggleCollapsedCards: () => void;
  
  getFilteredPumps: () => Pump[];
}

// Mock seed data
const seedPumps: Pump[] = [
  {
    id: '1',
    serialNumber: 'SN-2024-001',
    poId: 'PO-001',
    model: 'HydroMax 3000',
    customer: 'Acme Manufacturing',
    stage: 'FABRICATION',
    priority: 'HIGH',
    powderColor: 'Blue RAL 5015',
    value: 12500,
    promiseDate: '2024-11-15',
    lastUpdate: '2024-10-20T10:30:00Z',
    createdAt: '2024-10-15T08:00:00Z',
  },
  {
    id: '2',
    serialNumber: 'SN-2024-002',
    poId: 'PO-001',
    model: 'HydroMax 3000',
    customer: 'Acme Manufacturing',
    stage: 'POWDER_COAT',
    priority: 'HIGH',
    powderColor: 'Blue RAL 5015',
    value: 12500,
    promiseDate: '2024-11-15',
    lastUpdate: '2024-10-21T14:20:00Z',
    createdAt: '2024-10-15T08:00:00Z',
  },
  {
    id: '3',
    serialNumber: 'SN-2024-003',
    poId: 'PO-002',
    model: 'FlowPro 500',
    customer: 'TechCorp Industries',
    stage: 'ASSEMBLY',
    priority: 'MEDIUM',
    powderColor: 'Gray RAL 7035',
    value: 8500,
    promiseDate: '2024-11-20',
    lastUpdate: '2024-10-22T09:15:00Z',
    createdAt: '2024-10-16T10:00:00Z',
  },
  {
    id: '4',
    serialNumber: 'SN-2024-004',
    poId: 'PO-002',
    model: 'FlowPro 500',
    customer: 'TechCorp Industries',
    stage: 'TESTING',
    priority: 'MEDIUM',
    powderColor: 'Gray RAL 7035',
    value: 8500,
    promiseDate: '2024-11-20',
    lastUpdate: '2024-10-22T16:45:00Z',
    createdAt: '2024-10-16T10:00:00Z',
  },
  {
    id: '5',
    serialNumber: 'SN-2024-005',
    poId: 'PO-003',
    model: 'MegaPump 2000',
    customer: 'Global Systems',
    stage: 'NOT_STARTED',
    priority: 'URGENT',
    powderColor: 'Red RAL 3000',
    value: 15000,
    promiseDate: '2024-11-10',
    lastUpdate: '2024-10-23T08:00:00Z',
    createdAt: '2024-10-23T08:00:00Z',
  },
  {
    id: '6',
    serialNumber: 'SN-2024-006',
    poId: 'PO-004',
    model: 'CompactFlow 100',
    customer: 'MiniTech Ltd',
    stage: 'SHIPPING',
    priority: 'LOW',
    powderColor: 'White RAL 9016',
    value: 4500,
    promiseDate: '2024-11-05',
    lastUpdate: '2024-10-23T11:30:00Z',
    createdAt: '2024-10-10T09:00:00Z',
  },
];

const seedPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-001',
    customer: 'Acme Manufacturing',
    dateReceived: '2024-10-15',
    promiseDate: '2024-11-15',
    totalValue: 25000,
    lineItems: [
      {
        id: 'L1',
        model: 'HydroMax 3000',
        quantity: 2,
        powderColor: 'Blue RAL 5015',
        priority: 'HIGH',
        value: 12500,
      },
    ],
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-002',
    customer: 'TechCorp Industries',
    dateReceived: '2024-10-16',
    promiseDate: '2024-11-20',
    totalValue: 17000,
    lineItems: [
      {
        id: 'L2',
        model: 'FlowPro 500',
        quantity: 2,
        powderColor: 'Gray RAL 7035',
        priority: 'MEDIUM',
        value: 8500,
      },
    ],
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2024-003',
    customer: 'Global Systems',
    dateReceived: '2024-10-23',
    promiseDate: '2024-11-10',
    totalValue: 15000,
    lineItems: [
      {
        id: 'L3',
        model: 'MegaPump 2000',
        quantity: 1,
        powderColor: 'Red RAL 3000',
        priority: 'URGENT',
        value: 15000,
      },
    ],
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2024-004',
    customer: 'MiniTech Ltd',
    dateReceived: '2024-10-10',
    promiseDate: '2024-11-05',
    totalValue: 4500,
    lineItems: [
      {
        id: 'L4',
        model: 'CompactFlow 100',
        quantity: 1,
        powderColor: 'White RAL 9016',
        priority: 'LOW',
        value: 4500,
      },
    ],
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      pumps: seedPumps,
      purchaseOrders: seedPurchaseOrders,
      filters: {
        search: '',
        po: '',
        customer: '',
        model: '',
        stage: '',
        priority: '',
      },
      collapsedCards: false,

      setPumps: (pumps) => set({ pumps }),
      
      addPump: (pump) => set((state) => ({ 
        pumps: [...state.pumps, pump] 
      })),
      
      updatePump: (id, updates) => set((state) => ({
        pumps: state.pumps.map((p) => 
          p.id === id ? { ...p, ...updates, lastUpdate: new Date().toISOString() } : p
        ),
      })),

      addPurchaseOrder: (po) => set((state) => ({
        purchaseOrders: [...state.purchaseOrders, po],
      })),

      updatePurchaseOrder: (id, updates) => set((state) => ({
        purchaseOrders: state.purchaseOrders.map((po) =>
          po.id === id ? { ...po, ...updates } : po
        ),
      })),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

      clearFilters: () => set({
        filters: {
          search: '',
          po: '',
          customer: '',
          model: '',
          stage: '',
          priority: '',
        },
      }),

      toggleCollapsedCards: () => set((state) => ({
        collapsedCards: !state.collapsedCards,
      })),

      getFilteredPumps: () => {
        const { pumps, filters } = get();
        return pumps.filter((pump) => {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = !filters.search || 
            pump.serialNumber.toLowerCase().includes(searchLower) ||
            pump.model.toLowerCase().includes(searchLower) ||
            pump.customer.toLowerCase().includes(searchLower);

          const matchesPO = !filters.po || pump.poId.includes(filters.po);
          const matchesCustomer = !filters.customer || pump.customer === filters.customer;
          const matchesModel = !filters.model || pump.model === filters.model;
          const matchesStage = !filters.stage || pump.stage === filters.stage;
          const matchesPriority = !filters.priority || pump.priority === filters.priority;

          return matchesSearch && matchesPO && matchesCustomer && matchesModel && matchesStage && matchesPriority;
        });
      },
    }),
    {
      name: 'pumptracker-storage',
    }
  )
);
