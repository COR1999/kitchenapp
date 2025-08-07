import { Invoice, CreditNote } from '../types/invoice';

export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'SYS-2024-001',
    supplier: 'Sysco Corporation',
    supplierAddress: '1390 Enclave Parkway\nHouston, TX 77077',
    date: new Date('2024-01-15'),
    subtotal: 1247.85,
    tax: 99.83,
    total: 1347.68,
    imageUrl: undefined,
    scannedAt: new Date('2024-01-15T10:30:00'),
    status: 'partially_delivered',
    notes: 'Weekly produce and protein order',
    items: [
      {
        id: '1-1',
        description: 'Fresh Atlantic Salmon Fillets - 10 lbs',
        quantity: 2,
        unitPrice: 89.50,
        totalPrice: 179.00,
        category: 'Seafood',
        batchCode: 'SAL240115A',
        delivered: true,
        deliveryDate: new Date('2024-01-16')
      },
      {
        id: '1-2',
        description: 'Organic Baby Spinach - 5 lb cases',
        quantity: 4,
        unitPrice: 12.25,
        totalPrice: 49.00,
        category: 'Vegetables',
        batchCode: 'SPN240114B',
        delivered: true,
        deliveryDate: new Date('2024-01-16')
      },
      {
        id: '1-3',
        description: 'Premium Ground Beef 80/20 - 10 lb tubes',
        quantity: 6,
        unitPrice: 45.75,
        totalPrice: 274.50,
        category: 'Meat',
        batchCode: 'GBF240113C',
        delivered: false
      },
      {
        id: '1-4',
        description: 'Roma Tomatoes - 25 lb cases',
        quantity: 3,
        unitPrice: 18.95,
        totalPrice: 56.85,
        category: 'Vegetables',
        batchCode: 'TOM240112D',
        delivered: true,
        deliveryDate: new Date('2024-01-16')
      },
      {
        id: '1-5',
        description: 'Fresh Mozzarella Cheese - 5 lb blocks',
        quantity: 8,
        unitPrice: 23.75,
        totalPrice: 190.00,
        category: 'Dairy',
        batchCode: 'MOZ240111E',
        delivered: false
      },
      {
        id: '1-6',
        description: 'Extra Virgin Olive Oil - 3L bottles',
        quantity: 12,
        unitPrice: 15.50,
        totalPrice: 186.00,
        category: 'Pantry',
        batchCode: 'OLV240110F',
        delivered: true,
        deliveryDate: new Date('2024-01-16')
      },
      {
        id: '1-7',
        description: 'Yellow Onions - 50 lb bags',
        quantity: 2,
        unitPrice: 24.75,
        totalPrice: 49.50,
        category: 'Vegetables',
        delivered: false
      },
      {
        id: '1-8',
        description: 'Free Range Chicken Breasts - 40 lb cases',
        quantity: 5,
        unitPrice: 52.60,
        totalPrice: 263.00,
        category: 'Poultry',
        batchCode: 'CHK240109G',
        delivered: false
      }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'USF-2024-047',
    supplier: 'US Foods',
    supplierAddress: '9399 W Higgins Rd\nRosemont, IL 60018',
    date: new Date('2024-01-18'),
    subtotal: 892.40,
    tax: 71.39,
    total: 963.79,
    imageUrl: undefined,
    scannedAt: new Date('2024-01-18T14:15:00'),
    status: 'pending',
    notes: 'Emergency protein order for weekend service',
    items: [
      {
        id: '2-1',
        description: 'Ribeye Steaks 12oz - Prime Grade',
        quantity: 24,
        unitPrice: 18.95,
        totalPrice: 454.80,
        category: 'Meat',
        batchCode: 'RIB240118H',
        delivered: false
      },
      {
        id: '2-2',
        description: 'Jumbo Shrimp 16/20 ct - 5 lb bags',
        quantity: 8,
        unitPrice: 22.75,
        totalPrice: 182.00,
        category: 'Seafood',
        batchCode: 'SHR240117I',
        delivered: false
      },
      {
        id: '2-3',
        description: 'Duck Breasts - Pekin, 8oz portions',
        quantity: 16,
        unitPrice: 8.95,
        totalPrice: 143.20,
        category: 'Poultry',
        batchCode: 'DUK240116J',
        delivered: false
      },
      {
        id: '2-4',
        description: 'Lamb Rack - French Cut, 8 rib',
        quantity: 6,
        unitPrice: 18.40,
        totalPrice: 110.40,
        category: 'Meat',
        delivered: false
      }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'PFG-2024-0089',
    supplier: 'Performance Food Group',
    supplierAddress: '12500 West Creek Parkway\nRichmond, VA 23238',
    date: new Date('2024-01-20'),
    subtotal: 756.90,
    tax: 60.55,
    total: 817.45,
    imageUrl: undefined,
    scannedAt: new Date('2024-01-20T09:45:00'),
    status: 'fully_delivered',
    notes: 'Specialty ingredients for new menu items',
    items: [
      {
        id: '3-1',
        description: 'Truffle Oil - Black Truffle, 250ml',
        quantity: 6,
        unitPrice: 24.50,
        totalPrice: 147.00,
        category: 'Specialty',
        batchCode: 'TRF240120K',
        delivered: true,
        deliveryDate: new Date('2024-01-21')
      },
      {
        id: '3-2',
        description: 'Burrata Cheese - 4oz portions',
        quantity: 24,
        unitPrice: 3.75,
        totalPrice: 90.00,
        category: 'Dairy',
        batchCode: 'BUR240119L',
        delivered: true,
        deliveryDate: new Date('2024-01-21')
      },
      {
        id: '3-3',
        description: 'Prosciutto di Parma - 8 lb wheels',
        quantity: 2,
        unitPrice: 89.95,
        totalPrice: 179.90,
        category: 'Charcuterie',
        batchCode: 'PRO240118M',
        delivered: true,
        deliveryDate: new Date('2024-01-21')
      },
      {
        id: '3-4',
        description: 'Microgreens Mix - 4oz containers',
        quantity: 20,
        unitPrice: 4.25,
        totalPrice: 85.00,
        category: 'Vegetables',
        delivered: true,
        deliveryDate: new Date('2024-01-21')
      },
      {
        id: '3-5',
        description: 'Aged Balsamic Vinegar - 500ml bottles',
        quantity: 4,
        unitPrice: 18.50,
        totalPrice: 74.00,
        category: 'Pantry',
        batchCode: 'BAL240117N',
        delivered: true,
        deliveryDate: new Date('2024-01-21')
      },
      {
        id: '3-6',
        description: 'Wild Mushroom Medley - 5 lb cases',
        quantity: 6,
        unitPrice: 30.00,
        totalPrice: 180.00,
        category: 'Vegetables',
        batchCode: 'MSH240116O',
        delivered: true,
        deliveryDate: new Date('2024-01-21')
      }
    ]
  },
  {
    id: '4',
    invoiceNumber: 'RD-2024-156',
    supplier: 'Restaurant Depot',
    supplierAddress: '4301 Oak Circle\nBoca Raton, FL 33431',
    date: new Date('2024-01-22'),
    subtotal: 445.60,
    tax: 35.65,
    total: 481.25,
    imageUrl: undefined,
    scannedAt: new Date('2024-01-22T16:20:00'),
    status: 'pending',
    notes: 'Bulk pantry items and cleaning supplies',
    items: [
      {
        id: '4-1',
        description: 'All-Purpose Flour - 50 lb bags',
        quantity: 8,
        unitPrice: 18.95,
        totalPrice: 151.60,
        category: 'Pantry',
        batchCode: 'FLR240122P',
        delivered: false
      },
      {
        id: '4-2',
        description: 'Canola Oil - 35 lb containers',
        quantity: 4,
        unitPrice: 28.50,
        totalPrice: 114.00,
        category: 'Pantry',
        delivered: false
      },
      {
        id: '4-3',
        description: 'Sea Salt - Fine, 25 lb bags',
        quantity: 3,
        unitPrice: 12.75,
        totalPrice: 38.25,
        category: 'Pantry',
        delivered: false
      },
      {
        id: '4-4',
        description: 'Black Peppercorns - Whole, 5 lb containers',
        quantity: 2,
        unitPrice: 35.50,
        totalPrice: 71.00,
        category: 'Spices',
        batchCode: 'PEP240121Q',
        delivered: false
      },
      {
        id: '4-5',
        description: 'Paper Towels - Commercial Grade, 12 rolls',
        quantity: 6,
        unitPrice: 11.75,
        totalPrice: 70.50,
        category: 'Supplies',
        delivered: false
      }
    ]
  },
  {
    id: '5',
    invoiceNumber: 'BEV-2024-023',
    supplier: 'Beverage Distributors Inc',
    supplierAddress: '2250 Industrial Blvd\nAtlanta, GA 30318',
    date: new Date('2024-01-25'),
    subtotal: 678.90,
    tax: 54.31,
    total: 733.21,
    imageUrl: undefined,
    scannedAt: new Date('2024-01-25T11:10:00'),
    status: 'pending',
    notes: 'Wine and beverage restock for dining room',
    items: [
      {
        id: '5-1',
        description: 'Pinot Grigio - Casa Bella 2022, 12 bottles',
        quantity: 8,
        unitPrice: 45.50,
        totalPrice: 364.00,
        category: 'Wine',
        delivered: false
      },
      {
        id: '5-2',
        description: 'Craft Beer - IPA Variety Pack, 24 bottles',
        quantity: 6,
        unitPrice: 28.75,
        totalPrice: 172.50,
        category: 'Beer',
        delivered: false
      },
      {
        id: '5-3',
        description: 'San Pellegrino - 750ml bottles, case of 12',
        quantity: 4,
        unitPrice: 18.95,
        totalPrice: 75.80,
        category: 'Non-Alcoholic',
        delivered: false
      },
      {
        id: '5-4',
        description: 'Espresso Blend Coffee - 5 lb bags',
        quantity: 3,
        unitPrice: 22.20,
        totalPrice: 66.60,
        category: 'Beverages',
        delivered: false
      }
    ]
  }
];

