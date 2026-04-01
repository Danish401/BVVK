'use client'

import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { QuotationData } from '@/lib/types'
import { formatCurrency, numberToWords } from '@/lib/quotation-utils'

const txBlue = '#0000CD'

/** Full cell border (title + footer rows) */
const bd: CSSProperties = { border: '1px solid #000' }

/** Left & right rules only — no horizontal lines (merge with adjacent row) */
const bdSides: CSSProperties = {
  borderLeft: '1px solid #000',
  borderRight: '1px solid #000',
}

/** Product/Form row: open bottom so it joins the Item grid row below */
const bdProductMeta: CSSProperties = {
  ...bdSides,
  borderTop: 'none',
  borderBottom: 'none',
}

/** Item grid row: vertical rules only — no horizontal lines above/below the row */
const bdItemGrid: CSSProperties = {
  ...bdSides,
  borderTop: 'none',
  borderBottom: 'none',
}

/** Column title row (Description of Goods): bottom border applied per request */
const bdTitleRow: CSSProperties = {
  ...bdSides,
  borderTop: 'none',
  borderBottom: '1px solid #000',
}

/** Right-side merged empty cell beside Product/Form — no horizontal rules */
const rightMergedEmpty: CSSProperties = {
  ...bdSides,
  borderTop: 'none',
  borderBottom: 'none',
  padding: '6px',
  verticalAlign: 'top',
}

interface BashundharaGoodsTableProps {
  data: QuotationData
  rawQuotationData?: any
  shippingData?: any
  headerNode?: ReactNode
  footerNode?: ReactNode
}

const descGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  columnGap: '10px',
  rowGap: '2px',
  alignItems: 'center',
  width: '100%',
  textAlign: 'left',
}

