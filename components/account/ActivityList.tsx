const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Signed in",
  PASSWORD_CHANGED: "Password changed",
  PROFILE_UPDATED: "Profile updated",
  LISTING_CREATED: "Created a listing",
  LISTING_UPDATED: "Updated a listing",
};

interface ActivityEntry {
  id: string;
  action: string;
  detail: string | null;
  createdAt: Date;
}

export function ActivityList({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-6">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              {ACTION_LABELS[entry.action] ?? entry.action}
            </span>
            {entry.detail && (
              <span className="text-neutral-400 dark:text-neutral-500"> — {entry.detail}</span>
            )}
          </div>
          <time className="text-neutral-400 dark:text-neutral-500 text-xs">
            {new Date(entry.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </li>
      ))}
    </ul>
  );
}
