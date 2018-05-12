process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// TODO: this is insecure; https://github.com/axios/axios/issues/535

const axiosBase = require ('axios');
const axios = axiosBase.create({
  baseURL: "https://172.16.33.18/api/",
});

// Authentication

const username = "infocyte";
const password = "hunt";
var session;
axios.interceptors.request.use(
	config => {
		if(session){
			config.headers.authorization = session.id
		}
		return config;
	},
	error => Promise.reject(error)
);

async function auth(){
	try{
		let login = await axios.post('users/login', {username: username, password: password})
		session = login.data;
	}
	catch (e){
		console.log(e);
	}
}

//enumerate and scan

async function getTargets(){
	const res = await axios.get('/targets/');
	return res.data; 
}

async function getTargetByName(targetName){
	const targets = await getTargets();
	targets.filter(e => e.name === targetName);
	return targets[0];
}

async function getQueries(targetId){
	const res = await axios.get(`/targets/${targetId}/queries/`);
	return res.data;
}

async function enumerateTarget(targetId){
	try{
		const queries = await getQueries(targetId);
		const queryIds = queries.map(a => a.id)
		const res = await axios.post(`/targets/${targetId}/enumerate/`, {queries: queryIds});
		return res;
	} catch (e) {
		console.log(e);
	}
}

async function enumerateTargetByName(targetName){
	const target = await getTargetByName(targetName);
	const res = await enumerateTarget(target.id);
	return res;
}

async function enumerateTargetByQueries(targetId, queryIds){
	try{
		const res = await axios.post(`/targets/${targetId}/enumerate/`, {queries: queryIds});
		return res;
	} catch (e) {
		console.log(e);
	}
}

async function scanTarget(targetId){
	const res = await axios.post(`/targets/${targetId}/scan`);
	return res;
}

async function scanTargetByName(targetName){
	const target = await getTargetByName(targetName);
	const res = await axios.post(`/targets/${target.id}/scan`);
	return res;
}

//get all hosts in a target list

//get scans & scan results

//get scans in a target list

//get results of a specific type for a scan

//get last 30 for a target group

//create an empty scan to which you would add offline scans

//upload offline scans to a target group