export default function BashundharaGoodsTable({ data, rawQuotationData, shippingData, headerNode, footerNode }: BashundharaGoodsTableProps) {
  const rawLineItems = (rawQuotationData?.Category_1_MM_Database_WMW_2_0 as any[]) || []
  const rawProductDetails = (rawQuotationData?.Category_1_MM_Database_WMW as any[]) || []

  const defaultProductLabel = 'Stainless Steel Wire Cloth (Woven Type)'

  const currency = data.currency || rawQuotationData?.Currency || 'USD'
  const currencySymbol = currency

  const subformBreakdown = rawQuotationData?.Subform_Breakdown || []
  const category1WMWSubform = subformBreakdown.find(
    (sf: any) => sf.Subform?.includes('Category 1 WMW') || sf.Subform === 'Category 1 WMW'
  )
  const activeSubform =
    category1WMWSubform ||
    subformBreakdown.find((sf: any) => parseFloat(sf.Total_Sale_Value || '0') > 0 || parseFloat(sf.Cost_Before_Tax || '0') > 0) ||
    subformBreakdown[0]

  const subformTotalSaleValue = parseFloat(activeSubform?.Total_Sale_Value || '0') || 0
  const subformCostBeforeTax = parseFloat(activeSubform?.Cost_Before_Tax || '0') || 0

  const packingFreight = parseFloat(rawQuotationData?.Packing_Freight || '0') || 0
  const transaction = parseFloat(rawQuotationData?.Transaction_Charges || '0') || 0

  const countryOfDestination = rawQuotationData?.Shipping_Country || shippingData?.Shipping_Country || ''
  const portOfDischarge = rawQuotationData?.Port_of_Discharge || ''
  const finalDestination = rawQuotationData?.Final_Destination || portOfDischarge || ''
  const modeOfDelivery = rawQuotationData?.Mode_of_Delivery || data.termsOfDelivery || 'Road'

  const netWeightPerPcs = rawQuotationData?.Net_Weight_Per_Pcs || ''
  const totalNetWeight = rawQuotationData?.Total_Net_Weight || ''
  const totalGrossWeight = rawQuotationData?.Total_Gross_Weight || ''

  const lineItemsFromZoho = rawLineItems.map((item, index) => {
    const itemRef = item.last_item_ref?.trim() || item.Last_item_ref?.trim() || ''
    const productDetail = itemRef
      ? rawProductDetails.find(
          (pd: any) => pd.last_item_ref?.trim() === itemRef || pd.Last_item_ref?.trim() === itemRef
        ) || rawProductDetails[index] || {}
      : rawProductDetails[index] || {}

    let size = ''
    if (item.Invoice_Dimension_1 && item.Invoice_Dimension_2) {
      const extractNumber = (str: string) => {
        const match = str.match(/(\d+\.?\d*)/)
        return match ? match[1] : str.replace(/Length|length|Width|width/gi, '').trim()
      }
      const dim1 = extractNumber(item.Invoice_Dimension_1)
      const dim2 = extractNumber(item.Invoice_Dimension_2)
      size = `${dim1} x ${dim2}`
    }

    const sqmArea = productDetail.Total_SQM?.trim() || productDetail.SQM?.trim() || ''
    const quantity = productDetail.Qty?.trim() || item.Qty?.trim() || '0'
    const rate = parseFloat(String(productDetail.List_Price || '').replace(/,/g, '') || item.Selling_Price?.replace(/,/g, '') || '0')
    const amount = parseFloat(item.Net_Selling_Amount?.replace(/,/g, '') || item.Gross_Amount?.replace(/,/g, '') || '0')

    const mesh = productDetail.Brand_Category?.trim() || ''
    const brand = productDetail.Brand_Selling_Name?.trim() || ''

    const wiLine = data.lineItems?.[index]
    const product =
      productDetail.Product_Name?.trim() ||
      productDetail.Product_Master?.trim() ||
      wiLine?.product?.trim() ||
      defaultProductLabel
    const form = productDetail.Supply_Form?.trim() || wiLine?.form?.trim() || ''
    const quality = wiLine?.quality?.trim() || ''

    return {
      item: index + 1,
      product,
      form,
      quality,
      mesh,
      brand,
      size,
      sqmArea,
      quantity,
      rate,
      amount,
    }
  })

  const lineItemsFallback = (data.lineItems || []).map((item, index) => {
    const rate = parseFloat(String(item.rate).replace(/,/g, '')) || 0
    const amount = parseFloat(String(item.amount).replace(/,/g, '')) || 0
    return {
      item: index + 1,
      product: item.product?.trim() || defaultProductLabel,
      form: item.form?.trim() || '',
      quality: item.quality?.trim() || '',
      mesh: '',
      brand: item.type || item.form || '',
      size: item.size || '',
      sqmArea: item.subQty || '',
      quantity: item.qty || '0',
      rate,
      amount,
    }
  })

  const displayLineItems = lineItemsFromZoho.length > 0 ? lineItemsFromZoho : lineItemsFallback
  const lineSum = displayLineItems.reduce((s, it) => s + (it.amount || 0), 0)

  const baseAmount =
    subformTotalSaleValue > 0
      ? subformTotalSaleValue
      : subformCostBeforeTax > 0
        ? subformCostBeforeTax
        : lineSum > 0
          ? lineSum
          : data.totalAmount

  const totalWithCharges = baseAmount + packingFreight + transaction
  const amountInWords = numberToWords(totalWithCharges)
  const currencyWords = currency === 'USD' ? 'US Dollars' : currency === 'INR' ? 'Indian Rupees' : currency

  const destLabel = finalDestination || portOfDischarge || 'Benapole'
  const countryLabel = countryOfDestination || 'Bangladesh'

  const chunks = [];
  for (let i = 0; i < displayLineItems.length; i += 5) {
    chunks.push(displayLineItems.slice(i, i + 5));
  }
  if (chunks.length === 0) chunks.push([]);

  return (
    <div className="quotation-goods-pages-stack">
      {chunks.map((chunk, pageIdx) => {
        const isLastChunk = pageIdx === chunks.length - 1;

        return (
          <div
            key={pageIdx}
            className={`quotation-goods-pages-segment ${!isLastChunk ? 'quotation-goods-pages-break' : ''}`}
            style={{ pageBreakInside: 'avoid', marginTop: pageIdx > 0 ? '-1px' : '0' }}
          >
            <div className="quotation-seamless-stack">
              {headerNode}
              
              <table
                className="goods-description-table quotation-stack-table bashundhara-goods-table"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #000',
                  marginTop: 0,
                  tableLayout: 'fixed',
                  fontSize: '10px',
                }}
              >
                <colgroup>
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '40%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                </colgroup>
                <tbody>
                  <tr className="bashundhara-goods-title-row">
                    <td colSpan={2} style={{ ...bdTitleRow, padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '11px' }}>
                      Description of Goods
                    </td>
                    <td style={{ ...bdTitleRow, padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                      Quantity
                      <br />
                      UOM
                    </td>
                    <td style={{ ...bdTitleRow, padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                      Rate
                      <br />
                      {currencySymbol} / UOM
                    </td>
                    <td style={{ ...bdTitleRow, padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                      Amount
                      <br />
                      {currencySymbol}
                    </td>
                  </tr>

                  {/* Explicit horizontal line below header to guarantee rendering */}
                  <tr aria-hidden className="bashundhara-horizontal-border">
                    <td colSpan={5} style={{ borderTop: '1px solid #000', padding: 0, margin: 0, height: 0, lineHeight: 0, fontSize: 0 }} />
                  </tr>

                  {chunk.map((row, index) => (
                    <Fragment key={`bashundhara-line-${pageIdx}-${index}`}>
                      <tr className="bashundhara-item-meta-row">
                        <td colSpan={2} style={{ ...bdProductMeta, padding: '8px 10px 4px 10px', verticalAlign: 'top' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '60px 10px auto', marginBottom: '3px' }}>
                            <strong>Product</strong><span>:</span><span>{row.product}</span>
                          </div>
                          {row.form ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '60px 10px auto', marginBottom: '3px' }}>
                              <strong>Form</strong><span>:</span><span>{row.form}</span>
                            </div>
                          ) : null}
                          {row.quality ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '60px 10px auto' }}>
                              <strong>Quality</strong><span>:</span><span>{row.quality}</span>
                            </div>
                          ) : null}
                        </td>
                        <td style={rightMergedEmpty} />
                        <td style={rightMergedEmpty} />
                        <td style={rightMergedEmpty} />
                      </tr>
                      <tr className="bashundhara-item-grid-row">
                        <td colSpan={2} style={{ ...bdItemGrid, padding: '6px 10px', verticalAlign: 'middle' }}>
                          <div style={{ ...descGrid, fontWeight: 'bold', marginBottom: '6px' }}>
                            <span>Item</span>
                            <span>MESH</span>
                            <span>BRAND</span>
                            <span>SIZE [Mtrs] (LxW)</span>
                            <span>Sqm Area / PC</span>
                          </div>
                          <div style={descGrid}>
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{row.item}</span>
                            <span>{row.mesh}</span>
                            <span>{row.brand}</span>
                            <span>{row.size}</span>
                            <span>{row.sqmArea}</span>
                          </div>
                        </td>
                        <td style={{ ...bdItemGrid, padding: '6px', textAlign: 'center', verticalAlign: 'middle' }}>
                          {row.quantity} {row.quantity !== '0' ? 'Pcs' : ''}
                        </td>
                        <td style={{ ...bdItemGrid, padding: '6px', textAlign: 'right', verticalAlign: 'middle' }}>
                          {formatCurrency(row.rate, currency)}
                        </td>
                        <td style={{ ...bdItemGrid, padding: '6px', textAlign: 'right', verticalAlign: 'middle' }}>
                          {formatCurrency(row.amount, currency)}
                        </td>
                      </tr>
                    </Fragment>
                  ))}

                  {isLastChunk && (
                    <>
                      <tr aria-hidden className="bashundhara-goods-spacer">
                        <td colSpan={2} style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                        <td style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                        <td style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                        <td style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                      </tr>

                      <tr>
                        <td colSpan={2} style={{ ...bdSides, padding: '4px 10px 10px 10px', fontSize: '10px', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                              <div style={{ display: 'grid', gridTemplateColumns: '130px 10px auto', marginBottom: '3px' }}>
                                <span style={{ fontWeight: 'bold', textDecoration: 'underline', textAlign: 'right' }}>Net Weight (Per Pcs.)</span>
                                <span style={{ textAlign: 'center', fontWeight: 'bold' }}>:</span>
                                <span style={{ fontWeight: 'bold' }}>{netWeightPerPcs ? `${netWeightPerPcs} Kgs. (± 5%)` : '47.55 Kgs. (± 5%)'}</span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '130px 10px auto', marginBottom: '3px' }}>
                                <span style={{ fontWeight: 'bold', textDecoration: 'underline', textAlign: 'right' }}>Total Net Weight</span>
                                <span style={{ textAlign: 'center', fontWeight: 'bold' }}>:</span>
                                <span style={{ fontWeight: 'bold' }}>{totalNetWeight ? `${totalNetWeight} Kgs. (± 5%)` : '95.10 Kgs. (± 5%)'}</span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '130px 10px auto' }}>
                                <span style={{ fontWeight: 'bold', textDecoration: 'underline', textAlign: 'right' }}>Total Gross Weight</span>
                                <span style={{ textAlign: 'center', fontWeight: 'bold' }}>:</span>
                                <span style={{ fontWeight: 'bold' }}>{totalGrossWeight ? `${totalGrossWeight} Kgs. (± 5%)` : '195 Kgs. (± 5%)'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...bdSides, padding: '6px' }} />
                        <td style={{ ...bdSides, padding: '6px' }} />
                        <td style={{ ...bdSides, padding: '6px' }} />
                      </tr>

                      <tr aria-hidden className="bashundhara-goods-spacer">
                        <td colSpan={2} style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                        <td style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                        <td style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                        <td style={{ ...bdSides, borderTop: 'none', borderBottom: 'none', padding: '6px 0', lineHeight: 0, fontSize: 0 }} />
                      </tr>

                      <tr>
                        <td colSpan={2} style={{ ...bdSides, padding: '6px 10px', fontWeight: 'bold' }}>
                          Packing, Freight &amp; Forwarding charges upto {destLabel}, {countryLabel} by {modeOfDelivery}
                        </td>
                        <td style={{ ...bdSides, padding: '6px' }} />
                        <td style={{ ...bdSides, padding: '6px' }} />
                        <td style={{ ...bdSides, padding: '6px', textAlign: 'right' }}>{formatCurrency(packingFreight, currency)}</td>
                      </tr>

                      <tr>
                        <td colSpan={2} style={{ ...bdSides, padding: '6px 10px', textAlign: 'right', color: txBlue, fontWeight: 'bold' }}>
                          Add.: Transaction charges
                        </td>
                        <td style={{ ...bdSides, padding: '6px' }} />
                        <td style={{ ...bdSides, padding: '6px' }} />
                        <td style={{ ...bdSides, padding: '6px', textAlign: 'right', fontWeight: 'bold', color: txBlue }}>
                          {formatCurrency(transaction, currency)}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2} style={{ ...bd, padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>Transport</td>
                        <td style={{ ...bd, padding: '5px 6px' }} />
                        <td style={{ ...bd, padding: '5px 6px' }} />
                        <td style={{ ...bd, padding: '5px 6px' }} />
                      </tr>

                      <tr>
                        <td colSpan={2} style={{ ...bd, padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                          Total CFR Price upto {destLabel} By {modeOfDelivery}:
                        </td>
                        <td style={{ ...bd, padding: '5px 6px' }} />
                        <td style={{ ...bd, padding: '5px 6px' }} />
                        <td style={{ ...bd, padding: '5px 6px' }} />
                      </tr>

                      <tr>
                        <td colSpan={2} style={{ ...bd, padding: '6px 10px', fontSize: '9px', verticalAlign: 'top' }}>
                          <span>
                            Note : If the total order value is less than {currencySymbol} 2500, transaction fee of {currencySymbol} 100 per invoice
                            shall be charged extra
                          </span>
                        </td>
                        <td style={{ ...bd, padding: '6px' }} />
                        <td style={{ ...bd, padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{currency}</td>
                        <td style={{ ...bd, padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                          {formatCurrency(totalWithCharges, currency)}
                        </td>
                      </tr>

                      <tr>
                        <td style={{ ...bd, padding: '6px 10px', fontSize: '9px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 'bold' }}>
                            Amount
                            <br />
                            Chargeable
                            <br />
                            (In words) :
                          </div>
                        </td>
                        <td style={{ ...bd, padding: '6px 10px', fontSize: '10px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 'bold' }}>
                            {currencyWords} {amountInWords} Only
                          </div>
                        </td>
                        <td style={{ ...bd, padding: '6px' }} />
                        <td style={{ ...bd, padding: '6px', fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle' }}>Total:-</td>
                        <td style={{ ...bd, padding: '6px', fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle' }}>
                          {formatCurrency(totalWithCharges, currency)}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              {isLastChunk && footerNode}
            </div>
          </div>
        );
      })}
    </div>
  )
}
