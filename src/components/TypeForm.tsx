import { useId, useState } from 'react';
import type { FieldConfig } from '../lib/fields';
import type { Fields } from '../lib/payload';

interface Props {
    fields: FieldConfig[];
    values: Fields;
    onChange: (name: string, value: string) => void;
    error?: string;
    warning?: string;
    /** Only move focus after the user picks a type, never on first load (avoids popping the mobile keyboard). */
    autoFocusFirst: boolean;
}

export function TypeForm({ fields, values, onChange, error, warning, autoFocusFirst }: Props) {
    const id = useId();
    const messageId = `${id}-message`;
    const visible = fields.filter((f) => !f.showIf || f.showIf(values));

    return (
        <div className="type-form">
            <div className="field-grid">
                {visible.map((field, index) => (
                    <Field
                        key={field.name}
                        id={`${id}-${field.name}`}
                        field={field}
                        value={values[field.name] ?? ''}
                        onChange={(v) => onChange(field.name, v)}
                        autoFocus={autoFocusFirst && index === 0}
                        describedBy={error || warning ? messageId : undefined}
                        invalid={Boolean(error) && index === 0}
                    />
                ))}
            </div>
            <p
                id={messageId}
                className={`form-message ${error ? 'is-error' : warning ? 'is-warning' : ''}`}
                aria-live="polite"
            >
                {error ?? warning ?? ''}
            </p>
        </div>
    );
}

interface FieldProps {
    id: string;
    field: FieldConfig;
    value: string;
    onChange: (value: string) => void;
    autoFocus: boolean;
    describedBy?: string;
    invalid: boolean;
}

function Field({ id, field, value, onChange, autoFocus, describedBy, invalid }: FieldProps) {
    const [reveal, setReveal] = useState(false);
    const hintId = field.hint ? `${id}-hint` : undefined;
    const aria = {
        'aria-describedby': [hintId, describedBy].filter(Boolean).join(' ') || undefined,
        'aria-invalid': invalid || undefined
    };
    const className = `field ${field.half ? 'field--half' : ''}`;

    if (field.kind === 'checkbox') {
        return (
            <label className={`${className} field--check`}>
                <input
                    type="checkbox"
                    checked={value === 'true'}
                    onChange={(e) => onChange(String(e.target.checked))}
                />
                <span>{field.label}</span>
            </label>
        );
    }

    return (
        <div className={className}>
            <label htmlFor={id}>{field.label}</label>
            {field.kind === 'textarea' ? (
                <textarea
                    id={id}
                    rows={3}
                    value={value}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    onChange={(e) => onChange(e.target.value)}
                    {...aria}
                />
            ) : field.kind === 'select' ? (
                <select
                    id={id}
                    value={value || field.options?.[0]?.value}
                    onChange={(e) => onChange(e.target.value)}
                    {...aria}
                >
                    {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            ) : (
                <div className={`input-row ${field.kind === 'password' || field.clearable ? 'has-action' : ''}`}>
                    <input
                        id={id}
                        type={field.kind === 'password' && !reveal ? 'password' : 'text'}
                        value={value}
                        placeholder={field.placeholder}
                        inputMode={field.inputMode}
                        autoComplete={field.autoComplete}
                        spellCheck={field.inputMode ? false : undefined}
                        autoFocus={autoFocus}
                        onChange={(e) => onChange(e.target.value)}
                        {...aria}
                    />
                    {field.kind === 'password' && (
                        <button
                            type="button"
                            className="input-action"
                            onClick={() => setReveal((r) => !r)}
                            aria-pressed={reveal}
                        >
                            {reveal ? 'Hide' : 'Show'}
                        </button>
                    )}
                    {field.clearable && value && (
                        <button
                            type="button"
                            className="input-action"
                            onClick={() => onChange('')}
                            aria-label={`Clear ${field.label}`}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
            {field.hint && (
                <p id={hintId} className="field-hint">
                    {field.hint}
                </p>
            )}
        </div>
    );
}
