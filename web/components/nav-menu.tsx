interface NavMenuProps {
  appHandle: string | undefined | null;
}

export function NavMenu({ appHandle }: NavMenuProps) {
  return (
    <s-app-nav>
      {appHandle ? (
        <s-link href={`shopify://admin/charges/${appHandle}/pricing_plans`}>Pricing</s-link>
      ) : null}
    </s-app-nav>
  );
}
