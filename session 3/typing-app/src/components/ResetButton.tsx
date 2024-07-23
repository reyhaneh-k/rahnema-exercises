import React from "react";
export default function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="retryButton" onClick={onClick}>
      Reset
    </button>
  );
}
