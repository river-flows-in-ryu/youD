import React from "react";

export default function Container({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="pb-primary sm:pb-0 w-full min-h-full">{children}</div>;
}
