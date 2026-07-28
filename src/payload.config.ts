import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Products } from "./collections/Products";
import { Reviews } from "./collections/Reviews";
import { Tags } from "./collections/Tags";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { isSuperAdmin } from "./lib/access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const payloadSecret = process.env.PAYLOAD_SECRET;
if (!payloadSecret) {
  throw new Error(
    "CRITICAL: PAYLOAD_SECRET is not set in the environment variables.",
  );
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "CRITICAL: DATABASE_URL is not set in the environment variables.",
  );
}

const blobReadWriteToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!blobReadWriteToken) {
  throw new Error(
    "CRITICAL: BLOB_READ_WRITE_TOKEN is not set in the environment variables.",
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: ["@/components/stripe-verify#StripeVerify"],
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Tenants,
    Orders,
    Reviews,
  ],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: databaseUrl,
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      collections: {
        products: {},
        media: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        media: true,
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: blobReadWriteToken,
    }),
  ],
});
