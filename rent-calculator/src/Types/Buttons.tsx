export type NewTabButtonProps = {
  onClick: () => void;
};

export type HistoryButtonProps = {
  showHistory: boolean;
  onClick: () => void;
};

type ArrowDirection = "left" | "right";

export type ArrowButtonProps = {
  direction: ArrowDirection;
  onClick: () => void;
};
