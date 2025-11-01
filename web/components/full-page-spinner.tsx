export function FullPageSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <s-spinner accessibilityLabel="Spinner example" size="large" />
    </div>
  );
}
