interface Props {
  shippingCompanyId: string | null;
  trackingNumber: string | null;
}

export default async function trackingInfoFetch({
  shippingCompanyId,
  trackingNumber,
}: Props) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

  const res = await fetch("https://auth.tracker.delivery/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });
  const jsonData = await res.json();

  if (!jsonData.access_token) {
    throw new Error("Failed to get access token");
  }

  let trackResponse = await fetch("https://apis.tracker.delivery/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `TRACKQL-API-KEY ${clientId}:${clientSecret}`,
    },
    body: JSON.stringify({
      query: `query Track(
        $carrierId: ID!,
        $trackingNumber: String!
      ) {
        track(
          carrierId: $carrierId,
          trackingNumber: $trackingNumber
        ) {
          lastEvent {
            time
            status {
              code
              name
            }
            description
          }
          events(last: 15) {
            edges {
              node {
                time
                status {
                  code
                  name
                }
                description
              }
            }
          }
        }
      }`.trim(),
      variables: {
        carrierId: shippingCompanyId,
        trackingNumber: trackingNumber,
      },
    }),
  });
  const data = await trackResponse.json();
  return data?.data?.track?.events?.edges?.reverse()?.slice(1);
}
