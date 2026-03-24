'use client'

import type { QuotationData, QuotationLineItem } from '@/lib/types'
import { chunkLineItems, GOODS_ROWS_PER_PRINT_PAGE } from '@/lib/quotation-line-item-display'
import GoodsDescriptionLineRow from './GoodsDescriptionLineRow'
import QuotationHeaderThead from './QuotationHeaderThead'

/** Omit duplicate master header on the last N goods segments (e.g. tail pages before summary / conditions). */
const MASTER_HEADER_OMIT_LAST_GOODS_SEGMENTS = 2

export interface GoodsDescriptionPaginatedBlockProps {
  lineItems: QuotationLineItem[]
  /** When set, the last segment shows a goods-table tfoot (Performa). */
  totalFoot?: { currency: string; amountFormatted: string }
  /** Performa uses 8px cell padding; WI omits for default CSS. */
  cellPaddingPx?: number
  /**
   * WMW quotation: print-only duplicate of the master header before continuation goods segments.
   * (The outer table thead does not repeat when the page break is inside the cell.)
   */
  masterQuotationHeaderProps?: {
    data: QuotationData
    shippingData?: any
    billingData?: any
  }
}

export default function GoodsDescriptionPaginatedBlock({
  lineItems,
  totalFoot,
  cellPaddingPx,
  masterQuotationHeaderProps,
}: GoodsDescriptionPaginatedBlockProps) {
  const items = lineItems ?? []
  const chunks = chunkLineItems(items, GOODS_ROWS_PER_PRINT_PAGE)

  const showInjectedMasterHeader = (pageIdx: number) => {
    if (!masterQuotationHeaderProps || pageIdx === 0) return false
    const n = chunks.length
    if (n < MASTER_HEADER_OMIT_LAST_GOODS_SEGMENTS + 1) return true
    const tailStart = n - MASTER_HEADER_OMIT_LAST_GOODS_SEGMENTS
    return pageIdx < tailStart
  }

  return (
    <div className="quotation-goods-pages-stack">
      {chunks.map((chunk, pageIdx) => {
        const isLastChunk = pageIdx === chunks.length - 1

        const injectedMaster = showInjectedMasterHeader(pageIdx)

        return (
          <div
            key={pageIdx}
            className={[
              'quotation-goods-pages-segment',
              !isLastChunk ? 'quotation-goods-pages-break' : '',
              injectedMaster ? 'quotation-goods-pages-segment--master-header-continuation' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <table
              className="goods-description-table quotation-stack-table"
              style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}
            >
              <thead style={{ display: 'table-header-group' }}>
                {/* Inline header: inside same thead so it reliably appears when this table starts on a new page. */}
                {injectedMaster ? (
                  <tr className="quotation-continuation-header-row">
                    <td colSpan={6} style={{ padding: 0, border: 'none', verticalAlign: 'top' }}>
                      <table
                        className="quotation-header-master-table quotation-goods-continuation-inline"
                        style={{ width: '100%', borderCollapse: 'collapse' }}
                      >
                        <QuotationHeaderThead
                          data={masterQuotationHeaderProps!.data}
                          shippingData={masterQuotationHeaderProps!.shippingData}
                          billingData={masterQuotationHeaderProps!.billingData}
                        />
                      </table>
                    </td>
                  </tr>
                ) : null}
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
