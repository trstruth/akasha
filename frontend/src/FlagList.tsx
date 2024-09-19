import React, { useEffect, useState } from 'react';
import { FlagServiceClient } from './proto/AkashaServiceClientPb';
import { BoolFlag, StringFlag, ListBoolFlagsRequest, ListStringFlagsRequest } from './proto/akasha_pb';

const client = new FlagServiceClient('http://localhost:50051');

type Flag = BoolFlag | StringFlag;

const FlagList: React.FC = () => {
    const [flags, setFlags] = useState<Flag[]>([]);

    useEffect(() => {
        const boolRequest = new ListBoolFlagsRequest();
        boolRequest.setPage(1);
        boolRequest.setPageSize(100);

        client.listBoolFlags(boolRequest, {}, (err, response) => {
            if (err) {
                console.error('Error:', err);
            } else {
                const flagsList = response.getFlagsList();
                setFlags((prevFlags) => [...prevFlags, ...flagsList]);
            }
        });

        const stringRequest = new ListStringFlagsRequest();
        stringRequest.setPage(1);
        stringRequest.setPageSize(100);

        client.listStringFlags(stringRequest, {}, (err, response) => {
            if (err) {
                console.error('Error:', err);
            } else {
                const flagsList = response.getFlagsList();
                setFlags((prevFlags) => [...prevFlags, ...flagsList]);
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
