type LoadingProps = {
  visible: boolean;
};

export function Loading({ visible }: LoadingProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontSize: "1.5rem",
        color: "#363636",
      }}
    >
      読み込み中...
    </div>
  );
}
