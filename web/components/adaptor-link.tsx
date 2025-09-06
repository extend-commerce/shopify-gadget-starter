// from https://polaris.shopify.com/components/utilities/app-provider#using-linkcomponent
import { type AppProviderProps } from '@shopify/polaris';
import { type ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router';

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

export function AdaptorLink({
  children,
  url = '',
  external,
  ...rest
}: ComponentProps<NonNullable<AppProviderProps['linkComponent']>>) {
  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    rest.target = '_blank';
    rest.rel = 'noopener noreferrer';
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={url} {...rest}>
      {children}
    </RouterLink>
  );
}
