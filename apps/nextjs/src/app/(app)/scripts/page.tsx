import QRCode from "react-qr-code";

import { db } from "@on-script/db/client";
import { generateRandomSlug } from "@on-script/id";
import { Separator } from "@on-script/ui/separator";
import { Text } from "@on-script/ui/typography";

const codes = Array.from({ length: 18 }).map(() =>
  generateRandomSlug({ length: 6 }),
);

export default async function Page() {
  const scripts = await db.query.Script.findMany({
    with: {
      readings: true,
    },
  });
  console.log(codes);

  return (
    <main className="container h-full bg-white p-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col gap-8">
          {codes.map((code) => (
            <div key={code} className="flex flex-col gap-4">
              <div className="flex gap-12">
                {Array.from({ length: 3 }).map(() => (
                  <div
                    key={`${code}-${Math.random()}`} // Ensure unique key
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <QRCode
                      value={`https://on-script.vercel.app/api/s/${code}`}
                      size={128}
                    />
                    <Text variant="primary-foreground">{code}</Text>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {codes.map((code) => (
          <Text key={code} variant={"primary-foreground"}>
            {code}
          </Text>
        ))}
      </div>
    </main>
  );
}
