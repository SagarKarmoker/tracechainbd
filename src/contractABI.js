export const ABI = [
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": [],
        "outputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": [],
        "outputs": []
    },
    {
        "type": "event",
        "name": "AppliedForReg",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "name",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "locAddress",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "contractNumber",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "countryOfOrigin",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "tinNumber",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "vatRegNumber",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "ipfsDocHash",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "role",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Initialized",
        "inputs": [
            {
                "type": "uint64",
                "name": "version",
                "indexed": false,
                "internalType": "uint64"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ProductAdded",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "string",
                "name": "name",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "description",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "category",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "countryOfOrigin",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "manufacturer",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "quantity",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "importedDate",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "importerAddr",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "customsAddr",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ProductDelivered",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "receiver",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ProductDispatched",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "productId",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "string",
                "name": "ipfsDocHash",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "address",
                "name": "from",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "to",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "quantity",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ProductTracked",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "dispatchId",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "currentHolder",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "ipfsDocHash",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ProductUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "string",
                "name": "name",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "description",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "category",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "countryOfOrigin",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "manufacturer",
                "indexed": false,
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "price",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "quantity",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "importedDate",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "importerAddr",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "customsAddr",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleAdded",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false,
                "internalType": "address"
            },
            {
                "type": "uint8",
                "name": "role",
                "indexed": false,
                "internalType": "enum TraceChainRoles.Roles"
            }
        ],
        "outputs": [],
        "anonymous": false
    },
    {
        "type": "function",
        "name": "addAdmins",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addCustoms",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addProduct",
        "inputs": [
            {
                "type": "string",
                "name": "_name",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_description",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_category",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_countryOfOrigin",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_manufacturer",
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "_price",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "_quantity",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "_importedDate",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "_importerAddr",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "_customsAddr",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "admins",
        "inputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "approveDistributor",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approveImporter",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approveRetailer",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approveRole",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "_role",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "confirmDelivery",
        "inputs": [
            {
                "type": "uint256",
                "name": "_dispatchId",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "customs",
        "inputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "deleteAdmins",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "deleteCustoms",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "detectRole",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": "roleName",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "dispatchCounter",
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "dispatchProductToDistributor",
        "inputs": [
            {
                "type": "uint256",
                "name": "_productId",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "_to",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "_ipfsDocHash",
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "_quantity",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "dispatchProductToImporter",
        "inputs": [
            {
                "type": "uint256",
                "name": "_productId",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "_to",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "_ipfsDocHash",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "dispatchProductToRetailer",
        "inputs": [
            {
                "type": "uint256",
                "name": "_productId",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "_to",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "_ipfsDocHash",
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "_quantity",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "dispatches",
        "inputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "productId",
                "internalType": "uint256"
            },
            {
                "type": "string",
                "name": "ipfsDocHash",
                "internalType": "string"
            },
            {
                "type": "address",
                "name": "from",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "to",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "quantity",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getAllAdmins",
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": "",
                "internalType": "address[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getAllCustoms",
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
                "name": "",
                "internalType": "address[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getApplictions",
        "inputs": [],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "address_registered",
                        "internalType": "address"
                    },
                    {
                        "type": "string",
                        "name": "name",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "locAddress",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "contractNumber",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "countryOfOrigin",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "tinNumber",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "vatRegNumber",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "ipfsDocHash",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "role",
                        "internalType": "string"
                    }
                ],
                "internalType": "struct TraceChainRoles.RegRoles[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getOthersParty",
        "inputs": [
            {
                "type": "string",
                "name": "_role",
                "internalType": "string"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": "",
                "internalType": "address[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getProductHistory",
        "inputs": [
            {
                "type": "uint256",
                "name": "_productId",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "dispatchId",
                        "internalType": "uint256"
                    },
                    {
                        "type": "address",
                        "name": "currentHolder",
                        "internalType": "address"
                    },
                    {
                        "type": "string",
                        "name": "ipfsDocHash",
                        "internalType": "string"
                    },
                    {
                        "type": "uint256",
                        "name": "timestamp",
                        "internalType": "uint256"
                    }
                ],
                "internalType": "struct TraceChainTrack.Track[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getSingleApplication",
        "inputs": [
            {
                "type": "address",
                "name": "_owner",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "address_registered",
                        "internalType": "address"
                    },
                    {
                        "type": "string",
                        "name": "name",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "locAddress",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "contractNumber",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "countryOfOrigin",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "tinNumber",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "vatRegNumber",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "ipfsDocHash",
                        "internalType": "string"
                    },
                    {
                        "type": "string",
                        "name": "role",
                        "internalType": "string"
                    }
                ],
                "internalType": "struct TraceChainRoles.RegRoles"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "initialize",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "isAdmin",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isCustoms",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isDistributor",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isImporter",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isRetailer",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "others",
        "inputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "productCounter",
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "products",
        "inputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": "name",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "description",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "category",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "countryOfOrigin",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "manufacturer",
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "price",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "quantity",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "importedDate",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "importerAddr",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "customsAddr",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "regForRole",
        "inputs": [
            {
                "type": "string",
                "name": "_name",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_locAddress",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_contractNumber",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_countryOfOrigin",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_tinNumber",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_vatRegNumber",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_ipfsDocHash",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_role",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "revokeRole",
        "inputs": [
            {
                "type": "address",
                "name": "_account",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "roles",
        "inputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "account",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "approvedBy",
                "internalType": "address"
            },
            {
                "type": "uint8",
                "name": "role",
                "internalType": "enum TraceChainRoles.Roles"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "rolesData",
        "inputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "address_registered",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "name",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "locAddress",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "contractNumber",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "countryOfOrigin",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "tinNumber",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "vatRegNumber",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "ipfsDocHash",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "role",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "trackCounter",
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "trackProduct",
        "inputs": [
            {
                "type": "uint256",
                "name": "_dispatchId",
                "internalType": "uint256"
            },
            {
                "type": "string",
                "name": "_ipfsDocHash",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "tracks",
        "inputs": [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "dispatchId",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "currentHolder",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "ipfsDocHash",
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "updateProduct",
        "inputs": [
            {
                "type": "uint256",
                "name": "_id",
                "internalType": "uint256"
            },
            {
                "type": "string",
                "name": "_name",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_description",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_category",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_countryOfOrigin",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_manufacturer",
                "internalType": "string"
            },
            {
                "type": "uint256",
                "name": "_price",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "_quantity",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "_importedDate",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "_importerAddr",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "_customsAddr",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
]