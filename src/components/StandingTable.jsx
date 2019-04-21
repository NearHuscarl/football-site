import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class StandingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    headerName: '#',
                    field: 'position',
                    sortable: true,
                    width: 45,
                    cellStyle: { textAlign: 'left' },
                },
                {
                    headerName: 'Team',
                    field: 'team.name',
                    sortable: true,
                    width: 225,
                    cellStyle: {
                        textAlign: 'left',
                        fontFamily: 'Quicksand-Medium',
                        fontSize: '1.6rem',
                    },
                },
                {
                    headerName: 'P',
                    field: 'playedGames',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: 'W',
                    field: 'won',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: 'D',
                    field: 'draw',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: 'L',
                    field: 'lost',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: 'F',
                    field: 'goalsFor',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: 'A',
                    field: 'goalsAgainst',
                    sortable: true,
                    width: 45,
                },
                {
                    headerName: '+/-',
                    field: 'goalDifference',
                    sortable: true,
                    width: 55,
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

        this.rowStyle = {
            margin: '5px',
        }
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridApi.setDomLayout('print'); // Remove both horizontal and vertical scrollbars
    }

    render() {
        const { columnDefs } = this.state;
        const { standing } = this.props;

        return (
            <div className='ag-theme-balham table-wrapper'>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={standing}
                    onGridReady={this.onGridReady}
                    rowStyle={this.rowStyle}>
                </AgGridReact>
            </div>
        );
    }
}

StandingTable.propTypes = {
	standing: PropTypes.array.isRequired,
};

export default StandingTable;
