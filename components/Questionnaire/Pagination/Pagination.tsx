import React, { useState } from 'react';

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

interface Props {
    total: number
    changePageHandler: (page: number) => boolean
}

const Pagination: React.FC<Props> = ({ total, changePageHandler }) => {

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(1);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
    
        const page = event.page; // 0

        const changePage = changePageHandler(page);

        if(changePage) {
            setFirst(event.first);
            setRows(event.rows);
        }
    };

    return (
        <Paginator 
            first={first} 
            rows={rows} 
            totalRecords={total} 
            rowsPerPageOptions={[]} 
            onPageChange={onPageChange} 
            className='shadow-2'
        />
    );
};

export default Pagination;