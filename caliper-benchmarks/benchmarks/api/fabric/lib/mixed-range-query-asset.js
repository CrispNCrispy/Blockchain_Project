/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('./helper');

// Investigate a paginated range query that may or may not result in ledger appeding via orderer. Assets are created in the init phase
// with a byte size that is specified as in input argument. Pagesize and the number of existing test assets, as well as the range and offset, are also cofigurable. The arguments
// "nosetup" and "consensus" are optional items that are default false.
// - label: mixed-range-query-asset-100
//     chaincodeId: fixed-asset
//     txNumber:
//     - 1000
//     rateControl:
//     - type: fixed-rate
//       opts:
//         tps: 50
//     arguments:
//       bytesizes: [100, 200, 500, 1000]
//       pagesize: 10
//       range: 10
//       offset: 100
//       assets: 5000
//       nosetup: false
//       consensus: false
//     callback: benchmark/network-model/lib/mixed-range-query-asset.js


module.exports.info  = 'Paginated Range Querying Assets of mixed size.';

const chaincodeID = 'fixed-asset';
let clientIdx, pagesize, offset, range, consensus;
let bc, contx, startKey, endKey;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;

    contx = context;

    offset = parseInt(args.offset);
    range = parseInt(args.range);
    pagesize = args.pagesize;

    startKey = 'client' + clientIdx + '_' + offset;
    endKey = 'client' + clientIdx + '_' + (offset + range);

    consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;
    const nosetup = args.nosetup ? (args.nosetup === 'true' || args.nosetup === true) : false;

    if (nosetup) {
        console.log('   -> Skipping asset creation stage');
    } else {
        console.log('   -> Entering asset creation stage');
        await helper.addMixedBatchAssets(bc.bcObj, contx, clientIdx, args);
        console.log('   -> Test asset creation complete');
    }

    return Promise.resolve();
};

module.exports.run = function() {
    // Create argument array [functionName(String), otherArgs(String)]
    const myArgs = {
        chaincodeFunction: 'paginatedRangeQuery',
        chaincodeArguments: [startKey, endKey, pagesize, '']
    };

    // consensus or non-con query
    if (consensus) {
        return bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs);
    } else {
        return bc.bcObj.querySmartContract(contx, chaincodeID, undefined, myArgs);
    }
};

module.exports.end = function() {
    return Promise.resolve();
};
