import AddressStateTaxGrid from './AddressStateTaxGrid'

function AddressColumn({
  title,
  data,
  emptyMessage,
  kind,
}: {
  title: string
  data: any | null | undefined
  emptyMessage: string
  kind: 'shipping' | 'billing'
}) {
  if (!data) {
    return (
      <div className="quotation-address-pair__col">
        <div className="quotation-address-pair__header">{title}</div>
        <div className="quotation-address-pair__empty">{emptyMessage}</div>
      </div>
    )
  }

  const name = kind === 'shipping' ? data.Shipping_Address_Name : data.Billing_Address_Name
  const street = kind === 'shipping' ? data.Shipping_Street : data.Billing_Street
  const city = kind === 'shipping' ? data.Shipping_City : data.Billing_City
  const state = kind === 'shipping' ? data.Shipping_State : data.Billing_State
  const postal = kind === 'shipping' ? data.Shipping_Postal_Code : data.Billing_Postal_Code
  const country = kind === 'shipping' ? data.Shipping_Country : data.Billing_Country
  const stateCode = kind === 'shipping' ? data.Shipping_State_Code : data.Billing_State_Code
  const gstNo = kind === 'shipping' ? data.Shipping_GST_No : data.Billing_GST_No

  return (
    <div className="quotation-address-pair__col">
      <div className="quotation-address-pair__header">{title}</div>
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
      <AddressStateTaxGrid stateCode={stateCode} stateName={state} gstNo={gstNo} />
    </div>
  )
}

/**
 * Compact two-column consignee / recipient (invoice-style): gray header band, tight address, State/GST table.
 */
export default function QuotationAddressPair({
  shippingData,
  billingData,
}: {
  shippingData?: any
  billingData?: any
}) {
  return (
    <div className="quotation-address-pair quotation-stack-segment">
      <AddressColumn
        title="Detail Of Consignee/Shipped To"
        data={shippingData}
        emptyMessage="No shipping data available"
        kind="shipping"
      />
      <AddressColumn
        title="Detail Of Recipient/Billed To"
        data={billingData}
        emptyMessage="No billing data available"
        kind="billing"
      />
    </div>
  )
}
