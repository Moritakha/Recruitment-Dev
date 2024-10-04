import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function StringValueChange() {
    const [inputString, setInputString] = useState('');
    const [maxValue, setMaxValue] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/max-value', {
                t: inputString
            });
            setMaxValue(response.data.maxValue);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const backgroundStyle = {
        backgroundColor: '#2a2d32',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8f9fa' 
    };

    return (
        <div style={backgroundStyle}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-body">
                                <h1 className="card-title text-center">Problem 2</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="inputString">Enter string t</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputString"
                                            value={inputString}
                                            onChange={(e) => setInputString(e.target.value)}
                                            placeholder="Enter string"
                                            required
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary">
                                            Calculate
                                        </button>
                                    </div>
                                </form>
                                {maxValue !== null && (
                                    <div className="alert alert-info mt-4 text-center">
                                        <h4>Maximum Value: {maxValue}</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StringValueChange;