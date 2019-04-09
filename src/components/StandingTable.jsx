import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../styles/components/_ag-grid.scss';

class StandingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [],
            rowData: [],
        };
    }

    componentDidMount() {
        const { standing } = this.props;
        const totalStanding = standing.standings.find((standing) => standing.type === 'TOTAL');

        this.setState(() => {
            return {
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
                rowData: totalStanding.table.map((row) => {
                    row.team.name = row.team.name.replace(/\s*(FC|CF)$/, '');
                    return row;
                }),
            }
        });
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridApi.setDomLayout('print'); // Remove both horizontal and vertical scrollbars
    }

    render() {
        const { columnDefs, rowData } = this.state;

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

export default StandingTable;
