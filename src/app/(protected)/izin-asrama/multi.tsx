// MultiSelectCombobox.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: number
}

const options: Option[] = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
]

interface MultiSelectComboboxProps {
  onValueChange: (values: number[]) => void
  initialValues?: number[]
}

export default function MultiSelectCombobox({
  onValueChange,
  initialValues = [],
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<number[]>(initialValues)

  useEffect(() => {
    setSelectedValues(initialValues)
  }, [initialValues])

  const handleSelect = (value: number) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value]

    setSelectedValues(newValues)
    onValueChange(newValues)
  }

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return 'Pilih jam'
    return selectedValues
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .join(', ')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {getDisplayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={() => handleSelect(option.value)} // Tambahkan ini sebagai fallback
                  onMouseDown={(e) => {
                    e.preventDefault() // Mencegah popover tertutup sebelum klik selesai
                    handleSelect(option.value)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValues.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
