import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Loader2,
} from 'lucide-react';
import { migrateCurrentBrowserFixtures } from '../../services/fixtureMigrationService';

interface FixtureMigrationButtonProps {
  onMigrated?: () => void | Promise<void>;
}

export const FixtureMigrationButton: React.FC<
  FixtureMigrationButtonProps
> = ({ onMigrated }) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMigration = async () => {
    if (isMigrating) return;

    const confirmed = window.confirm(
      'এই browser-এর local fixtures Supabase-এ migrate করবে? এটি শুধু তখনই চালাও যখন এই browser-এ তোমার আসল 55টি scheduled fixture আছে।'
    );

    if (!confirmed) return;

    setIsMigrating(true);
    setMessage(null);
    setIsSuccess(false);

    try {
      const result = await migrateCurrentBrowserFixtures();

      setIsSuccess(true);
      setMessage(
        `${result.migrated} fixtures successfully migrated and verified in Supabase.`
      );

      if (onMigrated) {
        await onMigrated();
      }
    } catch (error) {
      const text =
        error instanceof Error
          ? error.message
          : 'Fixture migration failed.';

      setIsSuccess(false);
      setMessage(text);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleMigration}
        disabled={isMigrating || isSuccess}
        className="h-9 px-4 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
      >
        {isMigrating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Database className="w-4 h-4" />
        )}

        <span>
          {isMigrating
            ? 'Migrating Fixtures...'
            : isSuccess
              ? 'Fixtures Migrated'
              : 'Migrate Local Fixtures to Supabase'}
        </span>
      </button>

      {message && (
        <div
          className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
            isSuccess
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/50 border-rose-800 text-rose-300'
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          )}

          <span>{message}</span>
        </div>
      )}
    </div>
  );
};