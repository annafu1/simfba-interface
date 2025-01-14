import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { GetTableHoverClass } from '../../../Constants/CSSClassHelper';
import routes from '../../../Constants/routes';
import BBARecruitingService from '../../../_Services/simNBA/BBARecruitingService';
import { ServiceMessageBanner } from '../../_Common/ServiceMessageBanner';
import { Spinner } from '../../_Common/Spinner';
import CBBTeamDashboardMobileRow from './DashboardComponents/CBBTeamDashboardMobileRow';
import CBBTeamDashboardPlayerRow from './DashboardComponents/CBBTeamDashboardPlayerRow';

const CBBRecruitingTeamBoard = ({
    currentUser,
    cbbTeam,
    cbb_Timestamp,
    viewMode
}) => {
    // Services
    let _recruitingService = new BBARecruitingService();

    // Hooks
    const [recruitingProfile, setRecruitingProfile] = React.useState(null);
    const [recruits, setRecruits] = React.useState([]);
    const [isValid, setValidation] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [serviceMessage, setServiceMessage] = React.useState('');
    const savingMessage = 'Saving Recruiting Options...';
    const successMessage = 'Saved successfully!';
    const [viewWidth, setViewWidth] = React.useState(window.innerWidth);
    const isMobile = useMediaQuery({ query: `(max-width:844px)` });
    const tableHoverClass = GetTableHoverClass(viewMode);

    React.useEffect(() => {
        if (!viewWidth) {
            setViewWidth(window.innerWidth);
        }
    }, [viewWidth]);

    // useEffects
    useEffect(() => {
        if (currentUser) {
            getRecruitingProfile();
        }
    }, [currentUser]);

    useEffect(() => {
        if (recruits && recruits.length > 0) {
            checkValidation();
        }
    }, [recruits]);

    // Functions
    const getRecruitingProfile = async () => {
        let response = await _recruitingService.GetRecruitingProfile(
            currentUser.cbb_id
        );

        let profile = { ...response.TeamProfile };

        let recruits =
            profile !== undefined &&
            profile.Recruits !== null &&
            profile.Recruits.length > 0
                ? profile.Recruits
                : [];

        let filteredRecruits = recruits
            .filter((x) => !x.RemovedFromBoard)
            .sort((a, b) => {
                return a.IsSigned === b.IsSigned ? 0 : a.IsSigned ? 1 : -1;
            });
        setRecruitingProfile(() => profile);
        setRecruits(() => filteredRecruits);
    };

    const removeRecruitFromBoard = async (idx, player) => {
        //
        let res = await _recruitingService.RemovePlayerFromBoard(player);

        const recruitList = [...recruits].filter(
            (x) => x.RecruitID !== player.RecruitID
        );

        setRecruits(() => recruitList);
    };

    const toggleScholarship = async (idx, recruitProfile) => {
        const scholarshipVal = !recruitProfile.Scholarship ? true : false;
        const revokedVal = !scholarshipVal ? true : false;
        const croots = [...recruits].map((x) => {
            return { ...x };
        });
        croots[idx].Scholarship = scholarshipVal;
        croots[idx].ScholarshipRevoked = revokedVal;

        const UpdateRecruitDto = {
            RecruitID: recruitProfile.RecruitID,
            RecruitPointsID: recruitProfile.ID,
            ProfileID: recruitProfile.ProfileID,
            Team: recruitingProfile.TeamAbbreviation,
            RewardScholarship: scholarshipVal,
            RevokeScholarship: revokedVal
        };

        const response = await _recruitingService.SendScholarshipToRecruit(
            UpdateRecruitDto
        );
        if (response.ok) {
            setRecruits(croots);

            const teamProfile = { ...recruitingProfile };
            teamProfile.ScholarshipsAvailable = !revokedVal
                ? teamProfile.ScholarshipsAvailable + 1
                : teamProfile.ScholarshipsAvailable - 1;
            setRecruitingProfile(() => teamProfile);
        }
    };

    const allocatePoints = (idx, event) => {
        let { value } = event.target;
        let recruitList = [...recruits];
        let pointsSpent = value;
        recruitList[idx] = {
            ...recruitList[idx],
            CurrentWeeksPoints: Number(pointsSpent)
        };
        setRecruits(() => recruitList);
    };

    const checkValidation = () => {
        if (
            recruits === null ||
            recruits.length === 0 ||
            recruitingProfile === null
        )
            return;
        let valid = true;
        let profile = { ...recruitingProfile };
        let croots = [...recruits];
        let currentPointsSpent = 0;
        let message = '';
        for (let i = 0; i < croots.length; i++) {
            let croot = croots[i];
            if (isNaN(croot.CurrentWeeksPoints)) croot.CurrentWeeksPoints = 0;
            if (croot.CurrentWeeksPoints < 0 || croot.CurrentWeeksPoints > 20) {
                valid = false;

                message = `ERROR! Recruit ${croot.Recruit.FirstName} ${croot.Recruit.LastName} must have a point allocation between 0 and 20 points.`;

                break;
            }
            currentPointsSpent += Number(croot.CurrentWeeksPoints);

            if (currentPointsSpent > profile.WeeklyPoints && valid) {
                valid = false;
            }
            if (!valid) {
                message = `Total Points Spent Exceeds Weekly Points for Team. Please remove ${
                    currentPointsSpent - profile.WeeklyPoints
                } points.`;
            }
        }
        profile.SpentPoints = currentPointsSpent;
        setRecruitingProfile(() => profile);
        setErrorMessage(() => message);
        setValidation(() => valid);
    };

    const savePointAllocations = async () => {
        if (!isValid) return;
        let profile = { ...recruitingProfile };
        let croots = [...recruits];
        let payload = {
            Profile: profile,
            Recruits: croots,
            TeamID: currentUser.cbb_id
        };

        setServiceMessage(() => savingMessage);

        let response = await _recruitingService.SaveRecruitingBoard(payload);

        if (response.ok) {
            profile.Recruits = croots;
            setRecruitingProfile(profile);
            setRecruits(croots);
            setServiceMessage(successMessage);
            console.log('Saved successful for team ', payload.TeamId);
        } else {
            setServiceMessage('');
            setErrorMessage(
                'ERROR: Could not successfully save. Please reach out to admin'
            );
            alert('HTTP-Error:', response.status);
        }
        setTimeout(() => {
            setServiceMessage('');
            setErrorMessage('');
        }, 5000);
    };

    return (
        <div className="container-fluid mt-3">
            {/* Place Save Modal Here */}{' '}
            <div className="col-md-auto justify-content-start">
                <h2>{currentUser ? currentUser.cbb_team : 'Team'} Board</h2>
            </div>
            <div className="row">
                <div className="col-md-2 dashboard-sidebar">
                    <div className="row mt-3">
                        <div className="justify-content-start">
                            <h4>{cbbTeam ? cbbTeam.Team : 'Team'} Profile</h4>
                            <Link
                                to={routes.CBB_RECRUITING}
                                type="button"
                                className="btn btn-primary btn-md me-2 shadow"
                            >
                                Recruiting Overview
                            </Link>
                        </div>
                    </div>
                    <div className="row gx-1 mt-3">
                        <div className="justify-content-center">
                            <h6>State, Region</h6>
                            {recruitingProfile && recruitingProfile.State},{' '}
                            {recruitingProfile && recruitingProfile.Region}
                        </div>
                    </div>
                    <div className="row gx-1 mt-3 justify-content-center">
                        <h6>Scholarships Available</h6>
                        {recruitingProfile
                            ? recruitingProfile.RecruitClassSize -
                              recruitingProfile.TotalCommitments
                            : 'N/A'}
                    </div>
                    <div className="row gx-1 mt-3 justify-content-center">
                        <h6>Scholarship Offers Available</h6>
                        {recruitingProfile
                            ? recruitingProfile.ScholarshipsAvailable
                            : 'N/A'}
                    </div>
                    <div className="row gx-1 mt-3 justify-content-center">
                        <h6>ESPN Score</h6>
                        {recruitingProfile
                            ? recruitingProfile.ESPNScore
                            : 'N/A'}
                    </div>
                    <div className="row gx-1 mt-3 justify-content-center">
                        <h6>Rivals Score</h6>
                        {recruitingProfile
                            ? recruitingProfile.RivalsScore
                            : 'N/A'}
                    </div>
                    <div className="row gx-1 mt-3 justify-content-center">
                        <h6>247Sports Score</h6>
                        {recruitingProfile
                            ? recruitingProfile.Rank247Score
                            : 'N/A'}
                    </div>
                </div>
                <div className="col-md-10 px-md-4">
                    <div className="row">
                        <div className="col-md-auto ms-auto">
                            <div className="row justify-content-end">
                                <div className="col-md-auto ms-auto">
                                    <h4>
                                        Weekly Points:{' '}
                                        {recruitingProfile &&
                                            recruitingProfile.WeeklyPoints}
                                    </h4>
                                    <h4>
                                        Points Spent:{' '}
                                        {recruitingProfile &&
                                            recruitingProfile.SpentPoints}
                                    </h4>
                                </div>
                                <div className="col-md-auto ms-auto align-self-center">
                                    {isValid &&
                                    cbb_Timestamp &&
                                    !cbb_Timestamp.IsRecruitingLocked ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={savePointAllocations}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="btn btn-warning">
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ServiceMessageBanner
                        serMessage={serviceMessage}
                        errMessage={errorMessage}
                    />
                    <div
                        className={`row mt-2 dashboard-table-height${
                            viewMode === 'dark' ? '-dark' : ''
                        }`}
                    >
                        {isMobile &&
                        cbb_Timestamp &&
                        !cbb_Timestamp.IsRecruitingLocked ? (
                            <>
                                {recruits !== undefined &&
                                recruits !== null &&
                                recruits.length > 0
                                    ? recruits.map((x, idx) => (
                                          <CBBTeamDashboardMobileRow
                                              key={x.ID}
                                              idx={idx}
                                              recruitProfile={x}
                                              remove={removeRecruitFromBoard}
                                              toggleScholarship={
                                                  toggleScholarship
                                              }
                                              changePoints={allocatePoints}
                                              theme={viewMode}
                                          />
                                      ))
                                    : ''}
                            </>
                        ) : (
                            <table className={tableHoverClass}>
                                <thead>
                                    <tr>
                                        <th scope="col" abbr="Scholarship">
                                            Scholarship
                                        </th>
                                        <th scope="col">Pos</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Height</th>
                                        <th scope="col">State/Region</th>
                                        <th scope="col">Stars</th>
                                        <th scope="col">Sht. 2</th>
                                        <th scope="col">Sht. 3</th>
                                        <th scope="col">Fin.</th>
                                        <th scope="col">Bal.</th>
                                        <th scope="col">Reb.</th>
                                        <th scope="col">Def.</th>
                                        <th scope="col">Pot.</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Leading Teams</th>
                                        <th scope="col" style={{ width: 125 }}>
                                            Add Points
                                        </th>
                                        <th scope="col">Total Points</th>
                                        <th scope="col">Remove</th>
                                    </tr>
                                </thead>
                                <tbody className="overflow-auto">
                                    {cbb_Timestamp &&
                                    !cbb_Timestamp.IsRecruitingLocked &&
                                    recruits !== undefined &&
                                    recruits !== null &&
                                    recruits &&
                                    recruits.length > 0
                                        ? recruits.map((x, idx) => (
                                              <CBBTeamDashboardPlayerRow
                                                  key={x.ID}
                                                  player={x}
                                                  idx={idx}
                                                  remove={
                                                      removeRecruitFromBoard
                                                  }
                                                  toggleScholarship={
                                                      toggleScholarship
                                                  }
                                                  changePoints={allocatePoints}
                                                  viewMode={viewMode}
                                              />
                                          ))
                                        : ''}
                                </tbody>
                            </table>
                        )}
                        {recruits === undefined || recruits === null ? (
                            <div className="row justify-content-center pt-2 mt-4 mb-2">
                                <Spinner />
                            </div>
                        ) : (
                            ''
                        )}
                        {recruits !== undefined &&
                        recruits !== null &&
                        recruits.length === 0 ? (
                            <div className="row justify-content-center">
                                Have you considered adding a croot to your team
                                board?
                            </div>
                        ) : (
                            ''
                        )}
                        {cbb_Timestamp && cbb_Timestamp.IsRecruitingLocked ? (
                            <div className="row justify-content-center">
                                Good morning! If you're seeing this, it means
                                that the recruiting sync is currently occurring.
                                Please make a cup of coffee, tea, and have some
                                breakfast and enjoy the smells of the morning
                                air until recruiting completes. Also, congrats
                                to Southern Alabama for considering Giovanni
                                Giorgio as the future of their team.
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = ({
    user: { currentUser },
    cbbTeam: { cbbTeam },
    timestamp: { cbb_Timestamp },
    viewMode: { viewMode }
}) => ({
    currentUser,
    cbbTeam,
    cbb_Timestamp,
    viewMode
});

export default connect(mapStateToProps)(CBBRecruitingTeamBoard);
