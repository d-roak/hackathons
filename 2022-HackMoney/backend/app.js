const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch/polyfill').fetch;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const Copycat = require('../artifacts/contracts/Copycat.sol/Copycat.json');

const APIURL = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon'
const defaultQuery = `
query {
  userReserves(where: { user: "$ADDRESS"}) {
    id
    reserve{
      id
      symbol
      supplyCap
      borrowCap
      name
      decimals
      totalLiquidity
    }
    user {
      id
    }
  }
}
`

const client = new ApolloClient({
	link: createHttpLink({ uri: APIURL, fetch }),
  cache: new InMemoryCache(),
})
const copycatContract = new web3.eth.Contract(Copycat.abi, 'CONTRACT_DEPLOY_ADDRESS');


function pollSubgraph() {
	let query = defaultQuery.replace('$ADDRESS', '0xf1397548067ff5a6e18bcf6d9d99b0ee029cb78b')
	client
		.query({
			query: gql(query),
		})
		.then((data) => {
			// COMPARES AND STUFF
			console.log('Subgraph data: ', data.data)

			// CALL SMART CONTRACT FUNCTION
			copycatContract.methods.openPosition().call({ from: '0xf1397548067ff5a6e18bcf6d9d99b0ee029cb78b', to: '' }, (err, result) => {
				if (err) {
					console.log('Error: ', err);
				} else {
					console.log('Result: ', result);
				}
			});
		})
		.catch((err) => {
			console.log('Error fetching data: ', err)
		})

	setTimeout(pollSubgraph, 10 * 1000);
}

pollSubgraph();