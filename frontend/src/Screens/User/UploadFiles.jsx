import React, { useState } from 'react';
import { webURL } from "../../constantx.jsx";

const UploadFiles = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${webURL}api/file/upload/`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setUploadStatus('success');
            } else {
                setUploadStatus('error');
            }
            console.log(data);
        } catch (e) {
            setUploadStatus('error');
            console.error('Error uploading file:', e);
        }
    };

    return (
        <div className="main-container">
            <div className="heading-container">
                <h1 className="heading text-left text-gray-800">File Upload</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="file"
                                id="content"
                                name="content"
                                onChange={handleFileChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="button" id="cancelButton" className="px-4 py-2 bg-red-400 text-black rounded-md mr-2">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary-light text-black rounded-md">Save</button>
                        </div>
                    </form>
                    {uploadStatus === 'success' && (
                        <div className="mt-4 text-green-600">
                            File uploaded successfully!
                        </div>
                    )}
                    {uploadStatus === 'error' && (
                        <div className="mt-4 text-red-600">
                            Error uploading file. Please try again.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadFiles;
