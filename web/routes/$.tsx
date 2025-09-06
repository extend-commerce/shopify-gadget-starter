import { Card, Link, Page, Text } from '@shopify/polaris';
import { type CSSProperties } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
} as const satisfies Record<string, CSSProperties>;

export default function NotFound() {
  return (
    <Page>
      <Card>
        <div style={styles.container}>
          <Text variant="heading3xl" as="h2">
            404
          </Text>
          <Text variant="headingMd" as="h6">
            Page Not Found
          </Text>
          <Link url="/">Return to Home</Link>
        </div>
      </Card>
    </Page>
  );
}
