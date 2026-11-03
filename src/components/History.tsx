import type { HistoryEntry } from '../lib/design';
import { TYPE_BY_ID } from '../lib/fields';
import { TYPE_ICONS, TrashIcon } from './Icons';

interface Props {
    entries: HistoryEntry[];
    onRestore: (entry: HistoryEntry) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
}

const timeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

function relative(ts: number): string {
    const minutes = Math.round((ts - Date.now()) / 60000);
    if (Math.abs(minutes) < 60) return timeFormat.format(minutes, 'minute');
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return timeFormat.format(hours, 'hour');
    return timeFormat.format(Math.round(hours / 24), 'day');
}

export function History({ entries, onRestore, onRemove, onClear }: Props) {
    return (
        <section className="history" aria-labelledby="history-heading">
            <div className="history-head">
                <h2 id="history-heading">Recent</h2>
                {entries.length > 0 && (
                    <button type="button" className="link-button" onClick={onClear}>
                        Clear all
                    </button>
                )}
            </div>
            {entries.length === 0 ? (
                <p className="history-empty">Codes you download, copy or share are kept here on this device only.</p>
            ) : (
                <ul className="history-list">
                    {entries.map((entry) => {
                        const Icon = TYPE_ICONS[entry.type];
                        return (
                            <li key={entry.id}>
                                <button type="button" className="history-item" onClick={() => onRestore(entry)}>
                                    <Icon />
                                    <span className="history-label">{entry.label}</span>
                                    <span className="history-meta">
                                        {TYPE_BY_ID[entry.type].label}, {relative(entry.createdAt)}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => onRemove(entry.id)}
                                    aria-label={`Remove ${entry.label} from recent`}
                                >
                                    <TrashIcon />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
