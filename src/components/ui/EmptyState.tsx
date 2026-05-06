interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <p
        className="text-[13px] tracking-[0.16em] uppercase mb-2"
        style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
      >
        {title}
      </p>
      {description && (
        <p className="text-sm mt-2" style={{ color: "var(--muted-2)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
