import { useId, useRef } from 'react';
import type { ColorIssue } from '../lib/contrast';
import { CORNER_STYLES, DEFAULT_DESIGN, DOT_STYLES, ERROR_LEVELS, type Design } from '../lib/design';
import { useToast } from '../hooks/useToast';

interface Props {
    design: Design;
    onChange: (patch: Partial<Design>) => void;
    colorIssue: ColorIssue;
}

const MAX_LOGO_BYTES = 1024 * 1024;

export function DesignPanel({ design, onChange, colorIssue }: Props) {
    const id = useId();
    const fileRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const isDefault = JSON.stringify(design) === JSON.stringify(DEFAULT_DESIGN);

    const onLogo = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return toast('Choose an image file (PNG, JPG or SVG).', 'error');
        if (file.size > MAX_LOGO_BYTES) return toast('The logo must be under 1 MB.', 'error');
        const reader = new FileReader();
        reader.onload = () => onChange({ logo: String(reader.result) });
        reader.readAsDataURL(file);
    };

    return (
        <details className="design-panel">
            <summary>
                <span>Design</span>
                <span className="summary-meta">Colours, shape, logo</span>
            </summary>

            <div className="design-body">
                <div className="design-row">
                    <ColorField
                        label="Code colour"
                        value={design.foreground}
                        onChange={(foreground) => onChange({ foreground })}
                    />
                    <ColorField
                        label="Background"
                        value={design.background}
                        onChange={(background) => onChange({ background })}
                    />
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => onChange({ foreground: design.background, background: design.foreground })}
                    >
                        Swap
                    </button>
                </div>
                {colorIssue && (
                    <p className={`form-message ${colorIssue.level === 'error' ? 'is-error' : 'is-warning'}`}>
                        {colorIssue.message}
                    </p>
                )}

                <ChoiceGroup
                    legend="Dots"
                    name={`${id}-dots`}
                    value={design.dotStyle}
                    options={DOT_STYLES}
                    onChange={(dotStyle) => onChange({ dotStyle })}
                />
                <ChoiceGroup
                    legend="Corners"
                    name={`${id}-corners`}
                    value={design.cornerStyle}
                    options={CORNER_STYLES}
                    onChange={(cornerStyle) => onChange({ cornerStyle })}
                />

                <div className="field">
                    <span className="field-label">Logo</span>
                    <div className="logo-row">
                        {design.logo ? (
                            <>
                                <img src={design.logo} alt="" className="logo-thumb" />
                                <button type="button" className="link-button" onClick={() => onChange({ logo: null })}>
                                    Remove logo
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="button button--quiet"
                                onClick={() => fileRef.current?.click()}
                            >
                                Add a logo
                            </button>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                onLogo(e.target.files?.[0]);
                                e.target.value = '';
                            }}
                        />
                    </div>
                    <p className="field-hint">
                        {design.logo
                            ? 'Error correction is set to Maximum so the code still scans under the logo.'
                            : 'Square logos with a plain background work best. Under 1 MB.'}
                    </p>
                </div>

                <div className="design-row design-row--split">
                    <div className="field">
                        <label htmlFor={`${id}-ecc`}>Error correction</label>
                        <select
                            id={`${id}-ecc`}
                            value={design.logo ? 'H' : design.errorCorrection}
                            disabled={Boolean(design.logo)}
                            onChange={(e) => onChange({ errorCorrection: e.target.value as Design['errorCorrection'] })}
                        >
                            {ERROR_LEVELS.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label} — {level.hint}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor={`${id}-margin`}>Border ({design.margin}px)</label>
                        <input
                            id={`${id}-margin`}
                            type="range"
                            min={0}
                            max={40}
                            step={2}
                            value={design.margin}
                            onChange={(e) => onChange({ margin: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {!isDefault && (
                    <button type="button" className="link-button" onClick={() => onChange(DEFAULT_DESIGN)}>
                        Reset design
                    </button>
                )}
            </div>
        </details>
    );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const id = useId();
    return (
        <div className="color-field">
            <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} />
            <label htmlFor={id}>
                {label}
                <span className="color-value">{value.toUpperCase()}</span>
            </label>
        </div>
    );
}

interface ChoiceGroupProps<T extends string> {
    legend: string;
    name: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
}

function ChoiceGroup<T extends string>({ legend, name, value, options, onChange }: ChoiceGroupProps<T>) {
    return (
        <fieldset className="choice-group">
            <legend className="field-label">{legend}</legend>
            <div className="choices">
                {options.map((o) => (
                    <label key={o.value} className="choice">
                        <input
                            type="radio"
                            name={name}
                            checked={value === o.value}
                            onChange={() => onChange(o.value)}
                        />
                        <span>{o.label}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
