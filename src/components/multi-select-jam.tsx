// components/multi-select-number.tsx
'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

interface MultiSelectNumberProps {
  value: number[]
  onChange: (value: number[]) => void
}

const numbers = [1, 2, 3, 4, 5]

export function MultiSelectJam({ value, onChange }: MultiSelectNumberProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (number: number) => {
    const newValue = value.includes(number)
      ? value.filter((n) => n !== number)
      : [...value, number]
    onChange(newValue)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="w-full justify-between" variant="outline">
          {value.length > 0 ? `Jam Ke: ${value.join(', ')}` : 'Pilih Jam'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
      >
        {numbers.map((number) => (
          <DropdownMenuItem
            key={number}
            onSelect={(e) => e.preventDefault()}
            className="w-full"
          >
            <div className="flex w-full items-center space-x-2">
              <Checkbox
                checked={value.includes(number)}
                onCheckedChange={() => handleSelect(number)}
              />
              <span className="w-full">{number}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
