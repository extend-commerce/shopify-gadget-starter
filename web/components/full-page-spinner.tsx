import { type CSSProperties } from 'react';

export function FullPageSpinner() {
  return (
    <div style={styles.container}>
      <s-spinner accessibilityLabel="Spinner example" size="large" />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
} as const satisfies Record<string, CSSProperties>;
