type Props = {
  taxcode: string;
  businessName: string;
  productId: string;
  subunit: string;
  subunitCode: string | undefined;
};
function Header({
  taxcode,
  businessName,
  productId,
  subunit,
  subunitCode,
}: Props) {
  const isSubunit = subunit === "AOO" || subunit === "UO";
  return (
    <div className="ui:bg-pagopa-primary ui:text-white  flex gap-4 justify-between items-center py-12 px-4 -mx-6 mb-8">
      <div>{taxcode}</div>
      {isSubunit && <div>{subunitCode}</div>}
      <div>{businessName}</div>
      <div>{productId}</div>
    </div>
  );
}

export default Header;
