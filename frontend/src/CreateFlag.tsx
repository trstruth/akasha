import React, { useState } from 'react';
import { FlagServiceClient } from './proto/AkashaServiceClientPb';
import { CreateBoolFlagRequest, BoolFlag, CreateStringFlagRequest, StringFlag } from './proto/akasha_pb';
import { v4 as uuidv4 } from 'uuid';

const client = new FlagServiceClient('http://localhost:50051');


const CreateFlag: React.FC = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('BOOL');
    const [value, setValue] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // client generates a random uuid
        const uuid = uuidv4();

        if (type === 'BOOL') {
            const boolFlag = makeBoolFlag(uuid, name, enabled, value === 'true');
            const request = new CreateBoolFlagRequest();
            request.setFlag(boolFlag);
            try {
                const response = await client.createBoolFlag(request);
                setMessage(`Bool Flag created: ${response.getFlag()?.getName}`);
            } catch (err) {
                console.error('Error:', err);
                setMessage(`Error`);
            }
        } else if (type === 'STRING') {
            const stringFlag = makeStringFlag(uuid, name, enabled, value);
            const request = new CreateStringFlagRequest();
            request.setFlag(stringFlag);
            try {
                const response = await client.createStringFlag(request);
                setMessage(`String Flag created: ${response.getFlag()?.getName}`);
            } catch (err) {
                console.error('Error:', err);
                setMessage(`Error`);
            }
        } else {
            setMessage('Invalid Flag Type: ' + type);
        }

    };

    return (
        <div>
            <h2>Create Flag</h2>
            <form onSubmit={handleSubmit}>
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
                <div>
                    <label>Enabled:</label>
                    <select value={enabled ? "enabled" : "disabled"} onChange={(e) => setEnabled(e.target.value === "enabled")}>
                        <option value="disabled">Disabled</option>
                        <option value="enabled">Enabled</option>
                    </select>
                </div>
                <button type="submit">Create Flag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

const makeBoolFlag = (id: string, name: string, enabled: boolean, default_value: boolean): BoolFlag => {
    let flag = new BoolFlag();
    flag.setId(id);
    flag.setName(name);
    flag.setEnabled(enabled);
    flag.setDefaultValue(default_value);
    flag.setTargetingRulesList([]);

    return flag;
}

const makeStringFlag = (id: string, name: string, enabled: boolean, default_value: string): StringFlag => {
    let flag = new StringFlag();
    flag.setId(id);
    flag.setName(name);
    flag.setEnabled(enabled);
    flag.setDefaultValue(default_value);
    flag.setTargetingRulesList([]);

    return flag;
}

export default CreateFlag;
