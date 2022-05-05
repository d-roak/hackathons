import { NFTStorage, Blob } from "nft.storage"

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg4MDA4OUIzQ0I2QkY3YjA3ZTUxQTdCZDc1NEJFQWVDMEI1NzM4NjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDYzMjgzMDkyMiwibmFtZSI6Ik5GVFcifQ.GjCVEMYxblMBxqjja2nEln08BWOi-U1Gdniv2vg5dZc"
const client = new NFTStorage({
	token: API_KEY,
	endpoint: 'https://api.nft.storage',
});

async function storeArticle(data) {
	const blob = new Blob([JSON.stringify(data)], {"type": "application/json"});
	const cid = await client.storeBlob(blob);
	return cid;
}

export default storeArticle;