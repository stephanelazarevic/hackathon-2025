interface FormCardProps {
  title: string;
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
  multiSelect?: boolean;
  selectedOptions?: string[];
}

export default function FormCard({ 
  title, 
  options, 
  selectedOption, 
  onSelect, 
  multiSelect = false,
  selectedOptions = []
}: FormCardProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-[var(--text-dark)] mb-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = multiSelect 
            ? selectedOptions.includes(option)
            : selectedOption === option;
          
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                isSelected
                  ? 'bg-[var(--accent-teal)] border-[var(--accent-teal)] text-white'
                  : 'bg-white border-[var(--chat-input-border)] text-[var(--text-dark)] hover:border-[var(--accent-teal)] hover:bg-[var(--chat-bubble-bg)]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
