import url from '../../Constants/SimBBA_url';

export default class BBAStatsService {
    async GetStatsPageData() {
        let json;
        let response = await fetch(`${url}/stats/cbb/page`, {
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
