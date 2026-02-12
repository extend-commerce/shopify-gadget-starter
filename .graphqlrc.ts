import { ApiType, shopifyApiProject } from '@shopify/api-codegen-preset';
import { ApiVersion } from '@shopify/shopify-api';
import fs from 'fs';
import { type IGraphQLConfig } from 'graphql-config';

function getConfig() {
  const config: IGraphQLConfig = {
    projects: {
      default: shopifyApiProject({
        apiType: ApiType.Admin,
        apiVersion: ApiVersion.January26,
        documents: [
          './web/**/*.{js,ts,jsx,tsx}',
          './api/**/*.{js,ts,jsx,tsx}',
          './shared/**/*.{js,ts,jsx,tsx}',
        ],
        outputDir: './shared/_generated',
        declarations: false,
        enumsAsConst: true,
      }),
    },
  };

  let extensions: string[] = [];
  try {
    extensions = fs.readdirSync('./extensions');
  } catch {
    // ignore if no extensions
  }

  for (const entry of extensions) {
    const extensionPath = `./extensions/${entry}`;
    const schema = `${extensionPath}/schema.graphql`;
    if (!fs.existsSync(schema)) continue;

    config.projects[entry] = {
      schema,
      documents: [`${extensionPath}/**/*.graphql`],
    };
  }

  return config;
}

export default getConfig();
