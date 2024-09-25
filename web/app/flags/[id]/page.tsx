// app/flags/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FlagTargetingRules, { BoolFlag, BoolTargetingRule } from '@/app/components/FlagTargetingRules';

interface Flag {
    id: string;
    name: string;
    enabled: boolean;
    defaultValue: boolean | string;
    variants?: string[];
    type: 'bool' | 'string';
    rules: BoolTargetingRule[];
}

interface UpdateFlagPayload {
    type: 'bool' | 'string';
    name: string;
    enabled: boolean;
    defaultValue: boolean | string;
    variants?: string[];
}

export default function FlagDetailPage() {
    const [flag, setFlag] = useState<Flag | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchFlag = async () => {
            const res = await fetch(`/api/flags/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                setFlag({
                    ...data.flag,
                    type: typeof data.flag.defaultValue === 'boolean' ? 'bool' : 'string',
                });
            } else {
                alert(`Error: ${data.error}`);
            }
            setLoading(false);
        };

        fetchFlag();
    }, [params.id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!flag) return;

        let payloadDefaultValue: string | boolean = '';
        let payloadVariants: string[] = [];
        if (flag.type === 'bool') {
            payloadDefaultValue = flag.defaultValue;
        } else {
            payloadDefaultValue = flag.defaultValue;
            payloadVariants = flag.variants || [];
        }

        const payload: UpdateFlagPayload = {
            type: flag.type,
            name: flag.name,
            enabled: flag.enabled,
            defaultValue: payloadDefaultValue,
            variants: payloadVariants,
        };


        const res = await fetch(`/api/flags/${flag.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert('Flag updated successfully');
        } else {
            const data = await res.json();
            alert(`Error: ${data.error}`);
        }
    };

    const handleDelete = async () => {
        if (!flag) return;

        const confirmed = confirm('Are you sure you want to delete this flag?');
        if (!confirmed) return;

        const res = await fetch(`/api/flags/${flag.id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            router.push('/flags');
        } else {
            const data = await res.json();
            alert(`Error: ${data.error}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!flag) {
        return <div>Flag not found</div>;
    }

    return (
        <main className="p-4">
            <Link href="/flags">
                <button className="text-blue-500 underline">Back to Flags List</button>
            </Link>
            <h1 className="text-2xl font-bold mb-4">Flag Details</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block">ID</label>
                    <input
                        type="text"
                        value={flag.id}
                        disabled
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block">Name</label>
                    <input
                        type="text"
                        value={flag.name}
                        onChange={(e) => setFlag({ ...flag, name: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block">Enabled</label>
                    <input
                        type="checkbox"
                        checked={flag.enabled}
                        onChange={(e) => setFlag({ ...flag, enabled: e.target.checked })}
                    />
                </div>
                <div>
                    <label className="block">Default Value</label>
                    {flag.type === 'bool' ? (
                        <select
                            value={flag.defaultValue.toString()}
                            onChange={(e) =>
                                setFlag({ ...flag, defaultValue: e.target.value === 'true' })
                            }
                            className="border p-2 rounded w-full"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={flag.defaultValue as string}
                            onChange={(e) =>
                                setFlag({ ...flag, defaultValue: e.target.value })
                            }
                            className="border p-2 rounded w-full"
                            required
                        />
                    )}
                </div>
                {flag.type === 'string' && (
                    <div>
                        <label className="block">Variants (comma-separated)</label>
                        <input
                            type="text"
                            value={(flag.variants || []).join(', ')}
                            onChange={(e) =>
                                setFlag({
                                    ...flag,
                                    variants: e.target.value.split(',').map((v) => v.trim()),
                                })
                            }
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                )}
                <FlagTargetingRules flag={{ id: flag.id, name: flag.name, enabled: flag.enabled, default_value: flag.defaultValue === "true", targeting_rules: flag.rules }} onFlagUpdate={(updatedFlag: BoolFlag) => {
                    setFlag({ ...flag, rules: updatedFlag.targeting_rules });
                }} />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Update Flag
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                >
                    Delete Flag
                </button>
            </form>
        </main>
    );
}
