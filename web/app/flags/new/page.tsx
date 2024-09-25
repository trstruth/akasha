// app/flags/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { v4 as uuid } from 'uuid';
import FlagTargetingRules, { BoolFlag, BoolTargetingRule } from '@/app/components/FlagTargetingRules';

interface CreateFlagPayload {
    type: 'bool' | 'string';
    id: string;
    name: string;
    enabled: boolean;
    defaultValue: string | boolean;
    variants?: string[];
    targetingRules: BoolTargetingRule[];
}

export default function CreateFlagPage() {
    const id = uuid();
    const [type, setType] = useState<'bool' | 'string'>('bool');
    const [name, setName] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [defaultValue, setDefaultValue] = useState('');
    const [variants, setVariants] = useState('');
    const [rules, setRules] = useState<BoolTargetingRule[]>([]);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        let payloadDefaultValue: string | boolean = '';
        let payloadVariants: string[] = [];
        if (type === 'bool') {
            payloadDefaultValue = defaultValue === 'true';
        } else {
            payloadDefaultValue = defaultValue;
            payloadVariants = variants.split(',').map((v) => v.trim());
        }

        const payload: CreateFlagPayload = {
            type,
            id,
            name,
            enabled,
            defaultValue: payloadDefaultValue,
            variants: payloadVariants,
            targetingRules: [],
        };

        const res = await fetch('/api/flags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            router.push('/flags');
        } else {
            const data = await res.json();
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Flag</h1>
            <form className="space-y-4">
                <div>
                    <label className="block">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'bool' | 'string')}
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
                    <FlagTargetingRules flag={{ id, name, enabled, default_value: defaultValue === "true", targeting_rules: rules }} onFlagUpdate={(updatedFlag: BoolFlag) => {
                        setRules(updatedFlag.targeting_rules);
                    }} />
                </div>
                <button
                    type="submit"
                    onClick={(e) => { handleSubmit(e) }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Create Flag
                </button>
            </form>
        </main>
    );
}
