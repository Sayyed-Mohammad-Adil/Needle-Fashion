'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon, SwatchIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSelector() {
    const { theme, themes, setTheme } = useTheme();

    // Sort themes: Default first, then Dark, then others alphabetically
    const sortedThemes = [...themes].sort((a, b) => {
        if (a.name === 'Default') return -1;
        if (b.name === 'Default') return 1;
        if (a.name === 'Dark') return -1;
        if (b.name === 'Dark') return 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton 
                    className="inline-flex items-center justify-center rounded-full bg-card p-2 xl:px-2.5 xl:py-1.5 2xl:px-3 text-xs uppercase tracking-wider font-semibold text-foreground border border-border hover:border-primary/50 shadow-sm transition-all"
                    aria-label="Select Theme"
                >
                    <SwatchIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="hidden 2xl:inline 2xl:ml-1.5">{theme?.name || 'Theme'}</span>
                    <ChevronDownIcon className="hidden 2xl:inline -mr-0.5 ml-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-2xl bg-card border border-border shadow-2xl p-1.5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    {sortedThemes.map((t) => (
                        <MenuItem key={t.name}>
                            <button
                                onClick={() => setTheme(t)}
                                className="group flex w-full items-center px-3 py-2 text-xs font-medium rounded-xl text-foreground data-[focus]:bg-secondary transition-colors"
                            >
                                <span
                                    className="mr-2.5 h-3.5 w-3.5 rounded-full border border-border shadow-sm flex-shrink-0"
                                    style={{ backgroundColor: t.colors.primary }}
                                />
                                <span className="font-medium">{t.name}</span>
                                {theme?.name === t.name && (
                                    <CheckIcon className="ml-auto h-4 w-4 text-primary" aria-hidden="true" />
                                )}
                            </button>
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
}
