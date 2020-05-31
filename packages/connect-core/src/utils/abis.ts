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
