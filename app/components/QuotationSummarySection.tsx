import { QuotationData } from '@/lib/types'
import { formatCurrency } from '@/lib/quotation-utils'

export interface QuotationSummarySectionProps {
  data: QuotationData
  /** Pre-formatted line-items total (same as former goods tfoot) */
  totalAmountFormatted: string
  cgstRate: number
  cgstAmount: number
  sgstRate: number
  sgstAmount: number
  igstRate: number
  igstAmount: number
  taxAmount: number
  totalAfterTax: number
}

function fmtGstRateLabel(rate: number): string {
  if (rate > 0) return `${Number(rate).toFixed(2)}%`
  return '0.00'
}

/**
 * Single 6-column table (same widths as goods-description: 40/12/8/15/12/13).
 * One collapsed grid so horizontal rules line up across HSN/Notes and charge columns.
 */
export default function QuotationSummarySection({
  data,
  totalAmountFormatted,
  cgstRate,
  cgstAmount,
  sgstRate,
  sgstAmount,
  igstRate,
  igstAmount,
  taxAmount,
  totalAfterTax,
}: QuotationSummarySectionProps) {
  const totalAfterFormatted = formatCurrency(totalAfterTax)

  const taxRows: { label: string; value: string; bold?: boolean }[] = [
    { label: 'Freight Charge', value: '0.00' },
    { label: 'Packing Charges', value: '0.00' },
    { label: 'Seam Charges', value: '0.00' },
    { label: 'Total Amount Before Tax', value: formatCurrency(data.totalAmount), bold: true },
    { label: `Add CGST @ ${fmtGstRateLabel(cgstRate)}`, value: formatCurrency(cgstAmount) },
    { label: `Add SGST @ ${fmtGstRateLabel(sgstRate)}`, value: formatCurrency(sgstAmount) },
    { label: `Add IGST @ ${fmtGstRateLabel(igstRate)}`, value: formatCurrency(igstAmount) },
    { label: 'Tax Amount GST', value: formatCurrency(taxAmount) },
    { label: 'Total Amount After GST', value: totalAfterFormatted, bold: true },
  ]

  const notesRowSpan = taxRows.length - 3

  return (
    <table className="quotation-stack-table quotation-summary-block">
      <colgroup>
        <col style={{ width: '40%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '8%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '13%' }} />
      </colgroup>
      <tbody>
        <tr>
          <td className="qs-cell qs-cell--validity" colSpan={4}>
            <strong>QUOTATION VALIDITY :</strong> 07 Days from the date of Quotation
          </td>
          <td className="qs-cell qs-cell--total-inr">Total INR</td>
          <td className="qs-cell qs-cell--total-amt">{totalAmountFormatted}</td>
        </tr>

        <tr className="qs-hsn-tax-row">
          <td className="qs-cell qs-hsn-grid__col-label">Freight</td>
          <td className="qs-cell qs-hsn-grid__col-excl">Excl.</td>
          <td className="qs-cell qs-hsn-grid__hsn-head" colSpan={2}>
            HSN Number
          </td>
          <td className="qs-cell qs-tax-label">{taxRows[0].label}</td>
          <td className="qs-cell qs-tax-num">{taxRows[0].value}</td>
        </tr>

        <tr className="qs-hsn-tax-row">
          <td className="qs-cell qs-hsn-grid__col-label">
            <strong>Insurance</strong>
          </td>
          <td className="qs-cell qs-hsn-grid__col-excl">Incl.</td>
          <td className="qs-cell">StainlessSteelWireCloth</td>
          <td className="qs-cell qs-hsn-grid__code">7314</td>
          <td className="qs-cell qs-tax-label">{taxRows[1].label}</td>
          <td className="qs-cell qs-tax-num">{taxRows[1].value}</td>
        </tr>

        <tr className="qs-hsn-tax-row">
          <td className="qs-cell qs-hsn-grid__col-label">
            <strong>Packing</strong>
          </td>
          <td className="qs-cell qs-hsn-grid__col-excl">Incl.</td>
          <td className="qs-cell">
            <strong>PB Wire Cloth</strong>
          </td>
          <td className="qs-cell qs-hsn-grid__code">7419</td>
          <td className="qs-cell qs-tax-label">{taxRows[2].label}</td>
          <td className="qs-cell qs-tax-num">{taxRows[2].value}</td>
        </tr>

        {taxRows.slice(3).map((row, i) => (
          <tr key={row.label} className={row.bold ? 'qs-tax-row--bold' : undefined}>
            {i === 0 ? (
              <td className="qs-cell qs-notes-merged" colSpan={4} rowSpan={notesRowSpan}>
                <div className="qs-notes-banner">Notes</div>
                <div className="qs-notes-fill">{data.remarks || ''}</div>
              </td>
            ) : null}
            <td className="qs-cell qs-tax-label">{row.label}</td>
            <td className="qs-cell qs-tax-num">{row.value}</td>
          </tr>
        ))}

        <tr>
          <td className="qs-cell qs-cell--amount-words" colSpan={6}>
            <strong>Amount Chargeable (In words):-</strong>{' '}
            <span className="qs-amount-words-inline">
              {data.currency} {totalAfterFormatted} Only
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
