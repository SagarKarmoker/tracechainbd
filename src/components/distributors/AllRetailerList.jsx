import React from 'react'

function AllRetailerList() {

    const getMoreDetailsBtn = () => {
        
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mb-4'>All Retailers List</h1>
            <div className='flex flex-col gap-4'>
                <p className='text-center'>
                    Show as table contains details 
                </p>

                <table className='border text-center'>
                    <thead>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Addreess</th>
                        <th>....</th>
                        <th>Details</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td>Acme and Co</td>
                            <td>0x......43</td>
                            <td>......</td>
                            <td>
                                <button className='py-2 px-4 rounded-lg font-bold bg-green-500' onClick={getMoreDetailsBtn}>more</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllRetailerList