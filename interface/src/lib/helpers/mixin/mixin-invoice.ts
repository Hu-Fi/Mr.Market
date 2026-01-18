import {
  buildMixAddress,
  newMixinInvoice,
  attachInvoiceEntry,
  getInvoiceString,
} from '@mixin.dev/mixin-node-sdk';
import type { InvoiceEntry } from '@mixin.dev/mixin-node-sdk';
import { v4 as uuidv4 } from 'uuid';

export interface InvoiceItem {
  assetId: string;
  amount: string;
  extra?: string | Buffer;
  traceId?: string;
  references?: number[];
}

/**
 * Creates a Mixin Invoice string (MIN...) for a given recipient and list of items.
 * 
 * @param recipientUuid The Mixin User UUID of the recipient.
 * @param items A list of items (transfers) to include in the invoice.
 * @returns The generated MIN invoice string.
 */
export const createMixinInvoice = (recipientUuid: string, items: InvoiceItem[]): string | undefined => {
  try {
    // 1. Construct MixAddress from UUID
    const recipientAddress = buildMixAddress({
      version: 2,
      uuidMembers: [recipientUuid],
      xinMembers: [],
      threshold: 1,
    });

    // 2. Initialize Invoice
    const invoice = newMixinInvoice(recipientAddress);
    if (!invoice) {
      console.error('Failed to create Mixin Invoice: Invalid recipient address');
      return undefined;
    }

    // 3. Attach entries
    for (const item of items) {
      const entry: InvoiceEntry = {
        trace_id: item.traceId || uuidv4(),
        asset_id: item.assetId,
        amount: item.amount,
        extra: typeof item.extra === 'string' ? Buffer.from(item.extra, 'utf8') : (item.extra || Buffer.from('')),
        index_references: item.references || [],
        hash_references: [],
      };
      attachInvoiceEntry(invoice, entry);
    }

    // 4. Generate string
    return getInvoiceString(invoice);
  } catch (error) {
    console.error('Error creating Mixin Invoice:', error);
    return undefined;
  }
};

/**
 * Wraps a MIN invoice string into a full payment URL.
 * 
 * @param minString The MIN invoice string.
 * @returns The full https://mixin.one/pay/... URL.
 */
export const getPaymentUrl = (minString: string): string => {
  return `https://mixin.one/pay/${minString}`;
};
