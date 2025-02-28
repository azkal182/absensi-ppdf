import { cn } from '@/lib/utils'
import { Command as CommandPrimitive } from 'cmdk'
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useMemo,
} from 'react'
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from './ui/command'

type Santri = {
  name: string
  id: number
  kelasId: number | null
  asramaId: number | null
  pengurusId: number | null
}

type Props = {
  selectedValue: string
  onSelectedValueChange: (value: string, selectedItem: Santri | null) => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  items: Santri[]
  isLoading?: boolean
  emptyMessage?: string
  placeholder?: string
}

export function AutoComplete({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emptyMessage = 'Tidak ada santri ditemukan.',
  placeholder = 'Cari santri...',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = useState(false)

  //   console.log(items)
  console.log('Kondisi render:', {
    isOpen,
    isLoading,
    itemsLength: items.length,
  })

  const santriById = useMemo(() => {
    console.log('useMemo - items:', items)
    const result = items.reduce(
      (acc, item) => {
        if (item && item.id !== undefined && item.id !== null) {
          acc[item.id.toString()] = item
        } else {
          console.warn('Item tidak valid:', item)
        }
        return acc
      },
      {} as Record<string, Santri>
    )
    console.log('useMemo - santriById:', result)
    return result
  }, [items])

  const reset = useCallback(() => {
    onSelectedValueChange('', null)
    onSearchValueChange('')
  }, [onSelectedValueChange, onSearchValueChange])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) return

      if (!isOpen) {
        setOpen(true)
      }

      if (event.key === 'Enter' && input.value !== '') {
        const matchingItem = items.find((item) => item.name === input.value)
        if (matchingItem) {
          onSelectedValueChange(matchingItem.id.toString(), matchingItem)
          onSearchValueChange(matchingItem.name)
        }
      }

      if (event.key === 'Escape') {
        input.blur()
      }
    },
    [isOpen, items, onSelectedValueChange, onSearchValueChange]
  )

  const handleBlur = useCallback(() => {
    setOpen(false)
    const selectedSantri = santriById[selectedValue]
    if (selectedSantri && selectedSantri.name !== searchValue) {
      reset()
    }
  }, [selectedValue, searchValue, santriById, reset])

  const handleSelectOption = useCallback(
    (selectedId: string) => {
      const selectedSantri = santriById[selectedId] || null
      if (selectedId === selectedValue) {
        reset()
      } else {
        onSelectedValueChange(selectedId, selectedSantri)
        onSearchValueChange(selectedSantri?.name ?? '')
      }
      setTimeout(() => {
        inputRef?.current?.blur()
      }, 0)
    },
    [
      selectedValue,
      santriById,
      onSelectedValueChange,
      onSearchValueChange,
      reset,
    ]
  )

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={searchValue}
          onValueChange={isLoading ? undefined : onSearchValueChange}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="text-base"
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'absolute top-0 z-10 w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95',
            isOpen && (items.length > 0 || isLoading) ? 'block' : 'hidden'
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {/* {isLoading && (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            )} */}
            {items.length > 0 && (
              <CommandGroup>
                {items.map((option) => {
                  console.log('Option saat ini:', option)
                  const isSelected = selectedValue === option.id.toString()
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.id.toString()}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={handleSelectOption}
                      className={cn(
                        'flex w-full items-center gap-2',
                        !isSelected ? 'pl-8' : null
                      )}
                    >
                      statis
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
            {/* {!isLoading && items.length === 0 && searchValue && (
              <CommandPrimitive.Empty className="select-none rounded-sm px-3 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            )}
            {!isLoading && items.length === 0 && searchValue && (
              <span>tidak ada</span>
            )} */}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  )
}
