import { describe, it, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import {
  newMixinInvoice,
  attachInvoiceEntry,
  getInvoiceString,
  parseMixinInvoice,
  attachStorageEntry,
  isStorageEntry,
  buildMixAddress,
} from '@mixin.dev/mixin-node-sdk';
import type { InvoiceEntry } from '@mixin.dev/mixin-node-sdk';

// Example: USDT / XIN asset_id
const USDT_ASSET_ID = '4d8c508b-91c5-375b-92b0-ee702ed2dac5';
const XIN_ASSET_ID = 'c94ac88f-4671-3976-b60a-09064f1811e8';

const memberUuid = '44d9717d-8cae-4004-98a1-f9ad544dcfb1';
const RECIPIENT_ADDRESS = buildMixAddress({
  version: 2,
  uuidMembers: [memberUuid],
  xinMembers: [],
  threshold: 1,
});

describe('Mixin Invoice Utils', () => {
  it('should create a basic invoice with multiple entries', () => {
    // 1. Your MIX address
    const recipientMixAddress = RECIPIENT_ADDRESS;

    // 2. Create a new invoice
    const invoice = newMixinInvoice(recipientMixAddress);

    if (!invoice) {
      throw new Error('Skipping test because address is invalid');
    }
    expect(invoice).toBeDefined();

    // 3. Construct a normal transfer entry
    const entry1: InvoiceEntry = {
      trace_id: uuidv4(),
      asset_id: USDT_ASSET_ID,
      amount: '0.00000001',
      extra: Buffer.from('first payment', 'utf8'),
      index_references: [],
      hash_references: [],
    };

    // 4. Construct another XIN entry as fee
    const entry2: InvoiceEntry = {
      trace_id: uuidv4(),
      asset_id: XIN_ASSET_ID,
      amount: '0.00000001',
      extra: Buffer.from(JSON.stringify({ type: 'fee', order_id: '123456' })),
      index_references: [],
      hash_references: [],
    };

    // 5. Attach to invoice
    attachInvoiceEntry(invoice, entry1);
    attachInvoiceEntry(invoice, entry2);

    // 6. Generate final MIN string
    const minString = getInvoiceString(invoice);
    expect(minString).toMatch(/^MIN/);

    console.log('MIN string:', minString);
    const payUrl = `https://mixin.one/pay/${minString}`;
    console.log('Pay URL   :', payUrl);

    // 7. Parse back to check
    const parsed = parseMixinInvoice(minString);
    expect(parsed).toBeDefined();
    expect(parsed!.entries.length).toBe(2);
    expect(parsed!.entries[0].amount).toBe('0.00000001');
    expect(parsed!.entries[1].amount).toBe('0.00000001'); // BigNumber formatted
  });

  it('should create a storage invoice (large extra)', () => {
    const recipient = RECIPIENT_ADDRESS;
    const invoice = newMixinInvoice(recipient);

    if (!invoice) {
      throw new Error('Skipping test because address is invalid');
    }

    // Construct a large chunk of data
    const largeData = Buffer.from('some large data...'.repeat(100)); // Reduced size for test speed, but enough to test logic

    const traceId = uuidv4();

    // attachStorageEntry
    attachStorageEntry(invoice, traceId, largeData);

    const minString = getInvoiceString(invoice);
    console.log('storage MIN string:', minString);
    expect(minString).toMatch(/^MIN/);

    // Parse back to check
    const parsed = parseMixinInvoice(minString);
    expect(parsed).toBeDefined();

    const storageEntry = parsed!.entries[0];
    expect(isStorageEntry(storageEntry)).toBe(true);
  });

  it('should parse an invoice string', () => {
    // We use the string generated in the first test if possible, or generate a new one.
    // Since tests are independent, we generate a new one.
    const recipient = RECIPIENT_ADDRESS;
    const invoice = newMixinInvoice(recipient);
    if (!invoice) throw new Error('Skipping test because address is invalid');

    const entry: InvoiceEntry = {
      trace_id: uuidv4(),
      asset_id: USDT_ASSET_ID,
      amount: '1.00',
      extra: Buffer.from('test'),
      index_references: [],
      hash_references: [],
    };
    attachInvoiceEntry(invoice, entry);
    const s = getInvoiceString(invoice);

    const parsed = parseMixinInvoice(s);
    expect(parsed).toBeDefined();
    expect(parsed!.entries[0].extra.toString()).toBe('test');
  });
  it('should reverse decode and inspect invoice string', () => {
    const recipient = RECIPIENT_ADDRESS;
    const invoice = newMixinInvoice(recipient);
    if (!invoice) throw new Error('Skipping test because address is invalid');

    const entry: InvoiceEntry = {
      trace_id: uuidv4(),
      asset_id: USDT_ASSET_ID,
      amount: '1.00',
      extra: Buffer.from('debug-check'),
      index_references: [],
      hash_references: [],
    };

    const entry2: InvoiceEntry = {
      trace_id: uuidv4(),
      asset_id: XIN_ASSET_ID,
      amount: '0.01',
      extra: Buffer.from(JSON.stringify({ type: 'fee', order_id: '123456' })),
      index_references: [0],
      hash_references: [],
    };
    attachInvoiceEntry(invoice, entry);
    attachInvoiceEntry(invoice, entry2);
    const s = getInvoiceString(invoice);

    console.log('--- Debug Invoice String ---');
    console.log(s);
    console.log('----------------------------');

    const parsed = parseMixinInvoice(s);
    expect(parsed).toBeDefined();

    if (parsed) {
      console.log('--- Decoded Invoice Data ---');
      console.log('Version:', parsed.version);
      console.log('Recipient:', JSON.stringify(parsed.recipient, null, 2));
      console.log('Entries Count:', parsed.entries.length);
      parsed.entries.forEach((e, i) => {
        console.log(`Entry #${i}:`);
        console.log('  Asset ID:', e.asset_id);
        console.log('  Amount:', e.amount);
        console.log('  Extra:', e.extra.toString());
      });
      console.log('----------------------------');
    }
  });
});
import { createMixinInvoice, getPaymentUrl } from './mixin-invoice';

describe('Mixin Invoice Helper', () => {
  it('should create a valid invoice with multiple items', () => {
    const items = [
      {
        assetId: USDT_ASSET_ID,
        amount: '1.00',
        extra: 'payment',
      },
      {
        assetId: XIN_ASSET_ID,
        amount: '0.01',
        extra: JSON.stringify({ type: 'fee' }),
        references: [0], // Reference the first item
      },
    ];

    const minString = createMixinInvoice(memberUuid, items);
    expect(minString).toBeDefined();
    expect(minString).toMatch(/^MIN/);

    // Verify by parsing back
    const parsed = parseMixinInvoice(minString!);
    expect(parsed).toBeDefined();
    expect(parsed!.entries.length).toBe(2);

    // Check first entry
    expect(parsed!.entries[0].asset_id).toBe(USDT_ASSET_ID);
    expect(parsed!.entries[0].amount).toBe('1.00000000');
    expect(parsed!.entries[0].extra.toString()).toBe('payment');

    // Check second entry
    expect(parsed!.entries[1].asset_id).toBe(XIN_ASSET_ID);
    expect(parsed!.entries[1].amount).toBe('0.01000000');
    expect(parsed!.entries[1].index_references).toEqual([0]);
  });

  it('should generate correct payment URL', () => {
    const minString = 'MINTEST123';
    const url = getPaymentUrl(minString);
    expect(url).toBe('https://mixin.one/pay/MINTEST123');
  });

  it('should return undefined for invalid inputs (simulated)', () => {
    // Since buildMixAddress might throw or return something weird if UUID is bad,
    // let's try a completely invalid UUID string to see if it handles it gracefully or throws.
    // The helper catches errors and returns undefined.
    const invalidUuid = 'not-a-uuid';
    const result = createMixinInvoice(invalidUuid, []);
    expect(result).toBeUndefined();
  });
});
