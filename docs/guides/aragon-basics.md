# Aragon Basics

This guide will explain most of the Aragon concepts that can be helpful when building anything with Aragon Connect.

## What is an Aragon Organization?

Aragon is an open-source suite of applications and services that enable new forms of global communities (or <a href="https://aragon.org/dao"><abbr title="Decentralized autonomous organization">DAO</abbr>s</a>.) Communities can organize around capital assets, currency, or tokens, which will increase in value as more people hold and use that asset to participate in the community. These tools enable people to turn a community, cause, or even just a meme into its own economy. We can unlock a long-tail of <abbr title="Decentralized autonomous organization">DAO</abbr> communities that could not have existed otherwise.

Aragon not only provides basic financial tools like tokenization but can create reproducible and broadly applicable templates for defining the boundaries of a community and flowing value to contributors over the internet without traditional intermediaries like banks.

An Aragon Organization is represented by _a collection of smart contracts_ that are deployed on the Ethereum network. They are controlled by a specific set of rules, and can be interact with from tools like [the Aragon client](https://mainnet.aragon.org/), [aragonCLI](https://hack.aragon.org/docs/cli-intro.html), or [Aragon Connect](https://aragon.org/connect).

![](./assets/basics-organization.png)

## Aragon apps

An essential part of an Aragon Organization is that it contains apps. Apps consist of two things: a smart contract and an optional user interface that allow to interact with it.

Apps can be installed, updated, or removed from an Organization.

## Permissions

The permissions are managed by the <abbr title="Access-control list">ACL</abbr> core app. It essentially contains who has permission to execute an action in an Aragon app, and who can re-grant or revoke that permission. Most generally, an entity can hold the permission to call a function protected by Role in an App, and their permission is managed by a Manager, who can revoke or regrant that permission.

## Forwarding paths

Use forwarders to allow app interoperability and governance. The <abbr title="Access-control list">ACL</abbr> allows Aragon apps to be interoperable by creating and managing permissions. For example, a *Token Manager* app may send an action to the *Voting* app so if a vote passes the *Voting* app can withdraw funds from the *Finance* app. This is possible thanks to Forwarders. A **Forwarder** is a contract that, given some conditions, will pass along a certain action to other contract(s).

Below is an extract of our *Voting* app and is all the code required to make it a Forwarder:

```solidity
pragma solidity 0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/common/IForwarder.sol";

contract Voting is IForwarder, AragonApp {
    /**
    * @notice Creates a vote to execute the desired action, and casts a support vote
    * @param _evmScript Start vote with script
    */function forward(bytes _evmScript) public {
        require(canForward(msg.sender, _evmScript));
        _newVote(_evmScript, "", true);
    }

    function canForward(address _sender, bytes _evmCallScript) public view returns (bool) {
        return canPerform(_sender, CREATE_VOTES_ROLE, arr());
    }

    function isForwarder() public pure returns (bool) {
        return true;
    }
}
```

`canForward` checks if a caller `canPerform` the action `CREATE_VOTES_ROLE`. If it can, it means the caller can create a vote.

`forward` checks if a caller `canForward`, and if it can, it creates a new vote with an `_evmScript`.

This `_evmScript` is the action that will be executed if the voting passes, which can be withdrawing some funds from a *Finance* app, for example, but it can be any other action. The action is abstracted and doesn't need to be known in advance.

## Human readable transactions

A big part of Aragon is user-friendliness, and one of the most unfriendly things in the Ethereum world is transaction data. Examine this screenshot of a transaction in MetaMask:

![](https://hack.aragon.org/docs/assets/metamask.png)

Would you know what this transaction does? Not even a developer could tell. This is why we created Radspec.

Radspec is a secure alternative to Natspec. Natspec was supposed to be a way to describe transactions from a Natspec *expression* and some transaction data.

The issue with Natspec, however, is that it is insecure. Any JavaScript can execute in Natspec which opens up a lot of potential attacks, like cross-site scripting, which might successfully phish users.
