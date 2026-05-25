import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="pr-12"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-gray-500 hover:text-gray-700"
        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};
