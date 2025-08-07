import { Invoice, CreditNote } from '../types/invoice';

// Generate realistic dummy data for August 2025 (current month)
export const augustInvoices: Invoice[] = [
  {
    id: 'aug-1',
    invoiceNumber: 'SYS-2025-245',
    supplier: 'Sysco Corporation',
    supplierAddress: '1390 Enclave Parkway\nHouston, TX 77077',
    date: new Date('2025-08-01'),
    subtotal: 1456.80,
    tax: 116.54,
    total: 1573.34,
    imageUrl: undefined,
    scannedAt: new Date('2025-08-01T09:15:00'),
    status: 'fully_delivered',
    notes: 'August opening weekend prep - premium cuts',
    items: [
      {
        id: 'aug-1-1',
        description: 'Wagyu Ribeye Steaks - A5 Grade, 14oz',
        quantity: 12,
        unitPrice: 89.50,
        totalPrice: 1074.00,
        category: 'Meat',
        batchCode: 'WAG250801A',
        delivered: true,
        deliveryDate: new Date('2025-08-01')
      },
      {
        id: 'aug-1-2',
        description: 'Fresh Maine Lobster - 2 lb each',
        quantity: 8,
        unitPrice: 24.75,
        totalPrice: 198.00,
        category: 'Seafood',
        batchCode: 'LOB250731B',
        delivered: true,
        deliveryDate: new Date('2025-08-01')
      },
      {
        id: 'aug-1-3',
        description: 'Microgreens Assortment - 4oz containers',
        quantity: 15,
        unitPrice: 12.32,
        totalPrice: 184.80,
        category: 'Vegetables',
        batchCode: 'MIC250730C',
        delivered: true,
        deliveryDate: new Date('2025-08-01')
      }
    ]
  },
  {
    id: 'aug-2',
    invoiceNumber: 'USF-2025-378',
    supplier: 'US Foods',
    supplierAddress: '9399 W Higgins Rd\nRosemont, IL 60018',
    date: new Date('2025-08-03'),
    subtotal: 892.45,
    tax: 71.40,
    total: 963.85,
    imageUrl: undefined,
    scannedAt: new Date('2025-08-03T14:30:00'),
    status: 'pending',
    notes: 'Weekend special menu items',
    items: [
      {
        id: 'aug-2-1',
        description: 'Dry-Aged Duck Breast - Muscovy',
        quantity: 16,
        unitPrice: 18.95,
        totalPrice: 303.20,
        category: 'Poultry',
        batchCode: 'DUK250803D',
        delivered: false
      },
      {
        id: 'aug-2-2',
        description: 'Diver Scallops - U8 size, dry pack',
        quantity: 10,
        unitPrice: 32.50,
        totalPrice: 325.00,
        category: 'Seafood',
        batchCode: 'SCA250802E',
        delivered: false
      },
      {
        id: 'aug-2-3',
        description: 'Heirloom Beets - Rainbow variety',
        quantity: 12,
        unitPrice: 13.69,
        totalPrice: 164.28,
        category: 'Vegetables',
        batchCode: 'BET250801F',
        delivered: false
      },
      {
        id: 'aug-2-4',
        description: 'Artisanal Goat Cheese - 8oz logs',
        quantity: 8,
        unitPrice: 25.00,
        totalPrice: 200.00,
        category: 'Dairy',
        batchCode: 'GCH250731G',
        delivered: false
      }
    ]
  },
  {
    id: 'aug-3',
    invoiceNumber: 'PFG-2025-501',
    supplier: 'Performance Food Group',
    supplierAddress: '12500 West Creek Parkway\nRichmond, VA 23238',
    date: new Date('2025-08-05'),
    subtotal: 2145.90,
    tax: 171.67,
    total: 2317.57,
    imageUrl: undefined,
    scannedAt: new Date('2025-08-05T11:45:00'),
    status: 'partially_delivered',
    notes: 'Ultra-premium ingredients for tasting menu',
    items: [
      {
        id: 'aug-3-1',
        description: 'White Alba Truffle - Fresh, 50g',
        quantity: 3,
        unitPrice: 485.00,
        totalPrice: 1455.00,
        category: 'Specialty',
        batchCode: 'WTR250805H',
        delivered: true,
        deliveryDate: new Date('2025-08-06')
      },
      {
        id: 'aug-3-2',
        description: 'Beluga Caviar - Imperial Grade, 50g',
        quantity: 2,
        unitPrice: 295.50,
        totalPrice: 591.00,
        category: 'Specialty',
        batchCode: 'BEL250804I',
        delivered: false
      },
      {
        id: 'aug-3-3',
        description: 'Edible Gold Leaf - 23k, 10 sheets',
        quantity: 1,
        unitPrice: 99.90,
        totalPrice: 99.90,
        category: 'Specialty',
        delivered: true,
        deliveryDate: new Date('2025-08-06')
      }
    ]
  },
  {
    id: 'aug-4',
    invoiceNumber: 'RD-2025-934',
    supplier: 'Restaurant Depot',
    supplierAddress: '4301 Oak Circle\nBoca Raton, FL 33431',
    date: new Date('2025-08-06'),
    subtotal: 678.25,
    tax: 54.26,
    total: 732.51,
    imageUrl: undefined,
    scannedAt: new Date('2025-08-06T16:20:00'),
    status: 'fully_delivered',
    notes: 'Weekly pantry and supplies order',
    items: [
      {
        id: 'aug-4-1',
        description: 'San Marzano Tomatoes - DOP, 28oz cans',
        quantity: 24,
        unitPrice: 12.95,
        totalPrice: 310.80,
        category: 'Pantry',
        delivered: true,
        deliveryDate: new Date('2025-08-07')
      },
      {
        id: 'aug-4-2',
        description: 'Parmigiano Reggiano - 36 month aged, 5 lb',
        quantity: 3,
        unitPrice: 89.75,
        totalPrice: 269.25,
        category: 'Dairy',
        batchCode: 'PAR250806J',
        delivered: true,
        deliveryDate: new Date('2025-08-07')
      },
      {
        id: 'aug-4-3',
        description: 'Extra Virgin Olive Oil - Cold Press, 1L',
        quantity: 6,
        unitPrice: 16.37,
        totalPrice: 98.22,
        category: 'Pantry',
        batchCode: 'OLV250805K',
        delivered: true,
        deliveryDate: new Date('2025-08-07')
      }
    ]
  },
  {
    id: 'aug-5',
    invoiceNumber: 'BEV-2025-189',
    supplier: 'Beverage Distributors Inc',
    supplierAddress: '2250 Industrial Blvd\nAtlanta, GA 30318',
    date: new Date('2025-08-07'),
    subtotal: 1234.80,
    tax: 98.78,
    total: 1333.58,
    imageUrl: undefined,
    scannedAt: new Date('2025-08-07T13:10:00'),
    status: 'pending',
    notes: 'Premium wine selection for August wine pairing dinners',
    items: [
      {
        id: 'aug-5-1',
        description: 'Burgundy - Domaine de la Côte 2020',
        quantity: 6,
        unitPrice: 125.00,
        totalPrice: 750.00,
        category: 'Wine',
        delivered: false
      },
      {
        id: 'aug-5-2',
        description: 'Champagne - Krug Grande Cuvée',
        quantity: 4,
        unitPrice: 89.50,
        totalPrice: 358.00,
        category: 'Wine',
        delivered: false
      },
      {
        id: 'aug-5-3',
        description: 'Japanese Whisky - Hibiki 21yr',
        quantity: 1,
        unitPrice: 126.80,
        totalPrice: 126.80,
        category: 'Spirits',
        delivered: false
      }
    ]
  },
  {
    id: 'aug-6',
    invoiceNumber: 'GFS-2025-156',
    supplier: 'Gordon Food Service',
    supplierAddress: '1300 Gezon Parkway SW\nWyoming, MI 49509',
    date: new Date('2025-08-07'),
    subtotal: 756.40,
    tax: 60.51,
    total: 816.91,
    imageUrl: undefined,
    scannedAt: new Date('2025-08-07T18:45:00'),
    status: 'fully_delivered',
    notes: 'Today\'s fresh delivery - current week items',
    items: [
      {
        id: 'aug-6-1',
        description: 'Free Range Chicken Breast - Boneless',
        quantity: 20,
        unitPrice: 18.75,
        totalPrice: 375.00,
        category: 'Poultry',
        batchCode: 'CHK250807L',
        delivered: true,
        deliveryDate: new Date('2025-08-07')
      },
      {
        id: 'aug-6-2',
        description: 'Wild Caught Salmon - Atlantic, fillets',
        quantity: 15,
        unitPrice: 22.50,
        totalPrice: 337.50,
        category: 'Seafood',
        batchCode: 'SAL250806M',
        delivered: true,
        deliveryDate: new Date('2025-08-07')
      },
      {
        id: 'aug-6-3',
        description: 'Baby Spinach - Organic, 5 lb cases',
        quantity: 4,
        unitPrice: 10.98,
        totalPrice: 43.92,
        category: 'Vegetables',
        batchCode: 'SPN250805N',
        delivered: true,
        deliveryDate: new Date('2025-08-07')
      }
    ]
  }
];

export const augustCreditNotes: CreditNote[] = [
  {
    id: 'aug-cn-1',
    creditNoteNumber: 'PFG-CN-2025-045',
    supplier: 'Performance Food Group',
    date: new Date('2025-08-06'),
    amount: 591.00,
    reason: 'Beluga caviar shipment delayed due to customs inspection',
    relatedInvoiceId: 'aug-3',
    appliedToInvoice: true,
    items: [
      {
        description: 'Beluga Caviar - Imperial Grade, 50g (delayed shipment)',
        amount: 591.00
      }
    ]
  },
  {
    id: 'aug-cn-2',
    creditNoteNumber: 'BEV-CN-2025-018',
    supplier: 'Beverage Distributors Inc',
    date: new Date('2025-08-07'),
    amount: 126.80,
    reason: 'Japanese whisky bottle arrived with damaged cork seal',
    relatedInvoiceId: 'aug-5',
    appliedToInvoice: false,
    items: [
      {
        description: 'Japanese Whisky - Hibiki 21yr (damaged cork)',
        amount: 126.80
      }
    ]
  }
];