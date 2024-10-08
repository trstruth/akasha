// app/flags/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FlagTargetingRules from '@/app/components/FlagTargetingRules';
import { Flag } from '@/types/models';

export default function FlagDetailPage() {
    const [flag, setFlag] = useState<Flag<boolean> | Flag<string> | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchFlag = async () => {
            const res = await fetch(`/api/flags/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                const flagData = data.flag;
                if (flagData.type === 'bool') {
                    setFlag(flagData as Flag<boolean>);
                } else if (flagData.type === 'string') {
                    setFlag(flagData as Flag<string>);
                } else {
                    alert(`Unknown flag type: ${flagData.type}`);
                }
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

        const res = await fetch(`/api/flags/${flag.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flag),
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
                            value={flag.defaultValue}
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
                {flag.type === 'bool' ? (
                    <FlagTargetingRules<boolean>
                        flag={flag as Flag<boolean>}
                        onFlagUpdate={(updatedFlag) => {
                            setFlag(updatedFlag);
                        }}
                    />
                ) : (
                    <FlagTargetingRules<string>
                        flag={flag as Flag<string>}
                        onFlagUpdate={(updatedFlag) => {
                            setFlag(updatedFlag);
                        }}
                    />
                )}
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
