import { TYPES } from '../lib/fields';
import type { QrType } from '../lib/payload';
import { TYPE_ICONS } from './Icons';

interface Props {
    value: QrType;
    onChange: (type: QrType) => void;
}

/** Native radio buttons styled as chips: arrow keys and screen readers work for free. */
export function TypePicker({ value, onChange }: Props) {
    return (
        <fieldset className="type-picker">
            <legend className="sr-only">What should the code do?</legend>
            {TYPES.map(({ type, label }) => {
                const Icon = TYPE_ICONS[type];
                return (
                    <label key={type} className="type-chip">
                        <input
                            type="radio"
                            name="qr-type"
                            value={type}
                            checked={value === type}
                            onChange={() => onChange(type)}
                        />
                        <Icon />
                        <span>{label}</span>
                    </label>
                );
            })}
        </fieldset>
    );
}
