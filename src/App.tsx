import { useCallback, useMemo, useState } from 'react';
import { DesignPanel } from './components/DesignPanel';
import { History } from './components/History';
import { AutoIcon, Mark, MoonIcon, SunIcon } from './components/Icons';
import { Preview } from './components/Preview';
import { TypeForm } from './components/TypeForm';
import { TypePicker } from './components/TypePicker';
import { UpdatePrompt } from './components/UpdatePrompt';
import { useDebounced } from './hooks/useDebounced';
import { useTheme } from './hooks/useTheme';
import { checkColors } from './lib/contrast';
import {
    DEFAULT_DESIGN,
    effectiveErrorCorrection,
    HISTORY_KEY,
    HISTORY_LIMIT,
    type Design,
    type HistoryEntry
} from './lib/design';
import { checkCapacity } from './lib/encoding';
import { summarize, TYPE_BY_ID } from './lib/fields';
import { buildPayload, type Fields, type QrType } from './lib/payload';
import { readJson, writeJson } from './lib/storage';

const DESIGN_KEY = 'qr:design:v1';
const TYPE_KEY = 'qr:type:v1';

export default function App() {
    const { theme, cycle } = useTheme();
    const [type, setType] = useState<QrType>(() => readJson<QrType>(TYPE_KEY, 'url'));
    // Drafts are kept per type in memory only: Wi-Fi passwords shouldn't sit in localStorage.
    const [drafts, setDrafts] = useState<Partial<Record<QrType, Fields>>>({});
    const [design, setDesign] = useState<Design>(() => ({
        ...DEFAULT_DESIGN,
        ...readJson(DESIGN_KEY, {}),
        logo: null
    }));
    const [history, setHistory] = useState<HistoryEntry[]>(() => readJson<HistoryEntry[]>(HISTORY_KEY, []));
    const [touched, setTouched] = useState(false);

    const fields = useMemo(() => drafts[type] ?? {}, [drafts, type]);
    const config = TYPE_BY_ID[type];
    const payload = useMemo(() => buildPayload(type, fields), [type, fields]);
    const label = summarize(type, fields);
    const colorIssue = checkColors(design.foreground, design.background);

    // Wait for a short pause in typing before redrawing and re-verifying.
    const live = useDebounced(
        useMemo(() => ({ data: payload.data, design }), [payload.data, design]),
        150
    );
    const capacity = live.data ? checkCapacity(live.data, effectiveErrorCorrection(live.design)) : null;

    const chooseType = (next: QrType) => {
        setType(next);
        setTouched(true);
        writeJson(TYPE_KEY, next);
    };

    const updateField = (name: string, value: string) => {
        setDrafts((d) => ({ ...d, [type]: { ...d[type], [name]: value } }));
    };

    const updateDesign = (patch: Partial<Design>) => {
        setDesign((current) => {
            const next = { ...current, ...patch };
            const { logo: _logo, ...persisted } = next;
            writeJson(DESIGN_KEY, persisted);
            return next;
        });
    };

    const saveHistory = useCallback(
        (entries: HistoryEntry[]) => {
            setHistory(entries);
            writeJson(HISTORY_KEY, entries);
        },
        [setHistory]
    );

    const addToHistory = () => {
        const { logo: _logo, ...savedDesign } = design;
        // Never store Wi-Fi passwords on the device.
        const savedFields = type === 'wifi' ? { ...fields, password: '' } : fields;
        const key = JSON.stringify([type, savedFields]);
        const entry: HistoryEntry = {
            id: crypto.randomUUID?.() ?? String(Date.now()),
            type,
            fields: savedFields,
            design: savedDesign,
            label,
            createdAt: Date.now()
        };
        saveHistory(
            [entry, ...history.filter((h) => JSON.stringify([h.type, h.fields]) !== key)].slice(0, HISTORY_LIMIT)
        );
    };

    const restore = (entry: HistoryEntry) => {
        setType(entry.type);
        setDrafts((d) => ({ ...d, [entry.type]: entry.fields }));
        updateDesign(entry.design);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const ThemeIcon = theme === 'light' ? SunIcon : theme === 'dark' ? MoonIcon : AutoIcon;
    const themeLabel = { system: 'Theme: match device', light: 'Theme: light', dark: 'Theme: dark' }[theme];

    return (
        <>
            <a className="skip-link" href="#compose">
                Skip to the form
            </a>
            <UpdatePrompt />
            <header className="topbar">
                <a className="brand" href="./" aria-label="QR Generator home">
                    <Mark />
                    <span>QR Generator</span>
                </a>
                <button
                    type="button"
                    className="icon-button"
                    onClick={cycle}
                    aria-label={themeLabel}
                    title={themeLabel}
                >
                    <ThemeIcon />
                </button>
            </header>

            <main className="layout">
                <div className="compose" id="compose">
                    <h1>Make a QR code</h1>
                    <p className="lede">It’s built in your browser. Nothing you type is uploaded or tracked.</p>

                    <TypePicker value={type} onChange={chooseType} />
                    <p className="type-description">{config.description}</p>

                    <TypeForm
                        key={type}
                        fields={config.fields}
                        values={fields}
                        onChange={updateField}
                        error={payload.error}
                        warning={payload.warning}
                        autoFocusFirst={touched}
                    />

                    <DesignPanel design={design} onChange={updateDesign} colorIssue={colorIssue} />
                </div>

                <aside className="preview-col">
                    <Preview
                        data={live.data}
                        blocked={colorIssue?.level === 'error' ? colorIssue.message : undefined}
                        design={live.design}
                        label={label}
                        capacity={capacity}
                        onUsed={addToHistory}
                    />
                </aside>

                <History
                    entries={history}
                    onRestore={restore}
                    onRemove={(id) => saveHistory(history.filter((h) => h.id !== id))}
                    onClear={() => saveHistory([])}
                />
            </main>

            <footer className="footer">
                <p>
                    Made by{' '}
                    <a href="https://abhijeet-gupta-portfolio.appwrite.network/" target="_blank" rel="noopener">
                        Abhijeet Gupta
                    </a>
                    . Open source on{' '}
                    <a href="https://github.com/abhix201/QR-Code-Generator" target="_blank" rel="noopener">
                        GitHub
                    </a>
                    .
                </p>
            </footer>
        </>
    );
}
