/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from '../src/utils/scaffold-eth/contract';

const deployedContracts = {
  1337: {
    MockERC20: {
      address: '0x48A0b772E0471c2b5a5a180fF2468A0E1E9dC66C',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'spender',
              type: 'address'
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256'
            }
          ],
          name: 'Approval',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256'
            }
          ],
          name: 'Transfer',
          type: 'event'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address'
            },
            {
              internalType: 'address',
              name: 'spender',
              type: 'address'
            }
          ],
          name: 'allowance',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address'
            }
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'burn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [],
          name: 'decimals',
          outputs: [
            {
              internalType: 'uint8',
              name: '',
              type: 'uint8'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'subtractedValue',
              type: 'uint256'
            }
          ],
          name: 'decreaseAllowance',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'addedValue',
              type: 'uint256'
            }
          ],
          name: 'increaseAllowance',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [],
          name: 'mint',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256'
            }
          ],
          name: 'transfer',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256'
            }
          ],
          name: 'transferFrom',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      inheritedFunctions: {
        allowance: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        approve: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        balanceOf: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        decimals: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        decreaseAllowance: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        increaseAllowance: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        name: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        symbol: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        totalSupply: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        transfer: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
        transferFrom: '@openzeppelin/contracts/token/ERC20/ERC20.sol'
      }
    },
    MockNFT: {
      address: '0x5498b72C1ffdCB1b21f245e22fF9201ACac1b3Dc',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'approved',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'Approval',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address'
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'approved',
              type: 'bool'
            }
          ],
          name: 'ApprovalForAll',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'Transfer',
          type: 'event'
        },
        {
          inputs: [],
          name: 'TOKEN_URI',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address'
            }
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'getApproved',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address'
            },
            {
              internalType: 'address',
              name: 'operator',
              type: 'address'
            }
          ],
          name: 'isApprovedForAll',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'mint',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'ownerOf',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 's_tokenCounter',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes'
            }
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address'
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool'
            }
          ],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4'
            }
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_tokenId',
              type: 'uint256'
            }
          ],
          name: 'tokenURI',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'transferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      inheritedFunctions: {
        approve: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        balanceOf: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        getApproved: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        isApprovedForAll: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        name: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        ownerOf: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        safeTransferFrom: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        setApprovalForAll: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        supportsInterface: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        symbol: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        tokenURI: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
        transferFrom: '@openzeppelin/contracts/token/ERC721/ERC721.sol'
      }
    },
    YourContract: {
      address: '0xEF463B44664b9754A4421Ee7d16F8Ee05280847D',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_owner',
              type: 'address'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'greetingSetter',
              type: 'address'
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'newGreeting',
              type: 'string'
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'premium',
              type: 'bool'
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256'
            }
          ],
          name: 'GreetingChange',
          type: 'event'
        },
        {
          inputs: [],
          name: 'greeting',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'premium',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_newGreeting',
              type: 'string'
            }
          ],
          name: 'setGreeting',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        },
        {
          inputs: [],
          name: 'totalCounter',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address'
            }
          ],
          name: 'userGreetingCounter',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          stateMutability: 'payable',
          type: 'receive'
        }
      ],
      inheritedFunctions: {}
    }
  }
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
