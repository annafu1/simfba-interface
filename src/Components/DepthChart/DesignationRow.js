import React from 'react';

const DesignationRow = (props) => {
    /* 
    Name, Position, Archtype, Ovr, Yr, Ht, Wt, St,
    HS/JC, Pot, Num
    
    */
    // let position = props.designation.slice(0, 2);
    let players = props.players;
    let players_by_position = players.filter(
        (player) => player.position === props.pos
    );
    let starter;
    let others = [];
    for (let i = 0; i < players_by_position.length; i++) {
        if (players_by_position[i].designation === props.designation) {
            starter = players_by_position[i];
        } else {
            others.push(players_by_position[i]);
        }
    }
    const playerAttributes = {};
    //   let data = props.data;
    if (starter) {
        for (let attribute in starter.attr) {
            // Algorithm to provide letter value to attribute
            // NOTE: Move this outside of the if statement for implementation to see all attributes
            let attr = starter.attr[attribute];
            if (attr.value < 15) {
                playerAttributes[attribute] = 'F';
                attr.letter = 'F';
            } else if (attr.value < 25) {
                playerAttributes[attribute] = 'D';
                attr.letter = 'D';
            } else if (attr.value < 35) {
                playerAttributes[attribute] = 'C';
                attr.letter = 'C';
            } else if (attr.value < 45) {
                playerAttributes[attribute] = 'B';
                attr.letter = 'B';
            } else if (attr.value >= 45) {
                playerAttributes[attribute] = 'A';
                attr.letter = 'A';
            }
        }
    }

    return (
        <tr>
            <td></td>
            {/* <th>{props.designation}</th> */}
            <th>{starter ? starter.name : ''}</th>
            <td>{starter ? starter.archtype : ''}</td>
            <td>{starter ? starter.overall : ''}</td>
            <td>{starter ? starter.year : ''}</td>
            <td>{starter ? starter.height : ''}</td>
            <td>{starter ? starter.weight : ''}</td>
            <td>{starter ? starter.potential : ''}</td>
            <td>{playerAttributes.carrying}</td>
            <td>{playerAttributes.agility}</td>
            <td>{playerAttributes.catching}</td>
            <td>{playerAttributes.zone_coverage}</td>
            <td>{playerAttributes.man_coverage}</td>
            <td>{playerAttributes.football_iq}</td>
            <td>{playerAttributes.kick_accuracy}</td>
            <td>{playerAttributes.kick_power}</td>
            <td>{playerAttributes.pass_block}</td>
            <td>{playerAttributes.pass_rush}</td>
            <td>{playerAttributes.punt_accuracy}</td>
            <td>{playerAttributes.punt_power}</td>
            <td>{playerAttributes.route_running}</td>
            <td>{playerAttributes.run_block}</td>
            <td>{playerAttributes.run_defense}</td>
            <td>{playerAttributes.speed}</td>
            <td>{playerAttributes.strength}</td>
            <td>{playerAttributes.tackle}</td>
            <td>{playerAttributes.throw_power}</td>
            <td>{playerAttributes.throw_accuracy}</td>
            <td>{playerAttributes.stamina}</td>
            <td>
                <button
                    onClick={() => props.moveRow(true)}
                    disabled={props.rank === 0}
                >
                    <span style={{ fontSize: '2rem' }}>&#8593;</span>
                </button>
                <button
                    onClick={() => props.moveRow(false)}
                    disabled={props.rank === props.arrLength - 1}
                >
                    <span style={{ fontSize: '2rem' }}>&#8595;</span>
                </button>
            </td>
        </tr>
    );
};

export default DesignationRow;
