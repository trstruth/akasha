import React, { useEffect, useState } from 'react';
import { FlagServiceClient } from './proto/AkashaServiceClientPb';
import { Flag, ListFlagsRequest } from './proto/akasha_pb';

const client = new FlagServiceClient('http://localhost:50051');

const FlagList: React.FC = () => {
    const [flags, setFlags] = useState<Flag[]>([]);

    useEffect(() => {
        const request = new ListFlagsRequest();
        request.setPage(1);
        request.setPageSize(100);

        client.listFlags(request, {}, (err, response) => {
            if (err) {
                console.error('Error:', err);
            } else {
                const flagsList = response.getFlagsList();
                setFlags(flagsList);
            }
        });
    }, []);

    return (
        <div>
            <h2>Feature Flags</h2>
            <ul>
                {flags.map((flag: any, index: number) => (
                    <li key={index}>
                        {flag.getName()} (ID: {flag.getId()}, Type: {flag.getType()})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlagList;
