'use client'

import type { QuotationLineItem } from '@/lib/types'
import { chunkLineItems, GOODS_ROWS_PER_PRINT_PAGE } from '@/lib/quotation-line-item-display'
import GoodsDescriptionLineRow from './GoodsDescriptionLineRow'

export interface GoodsDescriptionPaginatedBlockProps {
  lineItems: QuotationLineItem[]
  /** When set, the last segment shows a goods-table tfoot (Performa). */
  totalFoot?: { currency: string; amountFormatted: string }
  /** Performa uses 8px cell padding; WI omits for default CSS. */
  cellPaddingPx?: number
}

export default function GoodsDescriptionPaginatedBlock({
  lineItems,
  totalFoot,
  cellPaddingPx,
}: GoodsDescriptionPaginatedBlockProps) {
  const items = lineItems ?? []
  const chunks = chunkLineItems(items, GOODS_ROWS_PER_PRINT_PAGE)

  return (
    <div className="quotation-goods-pages-stack">
      {chunks.map((chunk, pageIdx) => {
        const isLastChunk = pageIdx === chunks.length - 1

        return (
          <div
            key={pageIdx}
            className={[
              'quotation-goods-pages-segment',
              !isLastChunk ? 'quotation-goods-pages-break' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <table
              className="goods-description-table quotation-stack-table"
              style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}
            >
              <thead style={{ display: 'table-header-group' }}>
                <tr>
                  <th
                    style={{
                      width: '40%',
                      textAlign: 'left',
                      border: '1px solid #000',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      display: 'table-cell',
                    }}
                  >
                    Description Of Goods
                  </th>
                  <th
                    style={{
                      width: '12%',
                      border: '1px solid #000',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      display: 'table-cell',
                    }}
                  >
                    Delivery
                  </th>
                  <th
                    style={{
                      width: '8%',
                      border: '1px solid #000',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      display: 'table-cell',
                    }}
                  >
                    UOM
                  </th>
                  <th
                    style={{
                      width: '15%',
                      border: '1px solid #000',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      display: 'table-cell',
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      width: '12%',
                      textAlign: 'right',
                      border: '1px solid #000',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      display: 'table-cell',
                    }}
                  >
                    Rate/SQM
                  </th>
                  <th
                    style={{
                      width: '13%',
                      textAlign: 'right',
                      border: '1px solid #000',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      display: 'table-cell',
                    }}
                  >
                    Amount INR
                  </th>
                </tr>
              </thead>
              <tbody>
                {chunk.length > 0 ? (
                  chunk.map((row, i) => (
                    <GoodsDescriptionLineRow
                      key={`${pageIdx}-${i}`}
                      row={row}
                      cellPaddingPx={cellPaddingPx}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="goods-description-table-body-cell"
                      style={{ textAlign: 'center', padding: '20px', color: '#666' }}
                    >
                      No line items found
                    </td>
                  </tr>
                )}
              </tbody>
              {totalFoot && isLastChunk ? (
                <tfoot>
                  <tr>
                    <td
                      colSpan={5}
                      className="goods-description-table-foot-cell text-right font-bold"
                      style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}
                    >
                      Total {totalFoot.currency}
                    </td>
                    <td
                      className="goods-description-table-foot-cell text-right font-bold"
                      style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}
                    >
                      {totalFoot.amountFormatted}
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        )
      })}
    </div>
  )
}
