import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../styles/components/_ag-grid.scss';
import isEmpty from 'lodash/isEmpty';

class StandingTableSmall extends React.Component {
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
        const totalStanding = standing.standings.find((standing) => standing.type === 'TOTAL');

        return totalStanding.table.map((row) => {
            row.team.name = row.team.name.replace(/\s*(FC|CF)$/, '');
            return row;
        });
    }

    render() {
        const { columnDefs } = this.state;
        const { standing, className } = this.props;
        const rowData = this.getRowData(standing);

        return (
            <div className={`ag-theme-balham ag-grid-wrapper ${className}`}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onGridReady={this.onGridReady}>
                </AgGridReact>
            </div>
        );
    }
}

StandingTableSmall.propTypes = {
	className: PropTypes.string,
};

StandingTableSmall.defaultProps = {
	className: '',
};

export default StandingTableSmall;
