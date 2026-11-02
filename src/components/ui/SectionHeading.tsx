type Props = {
  id: string;
  index: string;
  title: string;
  fig: string;
};

export function SectionHeading({ id, index, title, fig }: Props) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 id={id} className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        <span className="font-mono text-base font-normal text-accent-ink">{index}.</span>
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
      <span className="label hidden sm:inline">{fig}</span>
    </div>
  );
}
