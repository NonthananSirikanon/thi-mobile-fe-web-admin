import { Input } from 'antd';

const { TextArea } = Input;

interface TextAreaProps {
    id?: string;
    name?: string;
    value?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string | false;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput: React.FC<TextAreaProps> = ({ label, placeholder, required, id, name, value, error, onChange }) => {
    return (

        <div>
            <label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <TextArea
                id={id}
                name={name}
                value={value}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e);
                    }
                }}
                // ? uncomment to show character count like 0/255
                // count={{ show: true, max: 255 }}
                status={error ? 'error' : undefined}
                rows={4}
                placeholder={placeholder || "Enter your text here..."}
                maxLength={255}
                size='large'
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
    );
}

export default TextAreaInput;