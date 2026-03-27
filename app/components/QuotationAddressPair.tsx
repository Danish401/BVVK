function getAddrText(data: any, kind: 'shipping' | 'billing') {
  if (!data) return null
  const name = kind === 'shipping' ? data.Shipping_Address_Name : data.Billing_Address_Name
  const street = kind === 'shipping' ? data.Shipping_Street : data.Billing_Street
  const city = kind === 'shipping' ? data.Shipping_City : data.Billing_City
  const state = kind === 'shipping' ? data.Shipping_State : data.Billing_State
  const postal = kind === 'shipping' ? data.Shipping_Postal_Code : data.Billing_Postal_Code
  const country = kind === 'shipping' ? data.Shipping_Country : data.Billing_Country

  return (
    <div className="quotation-address-plain">
      {name && <div className="quotation-address-plain__line quotation-address-plain__line--bold">{name}</div>}
      {data.Parent_Account && (
        <div className="quotation-address-plain__line quotation-address-plain__line--bold">{data.Parent_Account}</div>
      )}
      {street && <div className="quotation-address-plain__line">{street}</div>}
      {(city || state || postal) && (
        <div className="quotation-address-plain__line">
          {[city, state].filter(Boolean).join(', ')}
          {postal ? ` ${postal}` : ''}
        </div>
      )}
      {country && <div className="quotation-address-plain__line">{country}</div>}
    </div>
  )
}

/**
 * Unified table layout for Consignee & Recipient
 * Ensures strict row alignment across left and right sides.
 */
export default function QuotationAddressPair({
  shippingData,
  billingData,
}: {
  shippingData?: any
  billingData?: any
}) {
  const sStateCode = shippingData?.Shipping_State_Code ?? ''
  const sState = shippingData?.Shipping_State ?? ''
  const sGst = shippingData?.Shipping_GST_No ?? ''

  const bStateCode = billingData?.Billing_State_Code ?? ''
  const bState = billingData?.Billing_State ?? ''
  const bGst = billingData?.Billing_GST_No ?? ''

  return (
    <div className="quotation-stack-segment">
      <table className="quotation-address-pair-table">
        <colgroup>
          {/* Shipped To (50%) */}
          <col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} />
          {/* Billed To (50%) */}
          <col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} />
        </colgroup>
        <tbody>
          <tr>
            <th colSpan={4} className="qap-header qap-header--left">Detail Of Consignee/Shipped To</th>
            <th colSpan={4} className="qap-header qap-header--right">Detail Of Recipient/Billed To</th>
          </tr>
          <tr>
            <td colSpan={4} className="qap-address-cell qap-address-cell--left">
              {shippingData ? getAddrText(shippingData, 'shipping') : <div className="quotation-address-pair__empty">No shipping data available</div>}
            </td>
            <td colSpan={4} className="qap-address-cell qap-address-cell--right">
              {billingData ? getAddrText(billingData, 'billing') : <div className="quotation-address-pair__empty">No billing data available</div>}
            </td>
          </tr>
          <tr>
            <th className="qap-label qap-cell--left">State Code</th>
            <td className="qap-value qap-cell--left">{sStateCode}</td>
            <th className="qap-label qap-cell--left">State</th>
            <td className="qap-value qap-cell--left">{sState}</td>

            <th className="qap-label qap-cell--right">State Code</th>
            <td className="qap-value qap-cell--right">{bStateCode}</td>
            <th className="qap-label qap-cell--right">State</th>
            <td className="qap-value qap-cell--right">{bState}</td>
          </tr>
          <tr>
            <th className="qap-label qap-cell--left">GST Number</th>
            <td colSpan={3} className="qap-value qap-cell--left">{sGst}</td>
            
            <th className="qap-label qap-cell--right">GST Number</th>
            <td colSpan={3} className="qap-value qap-cell--right">{bGst}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
