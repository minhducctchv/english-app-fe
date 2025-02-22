import React from "react";

export default function RIf({
  condition,
  result1,
  result2,
}: {
  condition: boolean;
  result1: React.ReactNode;
  result2?: React.ReactNode;
}) {
  return <>{condition ? result1 : result2}</>;
}
