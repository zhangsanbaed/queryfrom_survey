
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const ConfidentialHealthSurveyABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "decryptedValue",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "AggregateRevealed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isAggregate",
          "type": "bool"
        }
      ],
      "name": "DecryptionRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        }
      ],
      "name": "EncryptedAggregateUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "respondent",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ciphertextStoragePointer",
          "type": "string"
        }
      ],
      "name": "EntrySubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "respondent",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "decryptedValue",
          "type": "uint256"
        }
      ],
      "name": "IndividualRevealed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        }
      ],
      "name": "ResearcherAuthorized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "metadataPointer",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "submitDeadline",
          "type": "uint256"
        }
      ],
      "name": "SurveyCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        }
      ],
      "name": "SurveyPaused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        }
      ],
      "name": "SurveyResumed",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        }
      ],
      "name": "authorizeGlobalResearcher",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        }
      ],
      "name": "authorizeResearcher",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "authorizedResearchers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "decryptedSum",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "decryptedCount",
          "type": "uint256"
        },
        {
          "internalType": "bytes[]",
          "name": "signatures",
          "type": "bytes[]"
        }
      ],
      "name": "callbackRevealAggregate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "decryptedValue",
          "type": "uint256"
        },
        {
          "internalType": "bytes[]",
          "name": "signatures",
          "type": "bytes[]"
        }
      ],
      "name": "callbackRevealIndividual",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataPointer",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "questionSchemaPointer",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "submitDeadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "allowIndividualReveal",
          "type": "bool"
        },
        {
          "internalType": "address[]",
          "name": "initialResearchers",
          "type": "address[]"
        }
      ],
      "name": "createSurvey",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "decryptionRequests",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isAggregate",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isFulfilled",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        }
      ],
      "name": "getAggregateCiphertext",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        }
      ],
      "name": "getAggregateCount",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        }
      ],
      "name": "getSubmissionInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "entryId_",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "respondent",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "ciphertextStoragePointer",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isRevealed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        }
      ],
      "name": "getSurveyInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataPointer",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "questionSchemaPointer",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "submitDeadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "allowIndividualReveal",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "totalSubmissions",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        }
      ],
      "name": "isAuthorizedResearcher",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextEntryId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextRequestId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextSurveyId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        }
      ],
      "name": "pauseSurvey",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        }
      ],
      "name": "requestAggregatedReveal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "questionId",
          "type": "uint256"
        }
      ],
      "name": "requestIndividualReveal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        }
      ],
      "name": "resumeSurvey",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "researcher",
          "type": "address"
        }
      ],
      "name": "revokeGlobalResearcher",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "submissions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "respondent",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "ciphertextStoragePointer",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isRevealed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "surveyId",
          "type": "uint256"
        },
        {
          "internalType": "externalEuint32[]",
          "name": "encryptedAnswers",
          "type": "bytes32[]"
        },
        {
          "internalType": "bytes[]",
          "name": "proofs",
          "type": "bytes[]"
        },
        {
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "ciphertextStoragePointer",
          "type": "string"
        }
      ],
      "name": "submitEntry",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "surveys",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataPointer",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "questionSchemaPointer",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "submitDeadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "allowIndividualReveal",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "totalSubmissions",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
} as const;

