export const erc20ABI = [
  'function balanceOf(address _who) public view returns (uint256)',
  'function allowance(address _owner, address _spender) public view returns (uint256)',
  'function approve(address _spender, uint256 _value) public returns (bool)',
]

export const forwarderAbi = [
  'function forward(bytes evmCallScript) public',
  'function isForwarder() external pure returns (bool)',
  'function canForward(address sender, bytes evmCallScript) public view returns (bool)',
]

export const forwarderFeeAbi = [
  'function forwardFee() external view returns (address, uint256)',
]

export const miniMeAbi = [
  'function balanceOf(address _owner) external view returns (uint256)',
  'function balanceOfAt(address _owner, uint256 _blockNumber) external view returns (uint256)',
]

export const arbitratorAbi = [
  {
    "inputs": [],
    "name": "getDisputeFees",
    "outputs": [
      { "name": "recipient", "type": "address" },
      { "name": "feeToken", "type": "address" },
      { "name": "feeAmount", "type": "uint256" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
]
