// app/flags/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import FlagTargetingRules from '@/app/components/FlagTargetingRules';
import { Flag, TargetingRule } from '@/types/models';

export default function CreateFlagPage() {
    const id = uuid();
    const [type, setType] = useState<'bool' | 'string'>('bool');
    const [name, setName] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [defaultValue, setDefaultValue] = useState<string>('false');
    const [variants, setVariants] = useState('');
    const [targetingRulesList, setTargetingRulesList] = useState<
        TargetingRule<boolean | string>[]
    >([]);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (type === 'bool') {
            const flag: Flag<boolean> = {
                id,
                name,
                enabled,
                defaultValue: defaultValue === 'true',
                type: 'bool',
                targetingRulesList: targetingRulesList as TargetingRule<boolean>[],
            };

            const res = await fetch('/api/flags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flag),
            });

            if (res.ok) {
                router.push('/flags');
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } else {
            const flag: Flag<string> = {
                id,
                name,
                enabled,
                defaultValue: defaultValue,
                variants: variants.split(',').map((v) => v.trim()),
                type: 'string',
                targetingRulesList: targetingRulesList as TargetingRule<string>[],
            };

            const res = await fetch('/api/flags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flag),
            });

            if (res.ok) {
                router.push('/flags');
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        }
    };

    const handleFlagUpdate = (updatedFlag: Flag<boolean> | Flag<string>) => {
        setTargetingRulesList(updatedFlag.targetingRulesList);
    };

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Flag</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block">Type</label>
                    <select
                        value={type}
                        onChange={(e) => {
                            const newType = e.target.value as 'bool' | 'string';
                            setType(newType);
                            // Reset default value and variants when type changes
                            setDefaultValue(newType === 'bool' ? 'false' : '');
                            setVariants('');
                            setTargetingRulesList([]);
                        }}
                        className="border p-2 rounded w-full"
                    >
                        <option value="bool">Boolean Flag</option>
                        <option value="string">String Flag</option>
                    </select>
                </div>
                <div>
                    <label className="block">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block">Enabled</label>
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                </div>
                <div>
                    <label className="block">Default Value</label>
                    {type === 'bool' ? (
                        <select
                            value={defaultValue}
                            onChange={(e) => setDefaultValue(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={defaultValue}
                            onChange={(e) => setDefaultValue(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                    )}
                </div>
                {type === 'string' && (
                    <div>
                        <label className="block">Variants (comma-separated)</label>
                        <input
                            type="text"
                            value={variants}
                            onChange={(e) => setVariants(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                )}
                <div>
                    {type === 'bool' ? (
                        <FlagTargetingRules<boolean>
                            flag={{
                                id,
                                name,
                                enabled,
                                defaultValue: defaultValue === 'true',
                                type: 'bool',
                                targetingRulesList: targetingRulesList as TargetingRule<boolean>[],
                            }}
                            onFlagUpdate={handleFlagUpdate}
                        />
                    ) : (
                        <FlagTargetingRules<string>
                            flag={{
                                id,
                                name,
                                enabled,
                                defaultValue: defaultValue,
                                type: 'string',
                                variants: variants.split(',').map((v) => v.trim()),
                                targetingRulesList: targetingRulesList as TargetingRule<string>[],
                            }}
                            onFlagUpdate={handleFlagUpdate}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Create Flag
                </button>
            </form>
        </main>
    );
}
