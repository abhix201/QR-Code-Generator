import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import type { Design } from '../lib/design';
import type { CapacityInfo } from '../lib/encoding';
import { slugify } from '../lib/fields';
import { buildOptions, downloadBlob, PREVIEW_SIZE, renderBlob, verifyScan, type ExportFormat } from '../lib/qr';
import { useToast } from '../hooks/useToast';
import { AlertIcon, CheckIcon, CopyIcon, DownloadIcon, ShareIcon } from './Icons';

interface Props {
    data: string | null;
    design: Design;
    label: string;
    capacity: CapacityInfo | null;
    /** Reason the code can't be shown (e.g. colours too similar). */
    blocked?: string;
    /** Called after a successful download, copy or share, so the code can be added to Recent. */
    onUsed: () => void;
}

type ScanState = 'idle' | 'checking' | 'ok' | 'fail';

const SIZES = [
    { value: 512, label: '512 px, for screens' },
    { value: 1024, label: '1024 px, for print' },
    { value: 2048, label: '2048 px, for posters' }
];

const canShare = (() => {
    try {
        return !!navigator.canShare?.({ files: [new File([''], 'probe.png', { type: 'image/png' })] });
    } catch {
        return false;
    }
})();

const canCopyImage = typeof window !== 'undefined' && 'ClipboardItem' in window && !!navigator.clipboard?.write;

export function Preview({ data, design, label, capacity, blocked, onUsed }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [format, setFormat] = useState<ExportFormat>('png');
    const [size, setSize] = useState(1024);
    const toast = useToast();

    const tooBig = capacity !== null && !capacity.fits;
    const ready = data !== null && !tooBig && !blocked;

    // Draw the live preview. qr-code-styling's update() doesn't reliably restyle an appended SVG,
    // so each change renders a fresh one. Input is debounced, so this runs only on pauses.
    useEffect(() => {
        const container = containerRef.current;
        if (!ready || !container) return;
        const qr = new QRCodeStyling(buildOptions(data, design, PREVIEW_SIZE, 'svg'));
        container.replaceChildren();
        qr.append(container);
    }, [ready, data, design]);

    // Decode the rendered code to prove it scans. Results are tied to the exact inputs they were
    // computed for, so a slow check never labels newer edits.
    const [result, setResult] = useState<{ data: string; design: Design; ok: boolean } | null>(null);
    useEffect(() => {
        if (!ready) return;
        let stale = false;
        verifyScan(data, design)
            .then((ok) => !stale && setResult({ data, design, ok }))
            .catch(() => !stale && setResult({ data, design, ok: false }));
        return () => {
            stale = true;
        };
    }, [ready, data, design]);
    const scan: ScanState = !ready
        ? 'idle'
        : result && result.data === data && result.design === design
          ? result.ok
              ? 'ok'
              : 'fail'
          : 'checking';

    const filename = `qr-${slugify(label)}.${format}`;

    const download = async () => {
        if (!data) return;
        try {
            downloadBlob(await renderBlob(data, design, format, size), filename);
            toast(`Downloaded ${filename}`);
            onUsed();
        } catch {
            toast('The image couldn’t be created. Try PNG or a smaller size.', 'error');
        }
    };

    const copy = async () => {
        if (!data) return;
        try {
            // Pass the promise straight to ClipboardItem; Safari requires the write to start synchronously.
            const blob = renderBlob(data, design, 'png', size);
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            toast('Image copied. Paste it into a document or chat.');
            onUsed();
        } catch {
            toast('Your browser blocked copying images. Use Download instead.', 'error');
        }
    };

    const share = async () => {
        if (!data) return;
        try {
            const blob = await renderBlob(data, design, 'png', size);
            await navigator.share({
                files: [new File([blob], `qr-${slugify(label)}.png`, { type: 'image/png' })],
                title: label
            });
            onUsed();
        } catch (error) {
            if ((error as Error).name !== 'AbortError')
                toast('Sharing didn’t work here. Use Download instead.', 'error');
        }
    };

    return (
        <section className="preview" aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="sr-only">
                Preview
            </h2>

            <div
                className={`stage ${scan === 'checking' ? 'is-scanning' : ''}`}
                style={{ background: ready ? design.background : undefined }}
            >
                {ready ? (
                    <div ref={containerRef} className="qr-canvas" role="img" aria-label={`QR code for ${label}`} />
                ) : (
                    <EmptyStage tooBig={tooBig} capacity={capacity} blocked={data !== null ? blocked : undefined} />
                )}
                <span className="scan-line" aria-hidden="true" />
            </div>

            <ScanStatus state={scan} />

            {capacity && ready && (
                <p className="capacity">
                    {capacity.bytes.toLocaleString()} of {capacity.max.toLocaleString()} bytes
                    {capacity.dense && '. Dense code: print it at least 3 cm wide.'}
                </p>
            )}

            <div className="export" aria-disabled={!ready}>
                <div className="export-options">
                    <div className="segmented" role="radiogroup" aria-label="File type">
                        {(['png', 'svg'] as const).map((f) => (
                            <label key={f}>
                                <input
                                    type="radio"
                                    name="format"
                                    checked={format === f}
                                    onChange={() => setFormat(f)}
                                />
                                <span>{f.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>
                    {format === 'png' ? (
                        <select aria-label="Image size" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                            {SIZES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="export-note">Scales to any size</span>
                    )}
                </div>

                <button type="button" className="button button--primary" onClick={download} disabled={!ready}>
                    <DownloadIcon />
                    Download {format.toUpperCase()}
                </button>
                <div className="export-secondary">
                    {canCopyImage && (
                        <button type="button" className="button" onClick={copy} disabled={!ready}>
                            <CopyIcon />
                            Copy image
                        </button>
                    )}
                    {canShare && (
                        <button type="button" className="button" onClick={share} disabled={!ready}>
                            <ShareIcon />
                            Share
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

function EmptyStage({
    tooBig,
    capacity,
    blocked
}: {
    tooBig: boolean;
    capacity: CapacityInfo | null;
    blocked?: string;
}) {
    if (blocked) {
        return (
            <div className="empty">
                <p className="empty-title">This code wouldn’t scan</p>
                <p>{blocked}</p>
            </div>
        );
    }
    if (tooBig && capacity) {
        return (
            <div className="empty">
                <p className="empty-title">Too much to fit in one code</p>
                <p>
                    {capacity.bytes.toLocaleString()} bytes; the limit at this error correction is{' '}
                    {capacity.max.toLocaleString()}. Shorten the content or lower error correction under Design.
                </p>
            </div>
        );
    }
    return (
        <div className="empty">
            <svg className="empty-ghost" viewBox="0 0 21 21" aria-hidden="true">
                <path d="M0 0h7v7H0zM14 0h7v7h-7zM0 14h7v7H0z" />
                <path d="M2 2h3v3H2zM16 2h3v3h-3zM2 16h3v3H2z" className="inner" />
            </svg>
            <p className="empty-title">Your code appears here</p>
            <p>Fill in the details and it updates as you type.</p>
        </div>
    );
}

function ScanStatus({ state }: { state: ScanState }) {
    const content = {
        idle: null,
        checking: <span className="scan-status">Checking it scans…</span>,
        ok: (
            <span className="scan-status is-ok">
                <CheckIcon /> Scans correctly
            </span>
        ),
        fail: (
            <span className="scan-status is-fail">
                <AlertIcon /> Couldn’t read this code back. Raise the contrast, use a smaller logo or a higher error
                correction.
            </span>
        )
    }[state];
    return (
        <div className="scan-status-row" aria-live="polite">
            {content}
        </div>
    );
}
