interface CheckboxProps {
    checked: boolean;
    label: string;
    name: string;
    onChange: (value: boolean) => void
}
export const Checkbox: React.FC<CheckboxProps> = (props) => {
    const { checked, label, name, onChange } = props
    return <div>
        <label htmlFor={name}>
            {label}
            <input type="checkbox" checked={checked} id={name} name={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)} />
        </label>
    </div>
}
