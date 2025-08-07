import { Invoice, CreditNote } from '../types/invoice';

// Generate realistic dummy data for July 2025 (last month)
export const lastMonthInvoices: Invoice[] = [
  {
    id: 'july-1',
    invoiceNumber: 'SYS-2025-189',
    supplier: 'Sysco Corporation',
    supplierAddress: '1390 Enclave Parkway\nHouston, TX 77077',
    date: new Date('2025-07-02'),
    subtotal: 1580.45,
    tax: 126.44,
    total: 1706.89,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-02T08:15:00'),
    status: 'fully_delivered',
    notes: 'Weekly protein and produce delivery',
    items: [
      {
        id: 'july-1-1',
        description: 'Prime Ribeye Steaks 12oz - Case of 20',
        quantity: 3,
        unitPrice: 185.50,
        totalPrice: 556.50,
        category: 'Meat',
        batchCode: 'RIB250702A',
        delivered: true,
        deliveryDate: new Date('2025-07-02')
      },
      {
        id: 'july-1-2',
        description: 'Fresh Boston Lobster Tails - 8oz',
        quantity: 24,
        unitPrice: 18.75,
        totalPrice: 450.00,
        category: 'Seafood',
        batchCode: 'LOB250701B',
        delivered: true,
        deliveryDate: new Date('2025-07-02')
      },
      {
        id: 'july-1-3',
        description: 'Organic Arugula - 5 lb cases',
        quantity: 6,
        unitPrice: 15.80,
        totalPrice: 94.80,
        category: 'Vegetables',
        batchCode: 'ARG250630C',
        delivered: true,
        deliveryDate: new Date('2025-07-02')
      },
      {
        id: 'july-1-4',
        description: 'San Marzano Tomatoes - 28oz cans',
        quantity: 12,
        unitPrice: 8.95,
        totalPrice: 107.40,
        category: 'Pantry',
        delivered: true,
        deliveryDate: new Date('2025-07-02')
      },
      {
        id: 'july-1-5',
        description: 'Truffle Butter - 8oz containers',
        quantity: 8,
        unitPrice: 45.95,
        totalPrice: 367.60,
        category: 'Specialty',
        batchCode: 'TRF250629D',
        delivered: true,
        deliveryDate: new Date('2025-07-02')
      }
    ]
  },
  {
    id: 'july-2',
    invoiceNumber: 'USF-2025-312',
    supplier: 'US Foods',
    supplierAddress: '9399 W Higgins Rd\nRosemont, IL 60018',
    date: new Date('2025-07-05'),
    subtotal: 892.30,
    tax: 71.38,
    total: 963.68,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-05T11:20:00'),
    status: 'partially_delivered',
    notes: 'Weekend special menu ingredients',
    items: [
      {
        id: 'july-2-1',
        description: 'Duck Breast - Pekin, Boneless',
        quantity: 18,
        unitPrice: 12.85,
        totalPrice: 231.30,
        category: 'Poultry',
        batchCode: 'DUK250705E',
        delivered: true,
        deliveryDate: new Date('2025-07-06')
      },
      {
        id: 'july-2-2',
        description: 'Wild Salmon Fillets - Norwegian',
        quantity: 15,
        unitPrice: 24.90,
        totalPrice: 373.50,
        category: 'Seafood',
        batchCode: 'SAL250704F',
        delivered: false
      },
      {
        id: 'july-2-3',
        description: 'Heirloom Tomatoes - Mixed Colors',
        quantity: 8,
        unitPrice: 18.50,
        totalPrice: 148.00,
        category: 'Vegetables',
        batchCode: 'HTM250703G',
        delivered: true,
        deliveryDate: new Date('2025-07-06')
      },
      {
        id: 'july-2-4',
        description: 'Burrata Cheese - 4oz portions',
        quantity: 20,
        unitPrice: 6.95,
        totalPrice: 139.00,
        category: 'Dairy',
        batchCode: 'BUR250702H',
        delivered: false
      }
    ]
  },
  {
    id: 'july-3',
    invoiceNumber: 'PFG-2025-445',
    supplier: 'Performance Food Group',
    supplierAddress: '12500 West Creek Parkway\nRichmond, VA 23238',
    date: new Date('2025-07-08'),
    subtotal: 1245.75,
    tax: 99.66,
    total: 1345.41,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-08T14:45:00'),
    status: 'pending',
    notes: 'Specialty ingredients for new summer menu',
    items: [
      {
        id: 'july-3-1',
        description: 'Black Truffle - Fresh, Grade A',
        quantity: 2,
        unitPrice: 395.00,
        totalPrice: 790.00,
        category: 'Specialty',
        batchCode: 'BTR250708I',
        delivered: false
      },
      {
        id: 'july-3-2',
        description: 'Wagyu Beef Tenderloin - A5 Grade',
        quantity: 1,
        unitPrice: 285.75,
        totalPrice: 285.75,
        category: 'Meat',
        batchCode: 'WAG250707J',
        delivered: false
      },
      {
        id: 'july-3-3',
        description: 'Oysters - Blue Point, Live',
        quantity: 50,
        unitPrice: 3.40,
        totalPrice: 170.00,
        category: 'Seafood',
        batchCode: 'OYS250706K',
        delivered: false
      }
    ]
  },
  {
    id: 'july-4',
    invoiceNumber: 'RD-2025-890',
    supplier: 'Restaurant Depot',
    supplierAddress: '4301 Oak Circle\nBoca Raton, FL 33431',
    date: new Date('2025-07-10'),
    subtotal: 678.90,
    tax: 54.31,
    total: 733.21,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-10T09:30:00'),
    status: 'fully_delivered',
    notes: 'Bulk pantry restocking',
    items: [
      {
        id: 'july-4-1',
        description: 'Extra Virgin Olive Oil - 3L bottles',
        quantity: 12,
        unitPrice: 22.50,
        totalPrice: 270.00,
        category: 'Pantry',
        batchCode: 'OLV250710L',
        delivered: true,
        deliveryDate: new Date('2025-07-11')
      },
      {
        id: 'july-4-2',
        description: 'Sea Salt - Coarse, 25 lb bags',
        quantity: 6,
        unitPrice: 18.95,
        totalPrice: 113.70,
        category: 'Spices',
        delivered: true,
        deliveryDate: new Date('2025-07-11')
      },
      {
        id: 'july-4-3',
        description: 'Parmigiano Reggiano - 24 month aged',
        quantity: 4,
        unitPrice: 73.80,
        totalPrice: 295.20,
        category: 'Dairy',
        batchCode: 'PAR250709M',
        delivered: true,
        deliveryDate: new Date('2025-07-11')
      }
    ]
  },
  {
    id: 'july-5',
    invoiceNumber: 'BEV-2025-156',
    supplier: 'Beverage Distributors Inc',
    supplierAddress: '2250 Industrial Blvd\nAtlanta, GA 30318',
    date: new Date('2025-07-12'),
    subtotal: 945.60,
    tax: 75.65,
    total: 1021.25,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-12T16:15:00'),
    status: 'partially_delivered',
    notes: 'Summer wine selection and premium spirits',
    items: [
      {
        id: 'july-5-1',
        description: 'Champagne - Dom Perignon 2018',
        quantity: 6,
        unitPrice: 89.50,
        totalPrice: 537.00,
        category: 'Wine',
        delivered: true,
        deliveryDate: new Date('2025-07-13')
      },
      {
        id: 'july-5-2',
        description: 'Gin - Hendricks, 750ml',
        quantity: 8,
        unitPrice: 28.95,
        totalPrice: 231.60,
        category: 'Spirits',
        delivered: false
      },
      {
        id: 'july-5-3',
        description: 'Craft Beer - Summer IPA, 24-pack',
        quantity: 6,
        unitPrice: 29.50,
        totalPrice: 177.00,
        category: 'Beer',
        delivered: true,
        deliveryDate: new Date('2025-07-13')
      }
    ]
  },
  {
    id: 'july-6',
    invoiceNumber: 'SYS-2025-201',
    supplier: 'Sysco Corporation',
    supplierAddress: '1390 Enclave Parkway\nHouston, TX 77077',
    date: new Date('2025-07-15'),
    subtotal: 1156.80,
    tax: 92.54,
    total: 1249.34,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-15T07:45:00'),
    status: 'fully_delivered',
    notes: 'Mid-month produce and dairy order',
    items: [
      {
        id: 'july-6-1',
        description: 'Free Range Chicken Thighs - 40 lb case',
        quantity: 4,
        unitPrice: 68.90,
        totalPrice: 275.60,
        category: 'Poultry',
        batchCode: 'CHK250715N',
        delivered: true,
        deliveryDate: new Date('2025-07-16')
      },
      {
        id: 'july-6-2',
        description: 'Fresh Mozzarella - Whole Milk, 5 lb',
        quantity: 8,
        unitPrice: 32.45,
        totalPrice: 259.60,
        category: 'Dairy',
        batchCode: 'MOZ250714O',
        delivered: true,
        deliveryDate: new Date('2025-07-16')
      },
      {
        id: 'july-6-3',
        description: 'Baby Mixed Greens - 5 lb cases',
        quantity: 12,
        unitPrice: 16.80,
        totalPrice: 201.60,
        category: 'Vegetables',
        batchCode: 'BMG250713P',
        delivered: true,
        deliveryDate: new Date('2025-07-16')
      },
      {
        id: 'july-6-4',
        description: 'Heavy Cream - 36% fat, quarts',
        quantity: 24,
        unitPrice: 9.15,
        totalPrice: 219.60,
        category: 'Dairy',
        batchCode: 'CRM250712Q',
        delivered: true,
        deliveryDate: new Date('2025-07-16')
      },
      {
        id: 'july-6-5',
        description: 'Lemons - Organic, 40 lb cases',
        quantity: 5,
        unitPrice: 40.08,
        totalPrice: 200.40,
        category: 'Vegetables',
        batchCode: 'LEM250711R',
        delivered: true,
        deliveryDate: new Date('2025-07-16')
      }
    ]
  },
  {
    id: 'july-7',
    invoiceNumber: 'USF-2025-334',
    supplier: 'US Foods',
    supplierAddress: '9399 W Higgins Rd\nRosemont, IL 60018',
    date: new Date('2025-07-18'),
    subtotal: 756.40,
    tax: 60.51,
    total: 816.91,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-18T13:20:00'),
    status: 'pending',
    notes: 'Emergency seafood order for weekend special',
    items: [
      {
        id: 'july-7-1',
        description: 'Chilean Sea Bass Fillets - 8oz',
        quantity: 16,
        unitPrice: 28.75,
        totalPrice: 460.00,
        category: 'Seafood',
        batchCode: 'CSB250718S',
        delivered: false
      },
      {
        id: 'july-7-2',
        description: 'King Crab Legs - Alaskan, 10 lbs',
        quantity: 2,
        unitPrice: 148.20,
        totalPrice: 296.40,
        category: 'Seafood',
        batchCode: 'KCR250717T',
        delivered: false
      }
    ]
  },
  {
    id: 'july-8',
    invoiceNumber: 'PFG-2025-467',
    supplier: 'Performance Food Group',
    supplierAddress: '12500 West Creek Parkway\nRichmond, VA 23238',
    date: new Date('2025-07-20'),
    subtotal: 892.15,
    tax: 71.37,
    total: 963.52,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-20T10:10:00'),
    status: 'fully_delivered',
    notes: 'Premium ingredients for chef tasting menu',
    items: [
      {
        id: 'july-8-1',
        description: 'Foie Gras - Grade A, Whole Lobe',
        quantity: 2,
        unitPrice: 185.50,
        totalPrice: 371.00,
        category: 'Specialty',
        batchCode: 'FOI250720U',
        delivered: true,
        deliveryDate: new Date('2025-07-21')
      },
      {
        id: 'july-8-2',
        description: 'Caviar - Ossetra, 30g tins',
        quantity: 4,
        unitPrice: 95.75,
        totalPrice: 383.00,
        category: 'Specialty',
        batchCode: 'CAV250719V',
        delivered: true,
        deliveryDate: new Date('2025-07-21')
      },
      {
        id: 'july-8-3',
        description: 'White Asparagus - Jumbo, 5 lb bundles',
        quantity: 3,
        unitPrice: 46.05,
        totalPrice: 138.15,
        category: 'Vegetables',
        batchCode: 'ASP250718W',
        delivered: true,
        deliveryDate: new Date('2025-07-21')
      }
    ]
  },
  {
    id: 'july-9',
    invoiceNumber: 'RD-2025-912',
    supplier: 'Restaurant Depot',
    supplierAddress: '4301 Oak Circle\nBoca Raton, FL 33431',
    date: new Date('2025-07-22'),
    subtotal: 543.80,
    tax: 43.50,
    total: 587.30,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-22T15:35:00'),
    status: 'partially_delivered',
    notes: 'Weekly supplies and cleaning products',
    items: [
      {
        id: 'july-9-1',
        description: 'All-Purpose Flour - 50 lb bags',
        quantity: 6,
        unitPrice: 24.95,
        totalPrice: 149.70,
        category: 'Pantry',
        batchCode: 'FLR250722X',
        delivered: true,
        deliveryDate: new Date('2025-07-23')
      },
      {
        id: 'july-9-2',
        description: 'Commercial Bleach - Gallon jugs',
        quantity: 8,
        unitPrice: 12.50,
        totalPrice: 100.00,
        category: 'Supplies',
        delivered: false
      },
      {
        id: 'july-9-3',
        description: 'Paper Towels - 12-roll cases',
        quantity: 10,
        unitPrice: 18.95,
        totalPrice: 189.50,
        category: 'Supplies',
        delivered: true,
        deliveryDate: new Date('2025-07-23')
      },
      {
        id: 'july-9-4',
        description: 'Dishwashing Liquid - Industrial, 5L',
        quantity: 4,
        unitPrice: 26.15,
        totalPrice: 104.60,
        category: 'Supplies',
        delivered: false
      }
    ]
  },
  {
    id: 'july-10',
    invoiceNumber: 'SYS-2025-223',
    supplier: 'Sysco Corporation',
    supplierAddress: '1390 Enclave Parkway\nHouston, TX 77077',
    date: new Date('2025-07-25'),
    subtotal: 1389.20,
    tax: 111.14,
    total: 1500.34,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-25T08:50:00'),
    status: 'fully_delivered',
    notes: 'End of month bulk order',
    items: [
      {
        id: 'july-10-1',
        description: 'Prime New York Strip Steaks - 12oz',
        quantity: 20,
        unitPrice: 24.85,
        totalPrice: 497.00,
        category: 'Meat',
        batchCode: 'NYS250725Y',
        delivered: true,
        deliveryDate: new Date('2025-07-26')
      },
      {
        id: 'july-10-2',
        description: 'Fresh Tuna Steaks - Sushi Grade',
        quantity: 12,
        unitPrice: 35.90,
        totalPrice: 430.80,
        category: 'Seafood',
        batchCode: 'TUN250724Z',
        delivered: true,
        deliveryDate: new Date('2025-07-26')
      },
      {
        id: 'july-10-3',
        description: 'Roasted Red Peppers - 5 lb jars',
        quantity: 8,
        unitPrice: 18.75,
        totalPrice: 150.00,
        category: 'Vegetables',
        delivered: true,
        deliveryDate: new Date('2025-07-26')
      },
      {
        id: 'july-10-4',
        description: 'Aged Gouda Cheese - 5 lb wheels',
        quantity: 6,
        unitPrice: 51.90,
        totalPrice: 311.40,
        category: 'Dairy',
        batchCode: 'GOU250723A',
        delivered: true,
        deliveryDate: new Date('2025-07-26')
      }
    ]
  },
  {
    id: 'july-11',
    invoiceNumber: 'BEV-2025-178',
    supplier: 'Beverage Distributors Inc',
    supplierAddress: '2250 Industrial Blvd\nAtlanta, GA 30318',
    date: new Date('2025-07-28'),
    subtotal: 645.90,
    tax: 51.67,
    total: 697.57,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-28T12:45:00'),
    status: 'pending',
    notes: 'Month-end wine and spirits restocking',
    items: [
      {
        id: 'july-11-1',
        description: 'Pinot Noir - Oregon, 2022 vintage',
        quantity: 12,
        unitPrice: 32.50,
        totalPrice: 390.00,
        category: 'Wine',
        delivered: false
      },
      {
        id: 'july-11-2',
        description: 'Whiskey - Single Malt, 18yr',
        quantity: 3,
        unitPrice: 85.30,
        totalPrice: 255.90,
        category: 'Spirits',
        delivered: false
      }
    ]
  },
  {
    id: 'july-12',
    invoiceNumber: 'USF-2025-356',
    supplier: 'US Foods',
    supplierAddress: '9399 W Higgins Rd\nRosemont, IL 60018',
    date: new Date('2025-07-30'),
    subtotal: 1078.45,
    tax: 86.28,
    total: 1164.73,
    imageUrl: undefined,
    scannedAt: new Date('2025-07-30T17:20:00'),
    status: 'partially_delivered',
    notes: 'Final July delivery - prep for August menu',
    items: [
      {
        id: 'july-12-1',
        description: 'Lamb Shoulder - Boneless, 8 lb roasts',
        quantity: 6,
        unitPrice: 89.75,
        totalPrice: 538.50,
        category: 'Meat',
        batchCode: 'LAM250730B',
        delivered: true,
        deliveryDate: new Date('2025-07-31')
      },
      {
        id: 'july-12-2',
        description: 'Scallops - Dry Pack, U-10 size',
        quantity: 5,
        unitPrice: 67.80,
        totalPrice: 339.00,
        category: 'Seafood',
        batchCode: 'SCA250729C',
        delivered: false
      },
      {
        id: 'july-12-3',
        description: 'Heirloom Carrots - Rainbow, 5 lb bunches',
        quantity: 8,
        unitPrice: 25.12,
        totalPrice: 200.96,
        category: 'Vegetables',
        batchCode: 'CAR250728D',
        delivered: true,
        deliveryDate: new Date('2025-07-31')
      }
    ]
  }
];

