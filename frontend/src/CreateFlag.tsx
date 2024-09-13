import React, { useState } from 'react';
import { FlagServiceClient } from './proto/AkashaServiceClientPb';
import { CreateFlagRequest, Flag, FlagType } from './proto/akasha_pb';

const client = new FlagServiceClient('http://localhost:50051');


const CreateFlag: React.FC = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('BOOL');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verify if correct object instantiation method is being used
        let flag = new Flag();
        flag.setId(id);
        flag.setName(name);
        flag.setType(FlagType[type as keyof typeof FlagType]);
        if (flag.getType() === FlagType.BOOL) {
            flag.setBoolValue(value === 'true');
        } else {
            flag.setStringValue(value);
        }

        const request: CreateFlagRequest = new CreateFlagRequest();
        request.setFlag(flag);

        try {
            const response = await client.createFlag(request);
            setMessage(`Flag created: ${response.getFlag()?.getName}`);
        } catch (err) {
            console.error('Error:', err);
            setMessage(`Error`);
        }
    };

    return (
        <div>
            <h2>Create Flag</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="BOOL">BOOL</option>
                        <option value="STRING">STRING</option>
                    </select>
                </div>
                <div>
                    <label>Value:</label>
                    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <button type="submit">Create Flag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateFlag;
