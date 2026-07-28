import config from "@payload-config";
import type { BasePayload, CollectionSlug } from "payload";
import { getPayload } from "payload";

import type { Category, Tenant } from "@/payload-types";

import { stripe } from "./lib/stripe";

/** Shape of a subcategory entry in the seed data. */
interface Subcategory {
  name: string;
  slug: string;
}

/** Shape of a top-level category entry in the seed data. */
interface CategorySeed {
  name: string;
  slug: string;
  color?: string;
  subcategories?: Subcategory[];
}

/** Slug and name used for the default admin tenant. */
const ADMIN_TENANT_SLUG = "admin";

/** Credentials used for the default admin user. */
const ADMIN_USER_EMAIL = "admin@demo.com";
const ADMIN_USER_PASSWORD = "demo";
const ADMIN_USER_USERNAME = "admin";

/**
 * Seed data describing the full category tree (top-level categories plus
 * their nested subcategories) that should exist in the CMS.
 *
 * @type {CategorySeed[]}
 */
const categories: CategorySeed[] = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Business & Money",
    color: "#FFB347",
    slug: "business-money",
    subcategories: [
      { name: "Accounting", slug: "accounting" },
      { name: "Entrepreneurship", slug: "entrepreneurship" },
      { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
      { name: "Investing", slug: "investing" },
      { name: "Management & Leadership", slug: "management-leadership" },
      { name: "Marketing & Sales", slug: "marketing-sales" },
      { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
      { name: "Personal Finance", slug: "personal-finance" },
      { name: "Real Estate", slug: "real-estate" },
    ],
  },
  {
    name: "Software Development",
    color: "#7EC8E3",
    slug: "software-development",
    subcategories: [
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Development", slug: "mobile-development" },
      { name: "Game Development", slug: "game-development" },
      { name: "Programming Languages", slug: "programming-languages" },
      { name: "DevOps", slug: "devops" },
    ],
  },
  {
    name: "Writing & Publishing",
    color: "#D8B5FF",
    slug: "writing-publishing",
    subcategories: [
      { name: "Fiction", slug: "fiction" },
      { name: "Non-Fiction", slug: "non-fiction" },
      { name: "Blogging", slug: "blogging" },
      { name: "Copywriting", slug: "copywriting" },
      { name: "Self-Publishing", slug: "self-publishing" },
    ],
  },
  {
    name: "Other",
    slug: "other",
  },
  {
    name: "Education",
    color: "#FFE066",
    slug: "education",
    subcategories: [
      { name: "Online Courses", slug: "online-courses" },
      { name: "Tutoring", slug: "tutoring" },
      { name: "Test Preparation", slug: "test-preparation" },
      { name: "Language Learning", slug: "language-learning" },
    ],
  },
  {
    name: "Self Improvement",
    color: "#96E6B3",
    slug: "self-improvement",
    subcategories: [
      { name: "Productivity", slug: "productivity" },
      { name: "Personal Development", slug: "personal-development" },
      { name: "Mindfulness", slug: "mindfulness" },
      { name: "Career Growth", slug: "career-growth" },
    ],
  },
  {
    name: "Fitness & Health",
    color: "#FF9AA2",
    slug: "fitness-health",
    subcategories: [
      { name: "Workout Plans", slug: "workout-plans" },
      { name: "Nutrition", slug: "nutrition" },
      { name: "Mental Health", slug: "mental-health" },
      { name: "Yoga", slug: "yoga" },
    ],
  },
  {
    name: "Design",
    color: "#B5B9FF",
    slug: "design",
    subcategories: [
      { name: "UI/UX", slug: "ui-ux" },
      { name: "Graphic Design", slug: "graphic-design" },
      { name: "3D Modeling", slug: "3d-modeling" },
      { name: "Typography", slug: "typography" },
    ],
  },
  {
    name: "Drawing & Painting",
    color: "#FFCAB0",
    slug: "drawing-painting",
    subcategories: [
      { name: "Watercolor", slug: "watercolor" },
      { name: "Acrylic", slug: "acrylic" },
      { name: "Oil", slug: "oil" },
      { name: "Pastel", slug: "pastel" },
      { name: "Charcoal", slug: "charcoal" },
    ],
  },
  {
    name: "Music",
    color: "#FFD700",
    slug: "music",
    subcategories: [
      { name: "Songwriting", slug: "songwriting" },
      { name: "Music Production", slug: "music-production" },
      { name: "Music Theory", slug: "music-theory" },
      { name: "Music History", slug: "music-history" },
    ],
  },
  {
    name: "Photography",
    color: "#FF6B6B",
    slug: "photography",
    subcategories: [
      { name: "Portrait", slug: "portrait" },
      { name: "Landscape", slug: "landscape" },
      { name: "Street Photography", slug: "street-photography" },
      { name: "Nature", slug: "nature" },
      { name: "Macro", slug: "macro" },
    ],
  },
];

