import { LearnPath } from "@/components/LearnPath";

// LearnPath is a client component that renders the whole learning path,
// including its own translated heading. No Suspense needed — it reads the
// optional `?world=` focus param from window in an effect, so it prerenders
// cleanly into the static export.
export default function LearnPage() {
  return (
    <div className="py-2">
      <LearnPath />
    </div>
  );
}
