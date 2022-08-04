import url from '../../Constants/url';

export default class FBAStatsService {
    async GetStatsForStatisticsPage() {
        let json;
        let response = await fetch(url + 'statistics/interface/cfb/', {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (response.ok) {
            json = await response.json();
        } else {
            alert('HTTP-Error:', response.status);
        }

        return json;
    }

    async GetHeismanList() {
        let json;
        let response = await fetch(url + 'collegeplayers/heisman/', {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (response.ok) {
            json = await response.json();
        } else {
            alert('HTTP-Error:', response.status);
        }

        return json;
    }
}