/**
 * Retrieves the first document in `collection` whose `field` equals `value`.
 * Only a single document is requested since callers only ever need `docs[0]`.
 */
async function findFirstByField<T = Record<string, unknown>>(
  payload: BasePayload,
  collection: CollectionSlug,
  field: string,
  value: string,
): Promise<T | undefined> {
  const { docs } = await payload.find({
    collection,
    where: {
      [field]: {
        equals: value,
      },
    },
    limit: 1,
  });

  return docs[0] as T | undefined;
}

/**
 * Ensures the admin tenant exists, creating it if necessary.
 *
 * A new Stripe account is only created when the tenant does not yet exist,
 * so rerunning the seed reuses the existing tenant without leaking accounts.
 */
async function ensureAdminTenant(payload: BasePayload): Promise<Tenant> {
  const existingTenant = await findFirstByField<Tenant>(
    payload,
    "tenants",
    "slug",
    ADMIN_TENANT_SLUG,
  );

  if (existingTenant) {
    console.log("Admin tenant already exists, reusing it.");
    return existingTenant;
  }

  const adminAccount = await stripe.accounts.create({});

  if (!adminAccount.id) {
    throw new Error("Failed to create Stripe account");
  }

  const tenant = await payload.create({
    collection: "tenants",
    data: {
      name: ADMIN_TENANT_SLUG,
      slug: ADMIN_TENANT_SLUG,
      stripeAccountId: adminAccount.id,
    },
  });
  console.log("Created admin tenant.");
  return tenant;
}

/**
 * Ensures the default admin user exists, creating and linking it to the
 * given tenant if necessary.
 */
async function ensureAdminUser(payload: BasePayload, adminTenant: Tenant) {
  const existingUser = await findFirstByField(
    payload,
    "users",
    "email",
    ADMIN_USER_EMAIL,
  );

  if (existingUser) {
    console.log("Admin user already exists, skipping creation.");
    return;
  }

  await payload.create({
    collection: "users",
    data: {
      email: ADMIN_USER_EMAIL,
      password: ADMIN_USER_PASSWORD,
      roles: ["super-admin"],
      username: ADMIN_USER_USERNAME,
      tenants: [
        {
          tenant: adminTenant.id,
        },
      ],
    },
  });
  console.log("Created admin user.");
}

/**
 * Ensures a single top-level category exists, creating it if necessary.
 */
async function ensureParentCategory(
  payload: BasePayload,
  category: CategorySeed,
): Promise<Category> {
  const existing = await findFirstByField<Category>(
    payload,
    "categories",
    "slug",
    category.slug,
  );

  if (existing) {
    console.log(
      `Parent category '${category.name}' already exists, reusing it.`,
    );
    return existing;
  }

  const created = await payload.create({
    collection: "categories",
    data: {
      name: category.name,
      slug: category.slug,
      color: category.color,
      parent: null,
    },
  });
  console.log(`Created parent category '${category.name}'.`);
  return created;
}

/**
 * Ensures a single subcategory exists under the given parent category,
 * creating it if necessary.
 */
async function ensureSubCategory(
  payload: BasePayload,
  subCategory: Subcategory,
  parentCategory: Category,
) {
  const existing = await findFirstByField(
    payload,
    "categories",
    "slug",
    subCategory.slug,
  );

  if (existing) {
    console.log(`Subcategory '${subCategory.name}' already exists, skipping.`);
    return;
  }

  await payload.create({
    collection: "categories",
    data: {
      name: subCategory.name,
      slug: subCategory.slug,
      parent: parentCategory.id,
    },
  });
  console.log(`Created subcategory '${subCategory.name}'.`);
}

/**
 * Seeds the database with the default admin tenant, admin user and the full
 * category/subcategory tree. Safe to run multiple times: existing records
 * are detected via their unique slug/email and reused rather than
 * duplicated.
 *
 * @returns {Promise<void>}
 */
async function seed() {
  const payload = await getPayload({ config });

  const adminTenant = await ensureAdminTenant(payload);
  await ensureAdminUser(payload, adminTenant);

  for (const category of categories) {
    const parentCategory = await ensureParentCategory(payload, category);

    for (const subCategory of category.subcategories || []) {
      await ensureSubCategory(payload, subCategory, parentCategory);
    }
  }
}

// Script entry point: run the seed routine and exit with an appropriate
// status code so it can be used reliably in CI/CD pipelines.
try {
  await seed();
  console.log("Seeding completed successfully");
  process.exit(0);
} catch (error) {
  console.dir(error, { depth: null });
  process.exit(1); // Exit with error code
}
