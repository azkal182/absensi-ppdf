'use client'

import { useEffect, useState } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getSantriByName } from '@/actions/santri'

export const SantriAutocomplete = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<
    Awaited<ReturnType<typeof getSantriByName>>
  >([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (query.length > 0) {
          const data = await getSantriByName(query)
          setResults(data || []) // Pastikan selalu array
          setIsOpen(true)
        } else {
          setResults([])
          setIsOpen(false)
        }
      } catch (error) {
        console.error('Failed to fetch santri:', error)
        setResults([])
      }
    }

    const debounce = setTimeout(() => {
      fetchResults()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (santri: (typeof results)[number]) => {
    console.log('Santri selected:', santri)
    setQuery(santri.name)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Command className="overflow-hidden rounded-lg border">
          <CommandInput
            placeholder="Cari nama santri..."
            value={query}
            onValueChange={setQuery}
          />
        </Command>
      </PopoverTrigger>

      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Tidak ada hasil ditemukan</CommandEmpty>
            <CommandGroup>
              {/* Tambahkan optional chaining */}
              {results?.map((santri) => (
                <CommandItem
                  key={santri.id}
                  onSelect={() => handleSelect(santri)}
                  className="cursor-pointer"
                >
                  {santri.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
