// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Pausable } from '@openzeppelin/contracts/utils/Pausable.sol';


/**
 * @title Gov Token
 * @author Meme Merge
 * @notice Meme Token is a token that can be used to buy and sell meme tokens.
 */
contract Token is ERC20, ERC20Burnable, Ownable, Pausable {

    uint8 private _decimals = 18;

    mapping(address => bool) public frozenAccount;
    mapping(address => uint256) public lockedAccount;

    event FreezeAccount(address indexed account, bool frozen);
    event LockAccount(address indexed account, uint256 unlockTime);

    /**
     * @dev Contract constructor.
     */
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) Ownable(msg.sender){        
        _mint(msg.sender, initialSupply * (10 ** _decimals));  // owner의 토큰 발행
    }

    /**
     * @dev Returns the number of decimals used for token display.
     * @return The number of decimals.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Freezes an account.
     * @param account The address to freeze.
     * @param freeze The boolean value to set for the account.
     */
    function setFrozenAccount(address account, bool freeze) public onlyOwner {
        frozenAccount[account] = freeze;
        emit FreezeAccount(account, freeze);
    }

    /**
     * @dev Locks an account.
     * @param account The address to lock.
     * @param unlockTime The timestamp at which the account will be unlocked.
     */
    function lockAccount(address account, uint256 unlockTime) public onlyOwner {
        require(unlockTime > block.timestamp, "Unlock time must be in the future");
        lockedAccount[account] = unlockTime;
        emit LockAccount(account, unlockTime);
    }

    /**
     * @dev Unlocks an account.
     * @param account The address to unlock.
     */
    function unlockAccount(address account) public onlyOwner {
        lockedAccount[account] = 0;
        emit LockAccount(account, 0);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal override(ERC20) whenNotPaused {
        if (frozenAccount[from]) {
            revert ERC20InvalidSender(from);
        }
        if (frozenAccount[to]) {
            revert ERC20InvalidReceiver(to);
        }
        if (isAccountLocked(from)) {
            revert ERC20InvalidSender(from);
        }
        
        super._update(from, to, value);
    }

    /**
     * @dev Checks if an account is locked.
     * @param account The address to check.
     * @return True if the account is locked, false otherwise.
     */
    function isAccountLocked(address account) public view returns (bool) {
        return lockedAccount[account] > block.timestamp;
    }    
}