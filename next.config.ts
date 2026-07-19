import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
};

export default withPayload(withPayload(nextConfig));
