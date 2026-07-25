import configPromise from "@payload-config";
import { getPayload } from "payload";

export async function GET() {
  await getPayload({
    config: configPromise,
  });

  return Response.json({
    message: "This is an example of a custom route.",
  });
}
