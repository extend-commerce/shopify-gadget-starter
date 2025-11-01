export default function NotFound() {
  return (
    <s-page>
      <s-section>
        <s-stack direction="block" gap="base" alignItems="center">
          <s-heading>404</s-heading>
          <s-text>Page Not Found</s-text>
          <s-link href="/">Return to Home</s-link>
        </s-stack>
      </s-section>
    </s-page>
  );
}
