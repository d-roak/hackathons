const Moralis = require ('moralis/node');

const init = async ()=> {
  await Moralis.start({
    appId: process.env.REACT_APP_MORALIS_APPLICATION_ID,
    serverUrl: process.env.REACT_APP_MORALIS_SERVER_URL,
  });
  Moralis.initPlugins();
  const convalent = Moralis.Plugins.covalent;

  const result = await convalent.getChains();
  console.log(result);

};

init();