export const dummyCreditNotes: CreditNote[] = [
  {
    id: 'cn-1',
    creditNoteNumber: 'SYS-CN-2024-001',
    supplier: 'Sysco Corporation',
    date: new Date('2024-01-17'),
    amount: 179.00,
    reason: 'Salmon fillets arrived damaged - temperature abuse during transport',
    relatedInvoiceId: '1',
    appliedToInvoice: true,
    items: [
      {
        description: 'Fresh Atlantic Salmon Fillets - 10 lbs (damaged)',
        amount: 179.00
      }
    ]
  },
  {
    id: 'cn-2',
    creditNoteNumber: 'USF-CN-2024-012',
    supplier: 'US Foods',
    date: new Date('2024-01-19'),
    amount: 110.40,
    reason: 'Lamb rack shipment cancelled - supplier out of stock',
    relatedInvoiceId: undefined,
    appliedToInvoice: false,
    items: [
      {
        description: 'Lamb Rack - French Cut, 8 rib (cancelled)',
        amount: 110.40
      }
    ]
  },
  {
    id: 'cn-3',
    creditNoteNumber: 'PFG-CN-2024-005',
    supplier: 'Performance Food Group',
    date: new Date('2024-01-23'),
    amount: 85.00,
    reason: 'Microgreens delivered past expiration date',
    relatedInvoiceId: undefined,
    appliedToInvoice: false,
    items: [
      {
        description: 'Microgreens Mix - 4oz containers (expired)',
        amount: 85.00
      }
    ]
  }
];