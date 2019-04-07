import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { startUpdateStanding } from '../actions/standings';
import '../styles/components/_ag-grid.scss';

export class StandingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.props.startUpdateStanding(this.props.competitionId)
            .then(() => {
                const { competitionId, standings } = this.props;
                const standingsData = standings[competitionId];
                const totalStanding = standingsData.standings.find((standing) => standing.type === 'TOTAL');

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
            });
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridApi.setDomLayout("print"); // Remove both horizontal and vertical scrollbars
    }

    render() {
        const { columnDefs, rowData } = this.state;

        return (
            <div className={`ag-theme-balham ag-grid-wrapper`}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onGridReady={this.onGridReady}>
                </AgGridReact>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    standings: state.standings,
})

const mapDispatchToProps = (dispatch) => ({
    startUpdateStanding: (competitionId) => {
        return dispatch(startUpdateStanding(competitionId));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StandingTable);
