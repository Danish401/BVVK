'use client'

import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'

const txBlue = '#3b82f6'

/** Full cell border */
const bd: CSSProperties = { border: '1px solid #000' }

/** Left & right rules only — no horizontal lines */
const contentBdSides: CSSProperties = {
  borderLeft: '1px solid #000',
  borderRight: '1px solid #000',
  borderTop: 'none',
  borderBottom: 'none',
}

interface SaintGoodsTableProps {
  data?: any
  rawQuotationData?: any
  shippingData?: any
  headerNode?: ReactNode
  footerNode?: ReactNode
}

const descGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '60px 140px 100px 160px auto',
  columnGap: '10px',
  rowGap: '2px',
  alignItems: 'center',
  width: '100%',
  textAlign: 'left',
}

export default function SaintGoodsTable({ headerNode, footerNode }: SaintGoodsTableProps) {
  return (
    <div className="quotation-goods-pages-stack">
      <div className="quotation-goods-pages-segment" style={{ pageBreakInside: 'avoid', marginTop: '0' }}>
        <div className="quotation-seamless-stack">
          {headerNode}
          
          <table
            className="goods-description-table quotation-stack-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #000',
              marginTop: 0,
              tableLayout: 'fixed',
              fontSize: '11px',
            }}
          >
            <colgroup>
              <col style={{ width: '64%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '13%' }} />
            </colgroup>
            <tbody>
              {/* Table Headers */}
              <tr>
                <td style={{ ...bd, padding: '12px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  Description of Goods
                </td>
                <td style={{ ...bd, padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  <div style={{ marginBottom: '4px' }}>Quantity</div><div>UOM</div>
                </td>
                <td style={{ ...bd, padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  <div style={{ marginBottom: '4px' }}>Rate</div><div style={{ fontSize: '10px' }}>EURO / UOM</div>
                </td>
                <td style={{ ...bd, padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>
                  <div style={{ marginBottom: '4px' }}>Amount</div><div>Euro</div>
                </td>
              </tr>

              {/* Product Metadata Row */}
              <tr>
                <td style={{ ...contentBdSides, padding: '8px 10px 0px 10px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>Trial Batch</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 10px auto', marginBottom: '2px', fontWeight: 'bold' }}>
                    <span>Product</span><span>:</span><span>Phosphor Bronze Wire Mesh</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 10px auto', marginBottom: '2px', fontWeight: 'bold' }}>
                    <span>Form</span><span>:</span><span>Roll form - With Treatment</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 10px auto', fontWeight: 'bold', marginBottom: '16px' }}>
                    <span>Quality</span><span>:</span><span>Phosphor Bronze - CuSn 6</span>
                  </div>
                </td>
                <td style={contentBdSides} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
              </tr>

              {/* Grid Headers inside Description */}
              <tr>
                <td style={{ ...contentBdSides, padding: '0px 10px 6px 10px' }}>
                   <div style={{ ...descGrid, fontWeight: 'bold', fontSize: '10px' }}>
                      <span style={{ textAlign: 'center' }}>Item</span>
                      <span>Mesh</span>
                      <span>Brand</span>
                      <span>Size [m]  (L x W)</span>
                      <span>Sqm Area / PC</span>
                   </div>
                </td>
                <td style={contentBdSides} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
              </tr>

              {/* Row 1 Data */}
              <tr>
                <td style={{ ...contentBdSides, padding: '4px 10px' }}>
                   <div style={{ ...descGrid, fontSize: '11px' }}>
                      <span style={{ textAlign: 'center', fontWeight: 'bold' }}>1</span>
                      <span style={{ fontWeight: 'bold' }}>39 X 39 Per Inch</span>
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>SecurX-39</span>
                      <span>100.00 &times; 0.3200</span>
                      <span style={{ textAlign: 'right', paddingRight: '20px' }}>32.00</span>
                   </div>
                </td>
                <td style={{ ...contentBdSides, padding: '4px 8px', verticalAlign: 'top' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '8px' }}>
                    <span style={{ textAlign: 'center' }}>9</span>
                    <span style={{ textAlign: 'left' }}>Roll</span>
                  </div>
                </td>
                <td style={{ ...contentBdSides, padding: '4px 10px', textAlign: 'right', verticalAlign: 'top' }}>
                  2,991.00
                </td>
                <td style={{ ...contentBdSides, padding: '4px 10px', textAlign: 'right', verticalAlign: 'top' }}>
                  26,919.00
                </td>
              </tr>
              
              {/* Desc Row 1 */}
              <tr>
                <td style={{ ...contentBdSides, padding: '6px 10px 4px 60px' }}>
                  Roll length for trial: 50m + 50m with one seam joint
                </td>
                <td style={{ ...contentBdSides, padding: '4px 8px', verticalAlign: 'top' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '8px' }}>
                    <span style={{ textAlign: 'center' }}>78.689</span>
                    <span style={{ textAlign: 'left' }}>LM</span>
                  </div>
                </td>
                <td style={{ ...contentBdSides, padding: '4px 10px', textAlign: 'right', verticalAlign: 'top' }}>
                  342.10
                </td>
                <td style={contentBdSides} />
              </tr>

              {/* Desc Row 2 - MOQ */}
              <tr>
                <td style={{ ...contentBdSides, padding: '2px 10px 4px 60px' }}>
                  MOQ for trial = 288 sqm / 9 rolls
                </td>
                <td style={contentBdSides} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
              </tr>

              {/* Spacing */}
              <tr>
                <td style={{ ...contentBdSides, height: '16px' }} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
              </tr>

              {/* Customer Ref */}
              <tr>
                <td style={{ ...contentBdSides, padding: '2px 10px' }}>
                  Customer Ref: Sn Bz 0,4 ( As per Appendix 1)
                </td>
                <td style={contentBdSides} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
              </tr>

              {/* Please note & LME data */}
              <tr>
                <td style={{ ...contentBdSides, padding: '8px 10px 10px 10px' }}>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '6px' }}>Please note</div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 140px auto', color: txBlue, marginBottom: '2px' }}>
                    <span>INR/EURO:</span>
                    <span>90</span>
                    <span>27.05.2024</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 140px auto', color: txBlue, marginBottom: '2px' }}>
                    <span>LME Copper:</span>
                    <span>9786 USD / Ton</span>
                    <span>21.06.2024</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 140px auto', color: txBlue, marginBottom: '24px' }}>
                    <span>LME Tin:</span>
                    <span>32144 USD / Ton</span>
                    <span>21.06.2024</span>
                  </div>

                  <div style={{ fontWeight: 'bold' }}>
                    Technical Specification Sheet Attached - WMW.PB.SexuX39
                  </div>
                </td>
                <td style={contentBdSides} />
                <td style={contentBdSides} />
                <td style={contentBdSides} />
              </tr>

              {/* --- Summary Area --- */}
              <tr>
                <td colSpan={3} style={{ ...bd, padding: '4px 10px', textAlign: 'right', fontWeight: 'bold' }}>Total Ex-Works Price</td>
                <td style={{ ...bd, padding: '4px 10px', textAlign: 'right', fontWeight: 'bold' }}>26,919.00</td>
              </tr>

              <tr>
                <td style={{ ...bd, padding: '10px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'middle' }}>Add : DAP by Air</td>
                <td style={{ ...bd, padding: '6px 8px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '8px' }}>
                    <span style={{ textAlign: 'center' }}>9</span>
                    <span style={{ textAlign: 'left' }}>Rolls</span>
                  </div>
                </td>
                <td style={{ ...bd, padding: '6px 10px', textAlign: 'right', verticalAlign: 'middle' }}>776.00</td>
                <td style={{ ...bd, padding: '6px 10px', textAlign: 'right', verticalAlign: 'middle' }}>6,984.00</td>
              </tr>

              <tr>
                <td style={{ ...bd, padding: '4px 10px', textAlign: 'center', fontWeight: 'bold' }}>Transport</td>
                <td colSpan={2} style={bd} />
                <td style={bd} />
              </tr>

              <tr>
                <td style={{ ...bd, padding: '16px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                  <div>Total DAP Price upto Saint-Gobain, Willich - by AIR &amp; Then Road</div>
                  <div style={{ marginTop: '6px', fontSize: '12px' }}>( Transport Time Estimated between 13 - 16 days )</div>
                </td>
                <td colSpan={2} style={bd} />
                <td style={bd} />
              </tr>

              <tr>
                <td style={{ ...bd, padding: '6px 10px', fontSize: '10px' }}>
                  Note : If the total order value is less than Euro 2500, transaction fee of euro 100 per invoice shall be charged extra
                </td>
                <td colSpan={2} style={{ ...bd, padding: '6px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                  Euro
                </td>
                <td style={bd} />
              </tr>

              <tr>
                <td colSpan={3} style={{ border: '1px solid #000', padding: 0 }}>
                  <div style={{ display: 'flex', width: '100%', minHeight: '44px' }}>
                    <div style={{ width: '150px', borderRight: '1px solid #000', padding: '6px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '10px', lineHeight: 1.2 }}>Amount Chargeable</span>
                      <span style={{ fontWeight: 'bold', fontSize: '10px', lineHeight: 1.2 }}>(In words) :</span>
                    </div>
                    <div style={{ flex: 1, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Euro Thirty Three Thousand Nine Hundred Three Only</span>
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Total:-</span>
                    </div>
                  </div>
                </td>
                <td style={{ ...bd, padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', verticalAlign: 'middle' }}>
                  33,903.00
                </td>
              </tr>

            </tbody>
          </table>

          {footerNode}
        </div>
      </div>
    </div>
  )
}
