import { Input } from 'antd';


interface TextAreaProps {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | false;
}

const TextInput: React.FC<TextAreaProps> = ({ id, name, label, placeholder, required, value, onChange, error }) => {
    return (

        <div>
            <label className="">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Input
                id={id}
                name={name}
                status={error ? 'error' : undefined}
                placeholder={placeholder || "Enter your text here..."}
                maxLength={255}
                size='large'
                className='w-full'
                value={value}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e);
                    }
                }}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
    );
}

export default TextInput;