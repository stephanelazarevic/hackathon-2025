interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'email' | 'tel';
  placeholder?: string;
  suffix?: string;
  required?: boolean;
}

export default function FormInput({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  placeholder,
  suffix,
  required = false
}: FormInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-[var(--text-dark)] mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white border-2 border-[var(--chat-input-border)] rounded-lg text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors duration-200"
          required={required}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
