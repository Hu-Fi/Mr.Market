import axios from 'axios';
import * as fs from 'fs';
import { Stringifier } from 'csv-stringify';


const query = {
  query: `
    {
      escrows(where: {
        recordingOracle: "0xe0F1bAC5D724a60E50BdbDBC15792C6Ec37Bee6d"
      }) {
        address
        manifestUrl
        recordingOracle
      }
    }`
};


async function fetchData() {
  try {
    const response = await axios.post('https://api.thegraph.com/subgraphs/name/humanprotocol/mumbai-v2', query);
    return response.data.data.escrows;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}

async function processManifests(escrows: any[]) {
  const allData = [];

  for (const escrow of escrows) {
    // Skip localhost manifests
    if (escrow.manifestUrl.startsWith('http://localhost') ||
        escrow.manifestUrl.startsWith('https://localhost') ||
        escrow.manifestUrl.startsWith('localhost')) {
      continue;
    }

    try {
      const manifestResponse = await axios.get(escrow.manifestUrl);
      const manifestData = manifestResponse.data;
      allData.push({ 
        address: escrow.address,
        ...manifestData, 
      });
    } catch (error) {
      console.error('Error fetching manifest: ', error);
    }
  }


  return allData.sort((a, b) => b.fundAmount - a.fundAmount);
}


function saveToCSV(data: any[]) {
  const stringifier = new Stringifier({
    header: true,
    columns: {
      address: 'address',
      chainId: 'chainId',
      startBlock: 'startBlock',
      requesterDescription: 'requesterDescription',
      endBlock: 'endBlock',
      exchangeName: 'exchangeName',
      tokenA: 'tokenA',
      tokenB: 'tokenB',
      campaignDuration: 'campaignDuration',
      fundAmount: 'fundAmount',
      type: 'type',
      requestType: 'requestType',
    },
  });

  stringifier.on('readable', function(){
    let row;
    while ((row = stringifier.read()) !== null) {
      fs.appendFileSync('output.csv', row);
    }
  });

  stringifier.on('finish', function(){
    console.log('output.csv saved.');
  });

  data.forEach((d) => stringifier.write(d));
  stringifier.end();
}


async function main() {
  const escrows = await fetchData();
  const processedData = await processManifests(escrows);
  saveToCSV(processedData);
}

main();