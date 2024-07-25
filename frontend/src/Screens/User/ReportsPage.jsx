
import { FaDownload, FaEye } from 'react-icons/fa';

import React from 'react';

const ReportsPage = () => {
    const dummyData = [
        {
            fileName: 'Sales_Report_Jan2024.csv',
            summary: 'Summary of sales data for January 2024',
            downloadLink: '#',
            viewLink: '#',
        },
        {
            fileName: 'Sales_Report_Feb2024.csv',
            summary: 'Summary of sales data for February 2024',
            downloadLink: '#',
            viewLink: '#',
        },
        {
            fileName: 'Sales_Report_Mar2024.csv',
            summary: 'Summary of sales data for March 2024',
            downloadLink: '#',
            viewLink: '#',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-8 m-16 bg-white rounded-lg border shadow-lg">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">Reports</h2>
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 bg-gray-200 text-left text-gray-600 font-bold uppercase">File Name</th>
                    <th className="py-2 px-4 bg-gray-200 text-left text-gray-600 font-bold uppercase">Summary</th>
                    <th className="py-2 px-4 bg-gray-200 text-left text-gray-600 font-bold uppercase">Actions</th>
                </tr>
            </thead>
            <tbody>
                {dummyData.map((report, index) => (
                    <tr key={index} className="border-t">
                        <td className="py-2 px-4">{report.fileName}</td>
                        <td className="py-2 px-4">{report.summary}</td>
                        <td className="py-2 px-4">
                            <a
                                href={report.downloadLink}
                                className="text-blue-500 hover:underline mr-4 inline-flex items-center"
                            >
                                <FaDownload className="mr-1" /> Download
                            </a>
                            <a
                                href={report.viewLink}
                                className="text-blue-500 hover:underline inline-flex items-center"
                            >
                                <FaEye className="mr-1" /> View
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default ReportsPage;
