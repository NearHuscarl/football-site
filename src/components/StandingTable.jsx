import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../styles/components/_ag-grid.scss';
import isEmpty from 'lodash/isEmpty';

class StandingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    headerName: '#',
                    field: 'position',
                    sortable: true,
                    width: 40,
                    cellStyle: { textAlign: 'left' },
                },
                {
                    headerName: 'Team',
                    field: 'team.name',
                    sortable: true,
                    width: 173,
                    cellStyle: { textAlign: 'left' },
                },
                {
                    headerName: 'P',
                    field: 'playedGames',
                    sortable: true,
                    width: 38,
                },
                {
                    headerName: '+/-',
                    field: 'goalDifference',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: 'PTS',
                    field: 'points',
                    sortable: true,
                    width: 45,
                }
            ],
            rowData: [],
        };
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridApi.setDomLayout('print'); // Remove both horizontal and vertical scrollbars
    }

    getRowData = (standing) => {
        if (isEmpty(standing)) {
            return undefined;
        }

        return standing.map((row) => {
            row.team.name = row.team.name.replace(/\s*(FC|CF)$/, '');
            return row;
        });
    }

    render() {
        const { columnDefs } = this.state;
        const { standing } = this.props;
        const rowData = this.getRowData(standing);

        return (
            <div className='ag-theme-balham ag-grid-wrapper'>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onGridReady={this.onGridReady}>
                </AgGridReact>
            </div>
        );
    }
}

StandingTable.propTypes = {
	standing: PropTypes.array.isRequired,
};

export default StandingTable;
