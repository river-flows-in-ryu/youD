import Image from "next/image";

import spinner from "../public/spinner.gif";
import Container from "@/components/container";

export default function Loading() {
  return (
    <Container>
      <div className="flex justify-center h-full">
        <div className="m-auto">
          <Image src={spinner} alt="loading" priority={true} />
        </div>
      </div>
    </Container>
  );
}
