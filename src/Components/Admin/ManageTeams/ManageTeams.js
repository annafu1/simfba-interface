import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import TeamRow from './TeamRow';
import firebase from 'firebase';
import url from '../../../Constants/url';
import TeamService from '../../../_Services/simFBA/TeamService';
import RequestService from '../../../_Services/simFBA/RequestService';

const ManageTeams = ({ currentUser }) => {
    // State
    const user = useSelector((state) => state.user.currentUser);
    const [teams, setTeams] = React.useState([]);
    let teamService = new TeamService();
    let requestService = new RequestService();

    // Use Effects Begin
    useEffect(() => {
        const getCoachedTeams = async () => {
            let coachedTeams = await teamService.GetCoachedTeams(url);
            setTeams(coachedTeams);
        };
        if (user) {
            getCoachedTeams();
        }
    }, [user]);

    // Use Effects End

    // Click Functions
    const revokeRequest = async (payload) => {
        // DB Request
        let res = await requestService.RevokeRequest(url, payload);

        if (res.ok) {
            console.log('Revoke Request:', payload.reqId);
        } else {
            throw ('HTTP-Error: Revoke incomplete', res.status);
        }
        // Firebase Call
        const firestore = firebase.firestore();

        let userRef = await firestore
            .collection('users')
            .where('username', '==', payload.username)
            .get();

        userRef.forEach(async (doc) => {
            let emptyObj = {
                username: payload.username,
                team: '',
                mascot: '',
                teamAbbr: '',
                teamId: null
            };
            await doc.ref.update(emptyObj);
        });
        console.log('Firebase Updated');

        // Filter Requests
        const filterTeams = teams.filter((x) => x.id !== payload.reqId);
        setTeams(filterTeams);
    };

    // Admin UI
    const AdminUI = () => {
        return (
            <div className="hero-body center">
                <div className="container is-fluid has-text-centered userInterface">
                    <h2 className="title is-3">Manage Users and Teams</h2>
                    <div className="availableScrollbar available-ui-height availableTeams">
                        <div className="table-wrapper dTable">
                            <table className="table is-fullwidth is-hoverable is-truncated">
                                <thead>
                                    <tr>
                                        <th style={{ width: '120px' }}>
                                            <abbr>Team</abbr>
                                        </th>
                                        <th style={{ width: '80px' }}>
                                            <abbr title="User">User</abbr>
                                        </th>
                                        <th style={{ width: '50px' }}>
                                            <abbr title="Conference">
                                                Conf.
                                            </abbr>
                                        </th>
                                        <th style={{ width: '50px' }}>
                                            <abbr title="Revoke Team">
                                                Revoke
                                            </abbr>
                                        </th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th style={{ width: '120px' }}>
                                            <abbr>Team</abbr>
                                        </th>
                                        <th style={{ width: '80px' }}>
                                            <abbr title="User">User</abbr>
                                        </th>
                                        <th style={{ width: '50px' }}>
                                            <abbr title="Conference">
                                                Conf.
                                            </abbr>
                                        </th>
                                        <th style={{ width: '50px' }}>
                                            <abbr title="Revoke Team">
                                                Revoke
                                            </abbr>
                                        </th>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    {teams.map((x, i) => {
                                        return (
                                            <TeamRow
                                                key={i}
                                                team={x}
                                                revoke={revokeRequest}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const InvalidUser = () => {
        return (
            <div className="hero-body center">
                <div className="is-fluid has-text-centered">
                    <h2 className="subtitle is-3 availableText">
                        Please return to Landing Page immediately.
                    </h2>
                </div>
            </div>
        );
    };

    // Return
    return currentUser.roleID !== 'Admin' ? <InvalidUser /> : <AdminUI />;
};

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
});

export default connect(mapStateToProps)(ManageTeams);