export const lastMonthCreditNotes: CreditNote[] = [
  {
    id: 'july-cn-1',
    creditNoteNumber: 'USF-CN-2025-089',
    supplier: 'US Foods',
    date: new Date('2025-07-06'),
    amount: 373.50,
    reason: 'Wild salmon delivery cancelled due to quality issues',
    relatedInvoiceId: 'july-2',
    appliedToInvoice: true,
    items: [
      {
        description: 'Wild Salmon Fillets - Norwegian (quality issue)',
        amount: 373.50
      }
    ]
  },
  {
    id: 'july-cn-2',
    creditNoteNumber: 'PFG-CN-2025-034',
    supplier: 'Performance Food Group',
    date: new Date('2025-07-09'),
    amount: 790.00,
    reason: 'Black truffle shipment delayed - supplier out of stock',
    relatedInvoiceId: 'july-3',
    appliedToInvoice: true,
    items: [
      {
        description: 'Black Truffle - Fresh, Grade A (delayed shipment)',
        amount: 790.00
      }
    ]
  },
  {
    id: 'july-cn-3',
    creditNoteNumber: 'BEV-CN-2025-012',
    supplier: 'Beverage Distributors Inc',
    date: new Date('2025-07-14'),
    amount: 231.60,
    reason: 'Gin bottles arrived damaged in transit',
    relatedInvoiceId: 'july-5',
    appliedToInvoice: false,
    items: [
      {
        description: 'Gin - Hendricks, 750ml (damaged bottles)',
        amount: 231.60
      }
    ]
  },
  {
    id: 'july-cn-4',
    creditNoteNumber: 'RD-CN-2025-067',
    supplier: 'Restaurant Depot',
    date: new Date('2025-07-24'),
    amount: 104.60,
    reason: 'Dishwashing liquid containers leaked during delivery',
    relatedInvoiceId: 'july-9',
    appliedToInvoice: false,
    items: [
      {
        description: 'Dishwashing Liquid - Industrial, 5L (damaged containers)',
        amount: 104.60
      }
    ]
  }
];